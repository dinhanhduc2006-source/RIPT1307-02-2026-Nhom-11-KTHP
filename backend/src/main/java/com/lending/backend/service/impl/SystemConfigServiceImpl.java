package com.lending.backend.service.impl;

import com.lending.backend.entity.SystemConfig;
import com.lending.backend.repository.SystemConfigRepository;
import com.lending.backend.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SystemConfigServiceImpl implements SystemConfigService {
    private final SystemConfigRepository systemConfigRepository;

    @Override
    public SystemConfig getConfig() {
        return systemConfigRepository.findById(1).orElse(new SystemConfig());
    }

    @Override
    public SystemConfig updateConfig(SystemConfig config) {
        config.setId(1);
        return systemConfigRepository.save(config);
    }
}
