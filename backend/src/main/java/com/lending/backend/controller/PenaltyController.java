package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.Penalty;
import com.lending.backend.entity.User;
import com.lending.backend.service.PenaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/penalties")
@RequiredArgsConstructor
public class PenaltyController {

    private final PenaltyService penaltyService;

    @GetMapping("/my")
    public ResponseResult<List<Penalty>> getMyPenalties() {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseResult.success(penaltyService.getMyPenalties(currentUser.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<List<Penalty>> getAll() {
        return ResponseResult.success(penaltyService.getAll());
    }

    @PatchMapping("/{id}/confirm-transfer")
    public ResponseResult<Penalty> confirmTransfer(@PathVariable("id") Long id) {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseResult.success(penaltyService.confirmTransfer(id, currentUser));
    }

    @RequestMapping(value = "/{id}/pay", method = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseResult<Penalty> pay(@PathVariable("id") Long id) {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseResult.success(penaltyService.payPenalty(id, currentUser));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<Penalty> create(@RequestBody com.lending.backend.dto.PenaltyCreateRequest request) {
        return ResponseResult.success(penaltyService.createPenalty(request));
    }
}
