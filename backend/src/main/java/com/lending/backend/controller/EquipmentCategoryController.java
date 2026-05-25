package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.dto.EquipmentCategoryRequest;
import com.lending.backend.dto.EquipmentCategoryResponse;
import com.lending.backend.service.EquipmentCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class EquipmentCategoryController {

    private final EquipmentCategoryService categoryService;

    @GetMapping
    public ResponseResult<List<EquipmentCategoryResponse>> getAllCategories() {
        return ResponseResult.success(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseResult<EquipmentCategoryResponse> getCategoryById(@PathVariable Long id) {
        return ResponseResult.success(categoryService.getCategoryById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<EquipmentCategoryResponse> createCategory(@Valid @RequestBody EquipmentCategoryRequest request) {
        return ResponseResult.success(categoryService.createCategory(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<EquipmentCategoryResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody EquipmentCategoryRequest request) {
        return ResponseResult.success(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseResult.success();
    }
}
