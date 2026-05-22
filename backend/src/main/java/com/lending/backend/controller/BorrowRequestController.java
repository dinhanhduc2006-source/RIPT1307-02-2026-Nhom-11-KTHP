package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.dto.BorrowCreateRequest;
import com.lending.backend.dto.BorrowRequestResponse;
import com.lending.backend.enums.BorrowRequestStatus;
import com.lending.backend.service.BorrowRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/borrow-requests")
@RequiredArgsConstructor
public class BorrowRequestController {

    private final BorrowRequestService borrowRequestService;

    @PostMapping
    public ResponseResult<BorrowRequestResponse> createRequest(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody BorrowCreateRequest request) {
        return ResponseResult.success(borrowRequestService.createRequest(userId, request));
    }

    @GetMapping("/my-requests")
    public ResponseResult<List<BorrowRequestResponse>> getMyRequests(@RequestHeader("X-User-Id") Long userId) {
        return ResponseResult.success(borrowRequestService.getRequestsByUser(userId));
    }

    @GetMapping
    public ResponseResult<List<BorrowRequestResponse>> getAllRequests() {
        return ResponseResult.success(borrowRequestService.getAllRequests());
    }

    @GetMapping("/{id}")
    public ResponseResult<BorrowRequestResponse> getRequestById(@PathVariable Long id) {
        return ResponseResult.success(borrowRequestService.getRequestById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseResult<BorrowRequestResponse> updateStatus(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long adminId,
            @RequestParam BorrowRequestStatus status,
            @RequestParam(required = false) String adminNote) {
        return ResponseResult.success(borrowRequestService.updateRequestStatus(id, status, adminNote, adminId));
    }
}
