package com.lending.backend.service.impl;

import com.lending.backend.entity.Equipment;
import com.lending.backend.entity.MaintenanceTicket;
import com.lending.backend.enums.EquipmentStatus;
import com.lending.backend.enums.MaintenanceStatus;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.repository.EquipmentRepository;
import com.lending.backend.repository.MaintenanceTicketRepository;
import com.lending.backend.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceTicketRepository maintenanceTicketRepository;
    private final EquipmentRepository equipmentRepository;

    @Override
    public List<MaintenanceTicket> getAll() {
        return maintenanceTicketRepository.findAll();
    }

    @Override
    @Transactional
    public MaintenanceTicket updateStatus(Long ticketId, MaintenanceStatus status, Long cost) {
        MaintenanceTicket ticket = maintenanceTicketRepository.findById(ticketId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        
        ticket.setStatus(status);
        if (cost != null) ticket.setCost(cost);

        if (status == MaintenanceStatus.Completed) {
            Equipment equipment = ticket.getEquipment();
            equipment.setStatus(EquipmentStatus.Available);
            equipmentRepository.save(equipment);
        }

        return maintenanceTicketRepository.save(ticket);
    }
}
