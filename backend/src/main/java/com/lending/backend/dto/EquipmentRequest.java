package com.lending.backend.dto;

import lombok.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentRequest {
    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Equipment name is required")
    private String name;

    private String code;
    private String description;
    
    @NotNull(message = "Total quantity is required")
    private Integer totalQuantity;
    
    private String imageUrl;
    private String location;
}
