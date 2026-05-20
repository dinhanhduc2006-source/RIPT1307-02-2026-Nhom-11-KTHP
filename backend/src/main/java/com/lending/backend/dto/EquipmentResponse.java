package com.lending.backend.dto;

import com.lending.backend.enums.EquipmentStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentResponse {
    private Long id;
    private String categoryName;
    private String name;
    private String code;
    private String description;
    private Integer totalQuantity;
    private Integer availableQuantity;
    private EquipmentStatus status;
    private String imageUrl;
    private String location;
}
