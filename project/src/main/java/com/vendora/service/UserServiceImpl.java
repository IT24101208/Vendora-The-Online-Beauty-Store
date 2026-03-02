package com.vendora.service.impl;

import com.vendora.common.UserRole;
import com.vendora.dto.RegisterRequest;
import com.vendora.model.Role;
import com.vendora.model.User;
import com.vendora.repository.RoleRepository;
import com.vendora.repository.UserRepository;
import com.vendora.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder encoder;

    public UserServiceImpl(UserRepository userRepo,
                           RoleRepository roleRepo,
                           PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.encoder = encoder;
    }

    @Override
    public User register(RegisterRequest request) {

        Role role = roleRepo
                .findByName(UserRole.CUSTOMER)
                .orElseThrow();

        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPassword(
                encoder.encode(request.password));
        user.setRole(role);

        return userRepo.save(user);
    }
}