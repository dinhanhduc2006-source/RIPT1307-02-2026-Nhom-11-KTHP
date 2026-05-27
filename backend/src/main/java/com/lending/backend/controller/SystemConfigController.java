package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.SystemConfig;
import com.lending.backend.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/config")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    @GetMapping
    public ResponseResult<SystemConfig> getConfig() {
        return ResponseResult.success(systemConfigService.getConfig());
    }

    @PutMapping
    public ResponseResult<SystemConfig> updateConfig(@RequestBody SystemConfig config) {
        return ResponseResult.success(systemConfigService.updateConfig(config));
    }
}
