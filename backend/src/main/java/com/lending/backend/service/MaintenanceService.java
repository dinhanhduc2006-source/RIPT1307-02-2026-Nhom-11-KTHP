package com.lending.backend.service;

import com.lending.backend.entity.MaintenanceTicket;
import com.lending.backend.enums.MaintenanceStatus;
import java.util.List;

public interface MaintenanceService {
    List<MaintenanceTicket> getAll();
    MaintenanceTicket updateStatus(Long ticketId, MaintenanceStatus status, Long cost);
}
