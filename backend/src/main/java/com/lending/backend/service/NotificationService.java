package com.lending.backend.service;

import com.lending.backend.entity.Notification;
import com.lending.backend.entity.User;
import com.lending.backend.enums.NotificationType;
import java.util.List;

public interface NotificationService {
    void createNotification(User user, BorrowRequest request, String title, String message, NotificationType type);
    List<Notification> getNotificationsByUser(Long userId);
    void markAsRead(Long notificationId);
}
