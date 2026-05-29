package com.lending.backend.repository;

import com.lending.backend.entity.Equipment;
import com.lending.backend.entity.MaintenanceTicket;
import com.lending.backend.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaintenanceTicketRepository extends JpaRepository<MaintenanceTicket, Long> {
    @Override
    @EntityGraph(attributePaths = {"equipment", "reporter"})
    List<MaintenanceTicket> findAll();

    List<MaintenanceTicket> findByEquipment(Equipment equipment);
    List<MaintenanceTicket> findByStatus(MaintenanceStatus status);
    
    // Check for active maintenance tickets for equipment (status != Completed)
    boolean existsByEquipmentAndStatusNot(Equipment equipment, MaintenanceStatus status);
}
