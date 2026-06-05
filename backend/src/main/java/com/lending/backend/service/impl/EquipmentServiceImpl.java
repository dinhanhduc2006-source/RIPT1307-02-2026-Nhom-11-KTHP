package com.lending.backend.service.impl;

import com.lending.backend.entity.Equipment;
import com.lending.backend.entity.MaintenanceTicket;
import com.lending.backend.entity.SystemConfig;
import com.lending.backend.entity.User;
import com.lending.backend.enums.EquipmentStatus;
import com.lending.backend.enums.MaintenanceStatus;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.repository.EquipmentRepository;
import com.lending.backend.repository.LoanRequestRepository;
import com.lending.backend.repository.MaintenanceTicketRepository;
import com.lending.backend.repository.SystemConfigRepository;
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
    private final SystemConfigRepository systemConfigRepository;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    private final LoanRequestRepository loanRequestRepository;

    @Override
    public Equipment createEquipment(Equipment equipment) {
        if (equipment.getAvailable() > equipment.getTotal()) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }
        Equipment saved = equipmentRepository.save(equipment);
        logAction("Create Equipment", "Created equipment: " + saved.getName());
        return saved;
    }

    @Override
    public Equipment updateEquipment(Long id, Equipment details) {
        Equipment equipment = getById(id);
        if (details.getAvailable() > details.getTotal()) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }
        equipment.setName(details.getName());
        equipment.setCategory(details.getCategory());
        equipment.setTotal(details.getTotal());
        equipment.setAvailable(details.getAvailable());
        equipment.setStatus(details.getStatus());
        Equipment updated = equipmentRepository.save(equipment);
        logAction("Update Equipment", "Updated equipment: " + updated.getName());
        return updated;
    }

    @Override
    public void deleteEquipment(Long id) {
        Equipment equipment = getById(id);
        if (loanRequestRepository.existsByEquipmentAndStatusIn(equipment, 
            List.of(com.lending.backend.enums.LoanRequestStatus.Approved, com.lending.backend.enums.LoanRequestStatus.Pending))) {
            throw new AppException(ErrorCode.USER_HAS_OVERDUE);
        }
        logAction("Delete Equipment", "Deleted equipment: " + equipment.getName());
        equipmentRepository.deleteById(id);
    }

    private void logAction(String action, String detail) {
        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof User user) {
                auditLogService.log(user, action, detail);
            }
        } catch (Exception e) {
            // Log error but don't fail the operation
        }
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Equipment getById(Long id) {
        return equipmentRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<Equipment> getAll() {
        return equipmentRepository.findAll();
    }

    @Override
    @Transactional
    public Equipment setMaintenance(Long id, Long reporterId, String issue) {
        Equipment equipment = getById(id);
        User reporter = userRepository.findById(reporterId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        SystemConfig config = systemConfigRepository.findById(1).orElse(new SystemConfig());

        // 4.3 Maintenance Trigger
        if (equipment.getAvailable() > 0) {
            equipment.setAvailable(equipment.getAvailable() - 1);
        }
        
        if (equipment.getAvailable() == 0) {
            equipment.setStatus(EquipmentStatus.Maintenance);
        }
        
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
            String adminEmail = config.getAdminEmail() != null ? config.getAdminEmail() : "admin_clb_thietbi@gmail.com";
            emailService.sendSimpleMessage(adminEmail, "EQUIPMENT BREAKDOWN", 
                "Equipment '" + equipment.getName() + "' has been reported as broken. Maintenance ticket #" + ticket.getId() + " created.");
        }

        return equipmentRepository.save(equipment);
    }
}
