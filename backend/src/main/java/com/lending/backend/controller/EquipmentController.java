package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.dto.EquipmentRequest;
import com.lending.backend.dto.EquipmentResponse;
import com.lending.backend.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/equipments")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public ResponseResult<List<EquipmentResponse>> getAllEquipments() {
        return ResponseResult.success(equipmentService.getAllEquipments());
    }

    @GetMapping("/{id}")
    public ResponseResult<EquipmentResponse> getEquipmentById(@PathVariable Long id) {
        return ResponseResult.success(equipmentService.getEquipmentById(id));
    }

    @PostMapping
    public ResponseResult<EquipmentResponse> createEquipment(@Valid @RequestBody EquipmentRequest request) {
        return ResponseResult.success(equipmentService.createEquipment(request));
    }

    @PutMapping("/{id}")
    public ResponseResult<EquipmentResponse> updateEquipment(@PathVariable Long id, @Valid @RequestBody EquipmentRequest request) {
        return ResponseResult.success(equipmentService.updateEquipment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseResult<Void> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseResult.success();
    }
}
