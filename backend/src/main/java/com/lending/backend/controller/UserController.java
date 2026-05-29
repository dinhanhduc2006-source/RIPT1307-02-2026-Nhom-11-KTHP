package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.dto.UserResponse;
import com.lending.backend.entity.User;
import com.lending.backend.enums.UserStatus;
import com.lending.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final com.lending.backend.mapper.UserMapper userMapper;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<List<UserResponse>> getAll() {
        return ResponseResult.success(userService.getAll().stream()
                .map(userMapper::toUserResponse)
                .toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<UserResponse> getById(@PathVariable("id") Long id) {
        return ResponseResult.success(userMapper.toUserResponse(userService.getById(id)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<UserResponse> updateStatus(
            @PathVariable("id") Long id, 
            @RequestParam("status") UserStatus status) {
        return ResponseResult.success(userService.updateStatus(id, status));
    }

    @PostMapping("/{id}/change-password")
    public ResponseResult<String> changePassword(
            @PathVariable("id") Long id, 
            @RequestParam("oldPassword") String oldPassword, 
            @RequestParam("newPassword") String newPassword) {
        userService.changePassword(id, oldPassword, newPassword);
        return ResponseResult.success("Password changed successfully");
    }
}
