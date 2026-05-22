package com.lending.backend.dto;

import com.lending.backend.enums.BorrowItemStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowItemResponse {
    private Long id;
    private String equipmentName;
    private Integer quantity;
    private BorrowItemStatus itemStatus;
    private String conditionNote;
}
