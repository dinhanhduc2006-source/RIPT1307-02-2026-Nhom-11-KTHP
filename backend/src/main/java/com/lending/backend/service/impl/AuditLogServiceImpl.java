package com.lending.backend.service.impl;

import com.lending.backend.entity.AuditLog;
import com.lending.backend.entity.User;
import com.lending.backend.repository.AuditLogRepository;
import com.lending.backend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {
    private final AuditLogRepository auditLogRepository;

    @Override
    public void log(User user, String action, String detail) {
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .detail(detail)
                .build();
        auditLogRepository.save(auditLog);
    }
}
