package com.lending.backend.service;

import com.lending.backend.entity.BorrowRequest;
import com.lending.backend.entity.User;
import com.lending.backend.enums.NotificationType;

public interface NotificationService {
    void createNotification(User user, BorrowRequest request, String title, String message, NotificationType type);
}
