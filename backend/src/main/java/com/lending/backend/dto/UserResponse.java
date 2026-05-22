package com.lending.backend.dto;

import com.lending.backend.enums.UserRole;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private UserRole role;
    private String studentId;
    private String phone;
    private boolean isActive;
}
