package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.AuditLog;
import com.lending.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseResult<List<AuditLog>> getAllLogs() {
        return ResponseResult.success(auditLogRepository.findAll());
    }

    @GetMapping("/table/{tableName}")
    public ResponseResult<List<AuditLog>> getLogsByTable(@PathVariable String tableName) {
        return ResponseResult.success(auditLogRepository.findByTableNameOrderByCreatedAtDesc(tableName));
    }
}
