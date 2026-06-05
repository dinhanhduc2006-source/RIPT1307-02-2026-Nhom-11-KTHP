package com.lending.backend.dto;

import lombok.*;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowItemRequest {
    @NotNull(message = "Equipment ID is required")
    private Long equipmentId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}
