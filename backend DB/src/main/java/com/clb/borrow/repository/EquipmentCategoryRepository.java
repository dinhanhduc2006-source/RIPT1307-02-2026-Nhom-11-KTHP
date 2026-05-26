// Placeholder for EquipmentCategoryRepository.java
package com.clb.borrow.repository;

import com.clb.borrow.entity.EquipmentCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EquipmentCategoryRepository extends JpaRepository<EquipmentCategory, Long> {
    Optional<EquipmentCategory> findByName(String name);
}
