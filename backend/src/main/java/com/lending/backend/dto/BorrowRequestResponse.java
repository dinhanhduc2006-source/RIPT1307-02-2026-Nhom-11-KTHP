package com.lending.backend.dto;

import com.lending.backend.enums.BorrowPriority;
import com.lending.backend.enums.BorrowRequestStatus;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowRequestResponse {
    private Long id;
    private String userFullName;
    private BorrowRequestStatus status;
    private BorrowPriority priority;
    private LocalDate borrowDate;
    private LocalDate returnDate;
    private String note;
    private String adminNote;
    private List<BorrowItemResponse> items;
}
