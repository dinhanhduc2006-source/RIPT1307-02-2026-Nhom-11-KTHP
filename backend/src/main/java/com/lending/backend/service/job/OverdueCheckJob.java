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

    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void checkOverdueRequests() {
        log.info("Starting overdue requests check job...");
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        
        List<BorrowRequest> borrowedRequests = borrowRequestRepository.findByStatus(BorrowRequestStatus.borrowed);
        
        int overdueCount = 0;
        int warningCount = 0;
        for (BorrowRequest request : borrowedRequests) {
            // Check for overdue
            if (request.getReturnDate().isBefore(today)) {
                request.setStatus(BorrowRequestStatus.overdue);
                borrowRequestRepository.save(request);
                
                notificationService.createNotification(
                    request.getUser(), 
                    request, 
                    "Cảnh báo: Thiết bị quá hạn trả", 
                    "Yêu cầu mượn đồ #" + request.getId() + " của bạn đã quá hạn trả (" + request.getReturnDate() + "). Vui lòng hoàn trả ngay.", 
                    NotificationType.overdue_warning
                );
                overdueCount++;
            } 
            // Check for due tomorrow (Warning)
            else if (request.getReturnDate().equals(tomorrow)) {
                notificationService.createNotification(
                    request.getUser(),
                    request,
                    "Nhắc nhở: Sắp đến hạn trả thiết bị",
                    "Yêu cầu mượn đồ #" + request.getId() + " của bạn sẽ hết hạn vào ngày mai (" + request.getReturnDate() + "). Vui lòng sắp xếp thời gian hoàn trả.",
                    NotificationType.system
                );
                warningCount++;
            }
        }
        
        log.info("Job finished. Updated {} overdue, sent {} warnings.", overdueCount, warningCount);
    }
}
