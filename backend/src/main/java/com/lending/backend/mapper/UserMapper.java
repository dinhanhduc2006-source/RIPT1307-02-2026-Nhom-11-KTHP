package com.lending.backend.mapper;

import com.lending.backend.dto.UserResponse;
import com.lending.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponse toUserResponse(User user) {
        if (user == null) return null;

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .studentId(user.getStudentId())
                .phone(user.getPhone())
                .isActive(user.isActive())
                .build();
    }
}
