package com.lending.backend.service.impl;

import com.lending.backend.dto.EquipmentReportResponse;
import com.lending.backend.repository.BorrowRequestItemRepository;
import com.lending.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final BorrowRequestItemRepository borrowRequestItemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentReportResponse> getMonthlyEquipmentReport(int month, int year) {
        try (Stream<com.lending.backend.entity.BorrowRequestItem> itemStream = 
                borrowRequestItemRepository.streamAllByMonthAndYear(month, year)) {
            
            Map<String, Long> stats = itemStream.collect(
                Collectors.groupingBy(
                    item -> item.getEquipment().getName(),
                    Collectors.counting()
                )
            );

            return stats.entrySet().stream()
                .map(entry -> new EquipmentReportResponse(entry.getKey(), entry.getValue()))
                .sorted((a, b) -> b.getUsageCount().compareTo(a.getUsageCount()))
                .collect(Collectors.toList());
        }
    }
}
