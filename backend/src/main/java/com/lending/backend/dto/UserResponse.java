package com.lending.backend.dto;

import com.lending.backend.enums.UserRole;
import com.lending.backend.enums.UserStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private UserRole role;
    private UserStatus status;
}
