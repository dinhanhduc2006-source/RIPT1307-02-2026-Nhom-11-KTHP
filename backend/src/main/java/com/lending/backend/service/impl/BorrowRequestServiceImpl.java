package com.lending.backend.service.impl;

import com.lending.backend.dto.BorrowCreateRequest;
import com.lending.backend.dto.BorrowRequestResponse;
import com.lending.backend.entity.*;
import com.lending.backend.enums.BorrowItemStatus;
import com.lending.backend.enums.BorrowRequestStatus;
import com.lending.backend.enums.NotificationType;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.mapper.BorrowMapper;
import com.lending.backend.repository.*;
import com.lending.backend.service.BorrowRequestService;
import com.lending.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BorrowRequestServiceImpl implements BorrowRequestService {

    private final BorrowRequestRepository borrowRequestRepository;
    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationService notificationService;
    private final BorrowMapper borrowMapper;

    @Override
    @Transactional
    public BorrowRequestResponse createRequest(Long userId, BorrowCreateRequest request) {
        if (request.getBorrowDate().isAfter(request.getReturnDate())) {
            throw new AppException(ErrorCode.INVALID_BORROW_DATE);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        BorrowRequest borrowRequest = BorrowRequest.builder()
                .user(user)
                .borrowDate(request.getBorrowDate())
                .returnDate(request.getReturnDate())
                .note(request.getNote())
                .priority(request.getPriority())
                .status(BorrowRequestStatus.pending)
                .build();

        List<BorrowRequestItem> items = request.getItems().stream().map(itemRequest -> {
            Equipment equipment = equipmentRepository.findById(itemRequest.getEquipmentId())
                    .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
            
            if (equipment.getStatus() != com.lending.backend.enums.EquipmentStatus.available) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK); // Or a more specific error like EQUIPMENT_NOT_AVAILABLE
            }
            
            return BorrowRequestItem.builder()
                    .request(borrowRequest)
                    .equipment(equipment)
                    .quantity(itemRequest.getQuantity())
                    .itemStatus(BorrowItemStatus.pending)
                    .build();
        }).collect(Collectors.toList());

        borrowRequest.setItems(items);
        return borrowMapper.toBorrowRequestResponse(borrowRequestRepository.save(borrowRequest));
    }

    @Override
    public List<BorrowRequestResponse> getRequestsByUser(Long userId) {
        return borrowRequestRepository.findByUserId(userId).stream()
                .map(borrowMapper::toBorrowRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BorrowRequestResponse> getAllRequests() {
        return borrowRequestRepository.findAll().stream()
                .map(borrowMapper::toBorrowRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BorrowRequestResponse updateRequestStatus(Long requestId, BorrowRequestStatus status, String adminNote, Long adminId) {
        BorrowRequest borrowRequest = borrowRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        BorrowRequestStatus oldStatus = borrowRequest.getStatus();
        User requester = borrowRequest.getUser();

        // 1. Logic for Check-out (Pick up)
        if (status == BorrowRequestStatus.borrowed && oldStatus == BorrowRequestStatus.approved) {
            for (BorrowRequestItem item : borrowRequest.getItems()) {
                Equipment equipment = item.getEquipment();
                if (equipment.getAvailableQuantity() < item.getQuantity()) {
                    throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
                }
                equipment.setAvailableQuantity(equipment.getAvailableQuantity() - item.getQuantity());
                equipmentRepository.save(equipment);
            }
            borrowRequest.setActualBorrowDate(LocalDateTime.now());
            logAudit(admin, "CHECK_OUT", "borrow_requests", requestId, "Equipment picked up by student");
            notificationService.createNotification(requester, borrowRequest, "Đã nhận thiết bị", 
                "Bạn đã nhận thiết bị thành công cho yêu cầu #" + requestId, NotificationType.system);
        } 
        // 2. Logic for Check-in (Return)
        else if (status == BorrowRequestStatus.returned && oldStatus == BorrowRequestStatus.borrowed) {
            for (BorrowRequestItem item : borrowRequest.getItems()) {
                Equipment equipment = item.getEquipment();
                equipment.setAvailableQuantity(equipment.getAvailableQuantity() + item.getQuantity());
                equipmentRepository.save(equipment);
            }
            borrowRequest.setActualReturnDate(LocalDateTime.now());
            logAudit(admin, "CHECK_IN", "borrow_requests", requestId, "Equipment returned by student");
            notificationService.createNotification(requester, borrowRequest, "Đã trả thiết bị", 
                "Hệ thống đã xác nhận bạn hoàn trả thiết bị cho yêu cầu #" + requestId, NotificationType.return_confirmed);
        }
        // 3. Logic for Approval
        else if (status == BorrowRequestStatus.approved && oldStatus == BorrowRequestStatus.pending) {
            borrowRequest.setApprovedBy(admin);
            borrowRequest.setApprovedAt(LocalDateTime.now());
            logAudit(admin, "APPROVE_REQUEST", "borrow_requests", requestId, "Request approved");
            notificationService.createNotification(requester, borrowRequest, "Yêu cầu mượn đồ đã được duyệt", 
                "Yêu cầu mượn đồ #" + requestId + " của bạn đã được phê duyệt. Vui lòng đến nhận đồ.", NotificationType.request_approved);
        }
        // 4. Logic for Rejection
        else if (status == BorrowRequestStatus.rejected && oldStatus == BorrowRequestStatus.pending) {
            logAudit(admin, "REJECT_REQUEST", "borrow_requests", requestId, "Request rejected: " + adminNote);
            notificationService.createNotification(requester, borrowRequest, "Yêu cầu mượn đồ bị từ chối", 
                "Yêu cầu mượn đồ #" + requestId + " của bạn đã bị từ chối. Lý do: " + adminNote, NotificationType.request_rejected);
        }

        borrowRequest.setStatus(status);
        borrowRequest.setAdminNote(adminNote);
        
        return borrowMapper.toBorrowRequestResponse(borrowRequestRepository.save(borrowRequest));
    }

    private void logAudit(User user, String action, String table, Long recordId, String desc) {
        AuditLog log = AuditLog.builder()
                .user(user)
                .action(action)
                .tableName(table)
                .recordId(recordId)
                .description(desc)
                .build();
        auditLogRepository.save(log);
    }

    @Override
    public BorrowRequestResponse getRequestById(Long id) {
        BorrowRequest borrowRequest = borrowRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return borrowMapper.toBorrowRequestResponse(borrowRequest);
    }
}
