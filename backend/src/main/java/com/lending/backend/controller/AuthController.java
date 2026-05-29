package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.dto.AuthResponse;
import com.lending.backend.dto.LoginRequest;
import com.lending.backend.dto.RegisterRequest;
import com.lending.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseResult<String> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        authService.register(request);
        return ResponseResult.success("Đăng ký thành công. Vui lòng kiểm tra email (nếu có)");
    }

    @PostMapping("/login")
    public ResponseResult<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Received login request for identifier: {}", request.getIdentifier());
        return ResponseResult.success(authService.login(request));
    }

    @PostMapping("/refresh-token")
    public ResponseResult<AuthResponse> refreshToken(@RequestBody String refreshToken) {
        log.info("Received token refresh request");
        return ResponseResult.success(authService.refreshToken(refreshToken));
    }
}
