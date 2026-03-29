package com.vendora.epic1.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String refreshToken;
}