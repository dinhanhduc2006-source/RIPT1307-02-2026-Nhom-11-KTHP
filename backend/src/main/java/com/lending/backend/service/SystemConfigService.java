package com.lending.backend.service;

import com.lending.backend.entity.SystemConfig;

public interface SystemConfigService {
    SystemConfig getConfig();
    SystemConfig updateConfig(SystemConfig config);
}
