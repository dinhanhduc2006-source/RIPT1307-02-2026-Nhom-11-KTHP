package com.lending.backend.service.job;

import com.lending.backend.entity.LoanRequest;
import com.lending.backend.enums.LoanRequestStatus;
import com.lending.backend.repository.LoanRequestRepository;
import com.lending.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OverdueCheckJob {

    private final LoanRequestRepository loanRequestRepository;
    private final EmailService emailService;

    // Runs every day at 1:00 AM
    @Scheduled(cron = "0 0 1 * * ?")
    public void checkOverdueAndSendReminders() {
        log.info("Starting automated overdue check and reminder job...");

        // 1. Send reminders for items due tomorrow
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<LoanRequest> dueTomorrow = loanRequestRepository.findByStatusAndReturnDateBefore(
                LoanRequestStatus.Approved, tomorrow.plusDays(1)); // Simple check for exact date
        
        for (LoanRequest request : dueTomorrow) {
            if (request.getReturnDate().equals(tomorrow)) {
                emailService.sendOverdueReminder(
                        request.getRequester().getEmail(),
                        request.getEquipment().getName(),
                        request.getReturnDate()
                );
            }
        }

        // 2. Alert for items that became overdue today
        List<LoanRequest> overdueToday = loanRequestRepository.findByStatusAndReturnDateBefore(
                LoanRequestStatus.Approved, LocalDate.now());
        
        for (LoanRequest request : overdueToday) {
            emailService.sendSimpleMessage(
                    request.getRequester().getEmail(),
                    "URGENT: Equipment Overdue",
                    "Your loan for '" + request.getEquipment().getName() + "' is now overdue. Fines are being applied daily."
            );
        }

        log.info("Automated job completed.");
    }
}
