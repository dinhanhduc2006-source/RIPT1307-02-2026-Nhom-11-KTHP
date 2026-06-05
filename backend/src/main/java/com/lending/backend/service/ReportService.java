package com.lending.backend.service;

import com.lending.backend.dto.EquipmentReportResponse;
import java.util.List;

public interface ReportService {
    List<EquipmentReportResponse> getMonthlyEquipmentReport(int month, int year);
}
