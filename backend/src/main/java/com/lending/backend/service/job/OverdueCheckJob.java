package com.lending.backend.service.job;

import com.lending.backend.entity.BorrowRequest;
import com.lending.backend.enums.BorrowRequestStatus;
import com.lending.backend.enums.NotificationType;
import com.lending.backend.repository.BorrowRequestRepository;
import com.lending.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OverdueCheckJob {

    private final BorrowRequestRepository borrowRequestRepository;
    private final NotificationService notificationService;

    // Runs every day at 1:00 AM
    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void checkOverdueRequests() {
        log.info("Starting overdue requests check job...");
        LocalDate today = LocalDate.now();
        
        // Find all requests that are currently 'borrowed' and whose return date is past today
        List<BorrowRequest> borrowedRequests = borrowRequestRepository.findByStatus(BorrowRequestStatus.borrowed);
        
        int count = 0;
        for (BorrowRequest request : borrowedRequests) {
            if (request.getReturnDate().isBefore(today)) {
                request.setStatus(BorrowRequestStatus.overdue);
                borrowRequestRepository.save(request);
                
                // Notify user
                notificationService.createNotification(
                    request.getUser(), 
                    request, 
                    "Cảnh báo: Thiết bị quá hạn trả", 
                    "Yêu cầu mượn đồ #" + request.getId() + " của bạn đã quá hạn trả (" + request.getReturnDate() + "). Vui lòng hoàn trả ngay.", 
                    NotificationType.overdue_warning
                );
                count++;
            }
        }
        
        log.info("Overdue check job finished. Updated {} requests to overdue status.", count);
    }
}
