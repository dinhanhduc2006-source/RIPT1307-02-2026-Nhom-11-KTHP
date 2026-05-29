package com.lending.backend.repository;

import com.lending.backend.entity.Equipment;
import com.lending.backend.enums.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByCategory(String category);
    List<Equipment> findByStatus(EquipmentStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Equipment e WHERE e.id = :id")
    Optional<Equipment> findByIdWithLock(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Equipment e SET e.available = e.available - 1 WHERE e.id = :id AND e.available > 0")
    int decrementAvailable(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Equipment e SET e.available = e.available + 1 WHERE e.id = :id AND e.available < e.total")
    int incrementAvailable(@Param("id") Long id);
}
