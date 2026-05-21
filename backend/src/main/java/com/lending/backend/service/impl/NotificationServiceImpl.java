package com.lending.backend.service.impl;

import com.lending.backend.entity.BorrowRequest;
import com.lending.backend.entity.Notification;
import com.lending.backend.entity.User;
import com.lending.backend.enums.NotificationType;
import com.lending.backend.repository.NotificationRepository;
import com.lending.backend.service.EmailService;
import com.lending.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    @Override
    public void createNotification(User user, BorrowRequest request, String title, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .user(user)
                .request(request)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();

        // Send email if user has email
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            String htmlContent = String.format(
                "<h3>Xin chào %s,</h3>" +
                "<p>%s</p>" +
                "<br/>" +
                "<p>Đây là thông báo tự động từ hệ thống Quản lý thiết bị. Vui lòng không phản hồi email này.</p>",
                user.getFullName(), message
            );
            emailService.sendSimpleEmail(user.getEmail(), "[Lending System] " + title, htmlContent);
            notification.setEmailSent(true);
            notification.setEmailSentAt(LocalDateTime.now());
        }

        notificationRepository.save(notification);
    }
}
