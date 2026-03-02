package com.vendora.controller;

import com.vendora.common.ApiResponse;
import com.vendora.dto.RegisterRequest;
import com.vendora.model.User;
import com.vendora.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ApiResponse<User> register(
            @RequestBody RegisterRequest request) {

        return new ApiResponse<>(
                "User Registered Successfully",
                service.register(request)
        );
    }
}