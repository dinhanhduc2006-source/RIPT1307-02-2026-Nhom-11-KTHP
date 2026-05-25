package com.lending.backend.service;

import com.lending.backend.dto.EquipmentCategoryRequest;
import com.lending.backend.dto.EquipmentCategoryResponse;

import java.util.List;

public interface EquipmentCategoryService {
    List<EquipmentCategoryResponse> getAllCategories();
    EquipmentCategoryResponse getCategoryById(Long id);
    EquipmentCategoryResponse createCategory(EquipmentCategoryRequest request);
    EquipmentCategoryResponse updateCategory(Long id, EquipmentCategoryRequest request);
    void deleteCategory(Long id);
}
