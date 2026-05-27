package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.LoanRequest;
import com.lending.backend.service.LoanRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/loan-requests")
@RequiredArgsConstructor
public class LoanRequestController {

    private final LoanRequestService loanRequestService;

    @PostMapping
    public ResponseResult<LoanRequest> create(
            @RequestParam Long userId,
            @RequestParam Long equipmentId,
            @RequestParam String borrowDate,
            @RequestParam String returnDate) {
        return ResponseResult.success(loanRequestService.createRequest(userId, equipmentId, borrowDate, returnDate));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('Admin')")
    public ResponseResult<LoanRequest> approve(@PathVariable Long id, @RequestParam Long adminId) {
        return ResponseResult.success(loanRequestService.approveRequest(id, adminId));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('Admin')")
    public ResponseResult<LoanRequest> reject(@PathVariable Long id, @RequestParam Long adminId, @RequestParam String reason) {
        return ResponseResult.success(loanRequestService.rejectRequest(id, adminId, reason));
    }

    @PatchMapping("/{id}/return")
    @PreAuthorize("hasRole('Admin')")
    public ResponseResult<LoanRequest> returnItem(@PathVariable Long id, @RequestParam Long adminId) {
        return ResponseResult.success(loanRequestService.returnEquipment(id, adminId));
    }

    @GetMapping("/my")
    public ResponseResult<List<LoanRequest>> getMyRequests(@RequestParam Long userId) {
        return ResponseResult.success(loanRequestService.getMyRequests(userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('Admin')")
    public ResponseResult<List<LoanRequest>> getAll() {
        return ResponseResult.success(loanRequestService.getAllRequests());
    }
}
