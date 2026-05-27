package com.lending.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentCategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;
    private String description;
}
