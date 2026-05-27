package com.lending.backend.service.impl;

import com.lending.backend.entity.*;
import com.lending.backend.enums.*;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.repository.*;
import com.lending.backend.service.AuditLogService;
import com.lending.backend.service.EmailService;
import com.lending.backend.service.LoanRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanRequestServiceImpl implements LoanRequestService {

    private final LoanRequestRepository loanRequestRepository;
    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;
    private final PenaltyRepository penaltyRepository;
    private final SystemConfigRepository systemConfigRepository;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    @Override
    @Transactional
    public LoanRequest createRequest(Long userId, Long equipmentId, String borrowDate, String returnDate) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        Equipment equipment = equipmentRepository.findById(equipmentId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        SystemConfig config = systemConfigRepository.findById(1).orElse(new SystemConfig());

        LocalDate bDate = LocalDate.parse(borrowDate);
        LocalDate rDate = LocalDate.parse(returnDate);

        // 4.4 Borrow Eligibility Verification
        if (!config.getAllowBorrowWhenDebt() && penaltyRepository.existsByUserAndStatus(user, PenaltyStatus.Unpaid)) {
            throw new AppException(ErrorCode.USER_HAS_DEBT); // Need to add this to ErrorCode
        }
        if (loanRequestRepository.existsByRequesterAndStatusAndReturnDateBefore(user, LoanRequestStatus.Approved, LocalDate.now())) {
            throw new AppException(ErrorCode.USER_HAS_OVERDUE); // Need to add this to ErrorCode
        }
        if (rDate.isBefore(bDate)) {
            throw new AppException(ErrorCode.INVALID_BORROW_DATE);
        }

        LoanRequest request = LoanRequest.builder()
                .requester(user)
                .equipment(equipment)
                .borrowDate(bDate)
                .returnDate(rDate)
                .status(LoanRequestStatus.Pending)
                .build();

        return loanRequestRepository.save(request);
    }

    @Override
    @Transactional
    public LoanRequest approveRequest(Long requestId, Long adminId) {
        LoanRequest request = loanRequestRepository.findById(requestId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        User admin = userRepository.findById(adminId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        Equipment equipment = request.getEquipment();

        // 4.1 Loan Request Approval Logic
        if (equipment.getAvailable() <= 0) {
            throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
        }

        request.setStatus(LoanRequestStatus.Approved);
        equipment.setAvailable(equipment.getAvailable() - 1);
        if (equipment.getAvailable() == 0) {
            equipment.setStatus(EquipmentStatus.OutOfStock);
        }

        equipmentRepository.save(equipment);
        LoanRequest updated = loanRequestRepository.save(request);

        auditLogService.log(admin, "Approve Request", 
            String.format("Admin: %s, Requester: %s, Equipment: %s", admin.getUsername(), request.getRequester().getUsername(), equipment.getName()));
        
        emailService.sendSimpleMessage(request.getRequester().getEmail(), "Loan Request Approved", "Your request #" + requestId + " has been approved.");

        return updated;
    }

    @Override
    @Transactional
    public LoanRequest rejectRequest(Long requestId, Long adminId, String reason) {
        LoanRequest request = loanRequestRepository.findById(requestId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        User admin = userRepository.findById(adminId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        request.setStatus(LoanRequestStatus.Rejected);
        request.setRejectReason(reason);
        
        emailService.sendSimpleMessage(request.getRequester().getEmail(), "Loan Request Rejected", "Your request #" + requestId + " has been rejected. Reason: " + reason);

        return loanRequestRepository.save(request);
    }

    @Override
    @Transactional
    public LoanRequest returnEquipment(Long requestId, Long adminId) {
        LoanRequest request = loanRequestRepository.findById(requestId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        User admin = userRepository.findById(adminId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        Equipment equipment = request.getEquipment();
        SystemConfig config = systemConfigRepository.findById(1).orElse(new SystemConfig());

        // 4.2 Equipment Return Logic
        request.setStatus(LoanRequestStatus.Returned);
        request.setReturnedAt(LocalDateTime.now());

        equipment.setAvailable(equipment.getAvailable() + 1);
        equipment.setStatus(EquipmentStatus.Available);
        equipmentRepository.save(equipment);

        // Overdue Check
        boolean isLate = LocalDate.now().isAfter(request.getReturnDate());
        String detail = String.format("Equipment returned: %s", equipment.getName());
        
        if (isLate) {
            long daysLate = ChronoUnit.DAYS.between(request.getReturnDate(), LocalDate.now());
            long fine = daysLate * config.getFinePerDay();

            Penalty penalty = Penalty.builder()
                    .user(request.getRequester())
                    .loanRequest(request)
                    .reason("Overdue return (" + daysLate + " days)")
                    .amount(fine)
                    .status(PenaltyStatus.Unpaid)
                    .date(LocalDate.now())
                    .build();
            penaltyRepository.save(penalty);
            
            detail += " (Overdue Violation)";
            emailService.sendSimpleMessage(config.getAdminEmail(), "New Penalty Issued", "User " + request.getRequester().getUsername() + " was fined " + fine + " VND.");
        }

        auditLogService.log(admin, "Return Equipment", detail);
        return loanRequestRepository.save(request);
    }

    @Override
    public List<LoanRequest> getMyRequests(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return loanRequestRepository.findByRequester(user);
    }

    @Override
    public List<LoanRequest> getAllRequests() {
        return loanRequestRepository.findAll();
    }
}
