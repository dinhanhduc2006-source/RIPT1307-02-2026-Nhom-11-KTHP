package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.Equipment;
import com.lending.backend.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/equipments")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public ResponseResult<List<Equipment>> getAll() {
        return ResponseResult.success(equipmentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseResult<Equipment> getById(@PathVariable Long id) {
        return ResponseResult.success(equipmentService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('Admin')")
    public ResponseResult<Equipment> create(@RequestBody Equipment equipment) {
        return ResponseResult.success(equipmentService.createEquipment(equipment));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseResult<Equipment> update(@PathVariable Long id, @RequestBody Equipment equipment) {
        return ResponseResult.success(equipmentService.updateEquipment(id, equipment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('Admin')")
    public ResponseResult<String> delete(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseResult.success("Deleted successfully");
    }

    @PostMapping("/{id}/maintenance")
    @PreAuthorize("hasAnyRole('Admin', 'Faculty')")
    public ResponseResult<Equipment> setMaintenance(
            @PathVariable Long id, 
            @RequestParam Long reporterId, 
            @RequestParam String issue) {
        return ResponseResult.success(equipmentService.setMaintenance(id, reporterId, issue));
    }
}
