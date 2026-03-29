package com.vendora.epic1.service.impl;

import com.vendora.epic1.dto.auth.AdminRegisterRequest;
import com.vendora.epic1.dto.auth.AuthResponse;
import com.vendora.epic1.dto.auth.CustomerRegisterRequest;
import com.vendora.epic1.dto.auth.ForgotPasswordRequest;
import com.vendora.epic1.dto.auth.LoginRequest;
import com.vendora.epic1.dto.auth.LoginResponse;
import com.vendora.epic1.dto.auth.MessageResponse;
import com.vendora.epic1.dto.auth.ResendVerificationRequest;
import com.vendora.epic1.dto.auth.ResetPasswordRequest;
import com.vendora.epic1.dto.auth.SetPasswordRequest;
import com.vendora.epic1.dto.auth.VerifyEmailRequest;
import com.vendora.epic1.exception.AccountDisabledException;
import com.vendora.epic1.exception.AccountNotVerifiedException;
import com.vendora.epic1.exception.BadRequestException;
import com.vendora.epic1.exception.DuplicateResourceException;
import com.vendora.epic1.exception.InvalidCredentialsException;
import com.vendora.epic1.model.EmailVerificationToken;
import com.vendora.epic1.model.User;
import com.vendora.epic1.model.enums.RoleType;
import com.vendora.epic1.model.enums.UserStatus;
import com.vendora.epic1.repository.EmailVerificationTokenRepository;
import com.vendora.epic1.repository.UserRepository;
import com.vendora.epic1.security.JwtService;
import com.vendora.epic1.service.AuthService;
import com.vendora.epic1.service.EmailService;
import com.vendora.epic1.service.EmailVerificationService;
import com.vendora.epic1.service.PasswordService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
    private static final long VERIFICATION_TOKEN_EXPIRY_HOURS = 48;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final EmailService emailService;
    private final EmailVerificationService emailVerificationService;
    private final PasswordService passwordService;

    @Override
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = request.getUsernameOrEmail().trim().toLowerCase();

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );

            if (!authentication.isAuthenticated()) {
                throw new InvalidCredentialsException("Invalid email or password");
            }
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        validateLoginEligibility(user);

        LoginResponse response = new LoginResponse();
        response.setAccessToken(jwtService.generateToken(user.getEmail()));
        response.setTokenType("Bearer");
        response.setRefreshToken(null);
        return response;
    }

    @Override
    @Transactional
    public AuthResponse registerCustomer(CustomerRegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = new User();
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(RoleType.ROLE_CUSTOMER);
        user.setStatus(UserStatus.PENDING_VERIFICATION);
        user.setIsEmailVerified(false);

        userRepository.save(user);

        createAndSendVerificationToken(user);

        AuthResponse response = new AuthResponse();
        response.setSuccess(true);
        response.setMessage("Registration successful. Check your email to verify your account.");
        return response;
    }

    @Override
    @Transactional
    public AuthResponse registerAdmin(AdminRegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = new User();
        user.setFirstName(request.getUsername().trim());
        user.setLastName("Admin");
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(RoleType.ROLE_ADMIN);
        user.setStatus(UserStatus.ACTIVE);
        user.setIsEmailVerified(true);

        userRepository.save(user);

        AuthResponse response = new AuthResponse();
        response.setSuccess(true);
        response.setMessage("Admin registered successfully.");
        return response;
    }

    @Override
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        return passwordService.forgotPassword(request);
    }

    @Override
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        return passwordService.resetPassword(request);
    }

    @Override
    public MessageResponse verifyEmail(VerifyEmailRequest request) {
        return emailVerificationService.verifyEmail(request);
    }

    @Override
    @Transactional
    public MessageResponse resendVerification(ResendVerificationRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("No account found for this email"));

        if (Boolean.TRUE.equals(user.getIsEmailVerified())) {
            throw new BadRequestException("Email is already verified");
        }

        createAndSendVerificationToken(user);

        return new MessageResponse("Verification email has been sent.");
    }

    @Override
    public MessageResponse setPasswordWithToken(SetPasswordRequest request) {
        return passwordService.setPasswordWithToken(request);
    }

    private void validateLoginEligibility(User user) {
        if (user.getStatus() == UserStatus.DELETED || user.getStatus() == UserStatus.SUSPENDED) {
            throw new AccountDisabledException("This account cannot sign in.");
        }

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new AccountDisabledException("Account is inactive. Complete setup or contact support.");
        }

        if (!Boolean.TRUE.equals(user.getIsEmailVerified())) {
            throw new AccountNotVerifiedException("Please verify your email before signing in.");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new AccountDisabledException("Account is not active.");
        }
    }

    private void createAndSendVerificationToken(User user) {
        emailVerificationTokenRepository.deleteByUser(user);

        String rawToken = UUID.randomUUID().toString();
        EmailVerificationToken token = new EmailVerificationToken(
                rawToken,
                user,
                Instant.now().plus(VERIFICATION_TOKEN_EXPIRY_HOURS, ChronoUnit.HOURS)
        );

        emailVerificationTokenRepository.save(token);

        try {
            emailService.sendVerificationEmail(user.getEmail(), rawToken);
        } catch (Exception e) {
            log.warn("Verification email not sent to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}