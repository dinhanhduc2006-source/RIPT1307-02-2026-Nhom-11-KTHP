package com.lending.backend.dto;

import com.lending.backend.enums.BorrowPriority;
import lombok.*;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowCreateRequest {
    @NotNull(message = "Borrow date is required")
    private LocalDate borrowDate;

    @NotNull(message = "Return date is required")
    private LocalDate returnDate;

    private String note;
    
    private BorrowPriority priority = BorrowPriority.normal;

    @NotEmpty(message = "Items list cannot be empty")
    private List<BorrowItemRequest> items;
}
