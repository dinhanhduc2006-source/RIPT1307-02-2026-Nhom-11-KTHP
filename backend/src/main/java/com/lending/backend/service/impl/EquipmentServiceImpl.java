package com.lending.backend.service.impl;

import com.lending.backend.entity.Equipment;
import com.lending.backend.entity.MaintenanceTicket;
import com.lending.backend.entity.User;
import com.lending.backend.enums.EquipmentStatus;
import com.lending.backend.enums.MaintenanceStatus;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.repository.EquipmentRepository;
import com.lending.backend.repository.MaintenanceTicketRepository;
import com.lending.backend.repository.UserRepository;
import com.lending.backend.service.AuditLogService;
import com.lending.backend.service.EmailService;
import com.lending.backend.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final MaintenanceTicketRepository maintenanceTicketRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    @Override
    public Equipment createEquipment(Equipment equipment) {
        return equipmentRepository.save(equipment);
    }

    @Override
    public Equipment updateEquipment(Long id, Equipment details) {
        Equipment equipment = getById(id);
        equipment.setName(details.getName());
        equipment.setCategory(details.getCategory());
        equipment.setTotal(details.getTotal());
        equipment.setAvailable(details.getAvailable());
        equipment.setStatus(details.getStatus());
        return equipmentRepository.save(equipment);
    }

    @Override
    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }

    @Override
    public Equipment getById(Long id) {
        return equipmentRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    @Override
    public List<Equipment> getAll() {
        return equipmentRepository.findAll();
    }

    @Override
    @Transactional
    public Equipment setMaintenance(Long id, Long reporterId, String issue) {
        Equipment equipment = getById(id);
        User reporter = userRepository.findById(reporterId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        // 4.3 Maintenance Trigger
        equipment.setStatus(EquipmentStatus.Maintenance);
        
        if (!maintenanceTicketRepository.existsByEquipmentAndStatusNot(equipment, MaintenanceStatus.Completed)) {
            MaintenanceTicket ticket = MaintenanceTicket.builder()
                    .equipment(equipment)
                    .issue(issue)
                    .status(MaintenanceStatus.AwaitingApproval)
                    .date(LocalDate.now())
                    .reporter(reporter)
                    .build();
            maintenanceTicketRepository.save(ticket);
            auditLogService.log(reporter, "Trigger Maintenance", "Automatic maintenance ticket created for " + equipment.getName());
            
            // Alert Admin
            String adminEmail = "admin_clb_thietbi@gmail.com"; // Should ideally come from SystemConfig
            emailService.sendSimpleMessage(adminEmail, "EQUIPMENT BREAKDOWN", 
                "Equipment '" + equipment.getName() + "' has been reported as broken. Maintenance ticket #" + ticket.getId() + " created.");
        }

        return equipmentRepository.save(equipment);
    }
}
