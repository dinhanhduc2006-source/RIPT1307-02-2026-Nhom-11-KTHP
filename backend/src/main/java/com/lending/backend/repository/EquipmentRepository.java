package com.lending.backend.repository;

import com.lending.backend.entity.Equipment;
import com.lending.backend.enums.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    Optional<Equipment> findByCode(String code);
    List<Equipment> findByStatus(EquipmentStatus status);
    List<Equipment> findByCategoryId(Long categoryId);
}
