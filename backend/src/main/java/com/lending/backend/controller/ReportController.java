package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.dto.EquipmentReportResponse;
import com.lending.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/equipment-usage")
    public ResponseResult<List<EquipmentReportResponse>> getMonthlyReport(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseResult.success(reportService.getMonthlyEquipmentReport(month, year));
    }
}
