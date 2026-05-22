package com.lending.backend.service;

import com.lending.backend.dto.EquipmentRequest;
import com.lending.backend.dto.EquipmentResponse;

import java.util.List;

public interface EquipmentService {
    List<EquipmentResponse> getAllEquipments();
    EquipmentResponse getEquipmentById(Long id);
    EquipmentResponse createEquipment(EquipmentRequest request);
    EquipmentResponse updateEquipment(Long id, EquipmentRequest request);
    void deleteEquipment(Long id);
}
