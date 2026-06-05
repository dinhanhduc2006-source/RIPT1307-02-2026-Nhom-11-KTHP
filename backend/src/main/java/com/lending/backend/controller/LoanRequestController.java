package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.dto.LoanCreateRequest;
import com.lending.backend.entity.LoanRequest;
import com.lending.backend.entity.User;
import com.lending.backend.service.LoanRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:8000", allowedHeaders = "*")
@RestController
@RequestMapping("/api/v1/loan-requests")
@RequiredArgsConstructor
public class LoanRequestController {

    private final LoanRequestService loanRequestService;

    @PostMapping
    public ResponseResult<LoanRequest> create(@RequestBody LoanCreateRequest request) {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long requesterId = currentUser.getId();
        
        // Admins can delegate the loan request to another user
        if (currentUser.getRole() == com.lending.backend.enums.UserRole.Admin && request.getUserId() != null) {
            requesterId = request.getUserId();
        }
        
        return ResponseResult.success(loanRequestService.createRequest(
                requesterId, 
                request.getEquipmentId(), 
                request.getBorrowDate(), 
                request.getReturnDate())
        );
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<LoanRequest> approve(@PathVariable("id") Long id) {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseResult.success(loanRequestService.approveRequest(id, currentUser.getId()));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<LoanRequest> reject(
            @PathVariable("id") Long id, 
            @RequestParam("reason") String reason) {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseResult.success(loanRequestService.rejectRequest(id, currentUser.getId(), reason));
    }

    @PatchMapping("/{id}/return")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<LoanRequest> returnItem(@PathVariable("id") Long id) {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseResult.success(loanRequestService.returnEquipment(id, currentUser.getId()));
    }

    @GetMapping("/my")
    public ResponseResult<List<LoanRequest>> getMyRequests() {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseResult.success(loanRequestService.getMyRequests(currentUser.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<List<LoanRequest>> getAll() {
        return ResponseResult.success(loanRequestService.getAllRequests());
    }
}
