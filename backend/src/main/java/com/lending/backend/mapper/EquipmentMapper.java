package com.lending.backend.mapper;

import com.lending.backend.dto.EquipmentRequest;
import com.lending.backend.dto.EquipmentResponse;
import com.lending.backend.entity.Equipment;
import org.springframework.stereotype.Component;

@Component
public class EquipmentMapper {
    public EquipmentResponse toEquipmentResponse(Equipment equipment) {
        if (equipment == null) return null;

        return EquipmentResponse.builder()
                .id(equipment.getId())
                .name(equipment.getName())
                .code(equipment.getCode())
                .description(equipment.getDescription())
                .totalQuantity(equipment.getTotalQuantity())
                .availableQuantity(equipment.getAvailableQuantity())
                .status(equipment.getStatus())
                .imageUrl(equipment.getImageUrl())
                .location(equipment.getLocation())
                .categoryName(equipment.getCategory() != null ? equipment.getCategory().getName() : null)
                .build();
    }

    public void updateEntity(Equipment equipment, EquipmentRequest request) {
        if (request == null) return;

        equipment.setName(request.getName());
        equipment.setCode(request.getCode());
        equipment.setDescription(request.getDescription());
        equipment.setTotalQuantity(request.getTotalQuantity());
        equipment.setImageUrl(request.getImageUrl());
        equipment.setLocation(request.getLocation());
    }
}
