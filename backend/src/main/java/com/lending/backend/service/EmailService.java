package com.lending.backend.service;

import java.time.LocalDate;

public interface EmailService {
    void sendSimpleMessage(String to, String subject, String text);
    void sendOverdueReminder(String to, String equipmentName, LocalDate returnDate);
}
