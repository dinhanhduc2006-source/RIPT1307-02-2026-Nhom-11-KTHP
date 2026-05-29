package com.lending.backend.service;

import com.lending.backend.entity.AuditLog;
import com.lending.backend.entity.User;
import java.util.List;

public interface AuditLogService {
    void log(User user, String action, String detail);
    List<AuditLog> getAll();
}
