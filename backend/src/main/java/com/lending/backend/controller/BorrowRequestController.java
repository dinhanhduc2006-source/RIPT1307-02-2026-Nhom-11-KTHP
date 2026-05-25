package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.dto.BorrowCreateRequest;
import com.lending.backend.dto.BorrowRequestResponse;
import com.lending.backend.enums.BorrowRequestStatus;
import com.lending.backend.entity.User;
import com.lending.backend.service.BorrowRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/borrow-requests")
@RequiredArgsConstructor
public class BorrowRequestController {

    private final BorrowRequestService borrowRequestService;

    @PostMapping
    public ResponseResult<BorrowRequestResponse> createRequest(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BorrowCreateRequest request) {
        return ResponseResult.success(borrowRequestService.createRequest(user.getId(), request));
    }

    @GetMapping("/my-requests")
    public ResponseResult<List<BorrowRequestResponse>> getMyRequests(@AuthenticationPrincipal User user) {
        return ResponseResult.success(borrowRequestService.getRequestsByUser(user.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<List<BorrowRequestResponse>> getAllRequests() {
        return ResponseResult.success(borrowRequestService.getAllRequests());
    }

    @GetMapping("/{id}")
    public ResponseResult<BorrowRequestResponse> getRequestById(@PathVariable Long id) {
        return ResponseResult.success(borrowRequestService.getRequestById(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<BorrowRequestResponse> updateStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal User admin,
            @RequestParam BorrowRequestStatus status,
            @RequestParam(required = false) String adminNote) {
        return ResponseResult.success(borrowRequestService.updateRequestStatus(id, status, adminNote, admin.getId()));
    }
}
