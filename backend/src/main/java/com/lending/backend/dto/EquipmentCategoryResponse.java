package com.lending.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentCategoryResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
}
