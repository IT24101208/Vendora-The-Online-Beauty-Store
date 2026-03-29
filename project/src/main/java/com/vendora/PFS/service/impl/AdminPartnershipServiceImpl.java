package com.vendora.pfs.service.impl;

import com.vendora.epic1.exception.BadRequestException;
import com.vendora.epic1.exception.ResourceNotFoundException;
import com.vendora.epic1.model.PasswordResetToken;
import com.vendora.epic1.model.User;
import com.vendora.epic1.model.enums.RoleType;
import com.vendora.epic1.model.enums.UserStatus;
import com.vendora.epic1.repository.PasswordResetTokenRepository;
import com.vendora.epic1.repository.UserRepository;
import com.vendora.epic1.service.EmailService;
import com.vendora.pfs.dto.partnership.PartnershipApplicationResponse;
import com.vendora.pfs.dto.partnership.ReviewPartnershipRequest;
import com.vendora.pfs.model.PartnershipApplication;
import com.vendora.pfs.model.enums.ApplicationStatus;
import com.vendora.pfs.model.enums.ApplicationType;
import com.vendora.pfs.repository.PartnershipApplicationRepository;
import com.vendora.pfs.service.AdminPartnershipService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
public class AdminPartnershipServiceImpl implements AdminPartnershipService {

    private static final Logger log = LoggerFactory.getLogger(AdminPartnershipServiceImpl.class);

    private final PartnershipApplicationRepository partnershipApplicationRepository;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AdminPartnershipServiceImpl(
            PartnershipApplicationRepository partnershipApplicationRepository,
            UserRepository userRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.partnershipApplicationRepository = partnershipApplicationRepository;
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PartnershipApplicationResponse> getAllApplications() {
        return partnershipApplicationRepository.findAll().stream()
                .sorted(Comparator.comparing(PartnershipApplication::getSubmittedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(PartnershipServiceImpl::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PartnershipApplicationResponse getApplicationById(Long applicationId) {
        PartnershipApplication application = partnershipApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Partnership application not found"));
        return PartnershipServiceImpl.toResponse(application);
    }

    @Override
    @Transactional
    public PartnershipApplicationResponse reviewApplication(Long applicationId, ReviewPartnershipRequest request) {
        PartnershipApplication application = partnershipApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Partnership application not found"));

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new BadRequestException("Only pending applications can be reviewed.");
        }

        ApplicationStatus newStatus = request.getStatus();
        if (newStatus == ApplicationStatus.PENDING) {
            throw new BadRequestException("Choose APPROVED, REJECTED, or another final status.");
        }

        application.setStatus(newStatus);
        application.setAdminRemarks(request.getAdminRemarks());
        application.setReviewedAt(LocalDateTime.now());

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            userRepository.findByEmail(auth.getName()).ifPresent(application::setReviewedBy);
        }

        if (newStatus == ApplicationStatus.APPROVED) {
            provisionPartnerAccount(application);
        }

        PartnershipApplication saved = partnershipApplicationRepository.save(application);
        return PartnershipServiceImpl.toResponse(saved);
    }

    private void provisionPartnerAccount(PartnershipApplication application) {
        String email = application.getEmail().trim().toLowerCase();
        RoleType role = application.getApplicationType() == ApplicationType.SUPPLIER_PARTNERSHIP
                ? RoleType.ROLE_SUPPLIER
                : RoleType.ROLE_DELIVERY;

        User user = userRepository.findByEmail(email).orElseGet(() -> createPartnerUserEntity(application, role));
        if (user.getRole() != RoleType.ROLE_ADMIN && user.getRole() != role) {
            user.setRole(role);
        }
        user.setPhoneNumber(application.getPhoneNumber());
        user.setStatus(UserStatus.INACTIVE);
        user.setIsEmailVerified(true);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user = userRepository.save(user);
        application.setUser(user);

        passwordResetTokenRepository.deleteByUser(user);
        PasswordResetToken token = new PasswordResetToken(
                UUID.randomUUID().toString(),
                user,
                Instant.now().plus(72, ChronoUnit.HOURS)
        );
        passwordResetTokenRepository.save(token);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());
        } catch (Exception e) {
            log.warn("Could not send partner invitation email: {}", e.getMessage());
        }
    }

    private User createPartnerUserEntity(PartnershipApplication application, RoleType role) {
        String full = application.getContactPersonName() == null ? "" : application.getContactPersonName().trim();
        int sp = full.indexOf(' ');
        String first = sp > 0 ? full.substring(0, sp).trim() : full;
        String last = sp > 0 ? full.substring(sp + 1).trim() : "";

        User user = new User();
        user.setEmail(application.getEmail().trim().toLowerCase());
        user.setFirstName(first.isEmpty() ? "Partner" : first);
        user.setLastName(last);
        user.setRole(role);
        user.setStatus(UserStatus.INACTIVE);
        user.setIsEmailVerified(true);
        user.setPhoneNumber(application.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        return userRepository.save(user);
    }
}
