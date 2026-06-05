package com.lending.backend.mapper;

import com.lending.backend.dto.UserResponse;
import com.lending.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .avatar(user.getAvatar())
                .build();
    }
}
