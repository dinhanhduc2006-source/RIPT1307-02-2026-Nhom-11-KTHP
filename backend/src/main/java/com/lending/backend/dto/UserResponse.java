package com.lending.backend.dto;

import com.lending.backend.enums.UserRole;
import com.lending.backend.enums.UserStatus;
import lombok.*;

@Data
@NoArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private UserRole role;
    private UserStatus status;
    private String avatar;

    // Manual AllArgsConstructor to ensure absolute compiler consistency
    public UserResponse(Long id, String username, String email, UserRole role, UserStatus status, String avatar) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.status = status;
        this.avatar = avatar;
    }
}
