package com.lending.backend.service;

import com.lending.backend.entity.Equipment;
import java.util.List;

public interface EquipmentService {
    Equipment createEquipment(Equipment equipment);
    Equipment updateEquipment(Long id, Equipment equipment);
    void deleteEquipment(Long id);
    Equipment getById(Long id);
    List<Equipment> getAll();
    Equipment setMaintenance(Long id, Long reporterId, String issue);
}
