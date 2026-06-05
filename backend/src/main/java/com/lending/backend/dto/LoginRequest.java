package com.lending.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email hoặc tên đăng nhập không được để trống")
    private String identifier;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}
