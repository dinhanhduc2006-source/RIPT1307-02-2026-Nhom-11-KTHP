package com.lending.backend.repository;

import com.lending.backend.entity.Equipment;
import com.lending.backend.enums.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByCategory(String category);
    List<Equipment> findByStatus(EquipmentStatus status);
}
