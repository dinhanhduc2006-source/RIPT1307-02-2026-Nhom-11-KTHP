package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.Notification;
import com.lending.backend.entity.User;
import com.lending.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseResult<List<Notification>> getMyNotifications(@AuthenticationPrincipal User user) {
        return ResponseResult.success(notificationService.getNotificationsByUser(user.getId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseResult<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseResult.success();
    }
}
