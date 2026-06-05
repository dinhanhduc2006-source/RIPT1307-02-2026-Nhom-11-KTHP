package com.lending.backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanCreateRequest {
    private Long userId;
    private Long equipmentId;
    private LocalDate borrowDate;
    private LocalDate returnDate;
}
