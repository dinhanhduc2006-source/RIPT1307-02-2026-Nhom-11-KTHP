package com.lending.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentReportResponse {
    private String equipmentName;
    private Long borrowCount;
}
