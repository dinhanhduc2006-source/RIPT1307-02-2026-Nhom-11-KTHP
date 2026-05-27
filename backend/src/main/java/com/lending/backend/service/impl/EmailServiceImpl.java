package com.lending.backend.service.impl;

import com.lending.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender emailSender;

    @Override
    public void sendSimpleMessage(String to, String subject, String text) {
        if (to == null || to.isEmpty()) return;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    @Override
    public void sendOverdueReminder(String to, String equipmentName, LocalDate returnDate) {
        String subject = "REMINDER: Equipment Return Due Tomorrow";
        String text = String.format("Dear user, your loan for '%s' is due on %s. Please return it on time to avoid fines.", 
            equipmentName, returnDate.toString());
        sendSimpleMessage(to, subject, text);
    }
}
