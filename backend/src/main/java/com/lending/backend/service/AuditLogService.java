package com.lending.backend.service;

import com.lending.backend.entity.User;

public interface AuditLogService {
    void log(User user, String action, String detail);
}
