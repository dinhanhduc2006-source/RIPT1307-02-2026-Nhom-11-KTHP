package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.MaintenanceTicket;
import com.lending.backend.enums.MaintenanceStatus;
import com.lending.backend.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/maintenance")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    public ResponseResult<List<MaintenanceTicket>> getAll() {
        return ResponseResult.success(maintenanceService.getAll());
    }

    @PatchMapping("/{id}/status")
    public ResponseResult<MaintenanceTicket> updateStatus(
            @PathVariable Long id,
            @RequestParam MaintenanceStatus status,
            @RequestParam(required = false) Long cost) {
        return ResponseResult.success(maintenanceService.updateStatus(id, status, cost));
    }
}
