package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.dto.EquipmentResponse;
import com.lending.backend.service.EquipmentService;
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
}
