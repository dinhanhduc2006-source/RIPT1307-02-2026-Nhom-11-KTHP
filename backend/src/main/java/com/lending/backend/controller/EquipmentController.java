package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.Equipment;
import com.lending.backend.entity.User;
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
    public ResponseResult<Equipment> getById(@PathVariable("id") Long id) {
        return ResponseResult.success(equipmentService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<Equipment> create(@RequestBody Equipment equipment) {
        return ResponseResult.success(equipmentService.createEquipment(equipment));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<Equipment> update(@PathVariable("id") Long id, @RequestBody Equipment equipment) {
        return ResponseResult.success(equipmentService.updateEquipment(id, equipment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<String> delete(@PathVariable("id") Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseResult.success("Deleted successfully");
    }

    @PostMapping("/{id}/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseResult<Equipment> setMaintenance(
            @PathVariable("id") Long id, 
            @RequestParam("issue") String issue) {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseResult.success(equipmentService.setMaintenance(id, currentUser.getId(), issue));
    }
}
