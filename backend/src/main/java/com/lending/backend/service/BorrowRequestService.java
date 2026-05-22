package com.lending.backend.service;

import com.lending.backend.dto.BorrowCreateRequest;
import com.lending.backend.dto.BorrowRequestResponse;
import com.lending.backend.enums.BorrowRequestStatus;

import java.util.List;

public interface BorrowRequestService {
    BorrowRequestResponse createRequest(Long userId, BorrowCreateRequest request);
    List<BorrowRequestResponse> getRequestsByUser(Long userId);
    List<BorrowRequestResponse> getAllRequests();
    BorrowRequestResponse updateRequestStatus(Long requestId, BorrowRequestStatus status, String adminNote, Long adminId);
    BorrowRequestResponse getRequestById(Long id);
}
