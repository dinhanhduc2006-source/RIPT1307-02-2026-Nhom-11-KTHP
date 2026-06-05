package com.lending.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PenaltyCreateRequest {
    private Long userId;
    private Long loanRequestId;
    private String reason;
    private Long amount;
}
