package com.lending.backend.service.impl;

import com.lending.backend.dto.EquipmentRequest;
import com.lending.backend.dto.EquipmentResponse;
import com.lending.backend.entity.Equipment;
import com.lending.backend.entity.EquipmentCategory;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.mapper.EquipmentMapper;
import com.lending.backend.repository.EquipmentCategoryRepository;
import com.lending.backend.repository.EquipmentRepository;
import com.lending.backend.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentCategoryRepository categoryRepository;
    private final EquipmentMapper equipmentMapper;

    @Override
    public List<EquipmentResponse> getAllEquipments() {
        return equipmentRepository.findAll().stream()
                .map(equipmentMapper::toEquipmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EquipmentResponse getEquipmentById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return equipmentMapper.toEquipmentResponse(equipment);
    }

    @Override
    @Transactional
    public EquipmentResponse createEquipment(EquipmentRequest request) {
        EquipmentCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        Equipment equipment = Equipment.builder()
                .category(category)
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .totalQuantity(request.getTotalQuantity())
                .availableQuantity(request.getTotalQuantity()) // New equipment, all available
                .imageUrl(request.getImageUrl())
                .location(request.getLocation())
                .build();

        return equipmentMapper.toEquipmentResponse(equipmentRepository.save(equipment));
    }

    @Override
    @Transactional
    public EquipmentResponse updateEquipment(Long id, EquipmentRequest request) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        if (!equipment.getCategory().getId().equals(request.getCategoryId())) {
            EquipmentCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
            equipment.setCategory(category);
        }

        // Adjust available quantity if total quantity changes
        int diff = request.getTotalQuantity() - equipment.getTotalQuantity();
        equipment.setAvailableQuantity(equipment.getAvailableQuantity() + diff);
        
        equipmentMapper.updateEntity(equipment, request);

        return equipmentMapper.toEquipmentResponse(equipmentRepository.save(equipment));
    }

    @Override
    @Transactional
    public void deleteEquipment(Long id) {
        if (!equipmentRepository.existsById(id)) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        equipmentRepository.deleteById(id);
    }
}
