package com.lending.backend.service;

public interface EmailService {
    void sendSimpleEmail(String to, String subject, String text);
}
