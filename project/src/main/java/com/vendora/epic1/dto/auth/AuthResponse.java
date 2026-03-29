package com.vendora.epic1.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private boolean success;
    private String message;
}