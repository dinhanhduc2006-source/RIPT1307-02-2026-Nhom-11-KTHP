package com.lending.backend.service.impl;

import com.lending.backend.dto.EquipmentCategoryRequest;
import com.lending.backend.dto.EquipmentCategoryResponse;
import com.lending.backend.entity.EquipmentCategory;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.repository.EquipmentCategoryRepository;
import com.lending.backend.service.EquipmentCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipmentCategoryServiceImpl implements EquipmentCategoryService {

    private final EquipmentCategoryRepository categoryRepository;

    @Override
    public List<EquipmentCategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EquipmentCategoryResponse getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    @Override
    @Transactional
    public EquipmentCategoryResponse createCategory(EquipmentCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.INVALID_KEY); // Or a specific DUPLICATE_CATEGORY error
        }

        EquipmentCategory category = EquipmentCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public EquipmentCategoryResponse updateCategory(Long id, EquipmentCategoryRequest request) {
        EquipmentCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }
        // Caution: In real apps, check if equipments belong to this category first
        categoryRepository.deleteById(id);
    }

    private EquipmentCategoryResponse mapToResponse(EquipmentCategory category) {
        return EquipmentCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .build();
    }
}
