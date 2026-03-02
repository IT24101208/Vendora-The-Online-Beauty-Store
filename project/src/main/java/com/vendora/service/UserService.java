package com.vendora.service;

import com.vendora.dto.RegisterRequest;
import com.vendora.model.User;

public interface UserService {
    User register(RegisterRequest request);
}