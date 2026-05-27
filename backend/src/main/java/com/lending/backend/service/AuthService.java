package com.lending.backend.service;

import com.lending.backend.dto.AuthResponse;
import com.lending.backend.dto.LoginRequest;
import com.lending.backend.dto.RegisterRequest;

public interface AuthService {
    void register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
}
