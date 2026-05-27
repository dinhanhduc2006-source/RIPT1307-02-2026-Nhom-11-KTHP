package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.dto.LoanCreateRequest;
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
    public ResponseResult<LoanRequest> create(@RequestBody LoanCreateRequest request) {
        return ResponseResult.success(loanRequestService.createRequest(
                request.getUserId(), 
                request.getEquipmentId(), 
                request.getBorrowDate().toString(), 
                request.getReturnDate().toString())
        );
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<LoanRequest> approve(@PathVariable Long id, @RequestParam Long adminId) {
        return ResponseResult.success(loanRequestService.approveRequest(id, adminId));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<LoanRequest> reject(@PathVariable Long id, @RequestParam Long adminId, @RequestParam String reason) {
        return ResponseResult.success(loanRequestService.rejectRequest(id, adminId, reason));
    }

    @PatchMapping("/{id}/return")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<LoanRequest> returnItem(@PathVariable Long id, @RequestParam Long adminId) {
        return ResponseResult.success(loanRequestService.returnEquipment(id, adminId));
    }

    @GetMapping("/my")
    public ResponseResult<List<LoanRequest>> getMyRequests(@RequestParam Long userId) {
        return ResponseResult.success(loanRequestService.getMyRequests(userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<List<LoanRequest>> getAll() {
        return ResponseResult.success(loanRequestService.getAllRequests());
    }
}
