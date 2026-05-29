package com.lending.backend.service;

import com.lending.backend.entity.LoanRequest;
import com.lending.backend.enums.LoanRequestStatus;
import java.time.LocalDate;
import java.util.List;

public interface LoanRequestService {
    LoanRequest createRequest(Long userId, Long equipmentId, LocalDate borrowDate, LocalDate returnDate);
    LoanRequest approveRequest(Long requestId, Long adminId);
    LoanRequest rejectRequest(Long requestId, Long adminId, String reason);
    LoanRequest returnEquipment(Long requestId, Long adminId);
    List<LoanRequest> getMyRequests(Long userId);
    List<LoanRequest> getAllRequests();
}
