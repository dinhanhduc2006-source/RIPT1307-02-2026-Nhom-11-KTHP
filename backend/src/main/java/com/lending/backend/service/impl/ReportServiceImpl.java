package com.lending.backend.service.impl;

import com.lending.backend.dto.EquipmentReportResponse;
import com.lending.backend.repository.BorrowRequestItemRepository;
import com.lending.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final BorrowRequestItemRepository borrowRequestItemRepository;

    @Override
    public List<EquipmentReportResponse> getMonthlyEquipmentReport(int month, int year) {
        return borrowRequestItemRepository.getMonthlyBorrowingStats(month, year);
    }
}
