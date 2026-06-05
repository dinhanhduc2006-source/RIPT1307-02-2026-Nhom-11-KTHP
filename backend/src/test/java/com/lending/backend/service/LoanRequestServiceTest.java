package com.lending.backend.service;

import com.lending.backend.entity.Equipment;
import com.lending.backend.entity.LoanRequest;
import com.lending.backend.entity.SystemConfig;
import com.lending.backend.entity.User;
import com.lending.backend.enums.EquipmentStatus;
import com.lending.backend.enums.LoanRequestStatus;
import com.lending.backend.exception.AppException;
import com.lending.backend.repository.*;
import com.lending.backend.service.impl.LoanRequestServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class LoanRequestServiceTest {

    @Mock private LoanRequestRepository loanRequestRepository;
    @Mock private UserRepository userRepository;
    @Mock private EquipmentRepository equipmentRepository;
    @Mock private PenaltyRepository penaltyRepository;
    @Mock private SystemConfigRepository systemConfigRepository;
    @Mock private AuditLogService auditLogService;
    @Mock private EmailService emailService;

    @InjectMocks
    private LoanRequestServiceImpl loanRequestService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createRequest_Success() {
        User user = new User();
        user.setId(1L);
        Equipment equipment = new Equipment();
        equipment.setId(1L);
        equipment.setAvailable(5);
        equipment.setStatus(EquipmentStatus.Available);
        SystemConfig config = new SystemConfig();
        config.setMaxBorrowDays(7);
        config.setAllowBorrowWhenDebt(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(equipmentRepository.findById(1L)).thenReturn(Optional.of(equipment));
        when(systemConfigRepository.findById(1)).thenReturn(Optional.of(config));
        when(loanRequestRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        LocalDate borrowDate = LocalDate.now().plusDays(1);
        LocalDate returnDate = LocalDate.now().plusDays(3);

        LoanRequest result = loanRequestService.createRequest(1L, 1L, borrowDate, returnDate);

        assertNotNull(result);
        assertEquals(LoanRequestStatus.Pending, result.getStatus());
        verify(loanRequestRepository).save(any());
    }

    @Test
    void createRequest_ExceedMaxDays_ThrowsException() {
        User user = new User();
        SystemConfig config = new SystemConfig();
        config.setMaxBorrowDays(7);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(equipmentRepository.findById(1L)).thenReturn(Optional.of(new Equipment()));
        when(systemConfigRepository.findById(1)).thenReturn(Optional.of(config));

        LocalDate borrowDate = LocalDate.now();
        LocalDate returnDate = LocalDate.now().plusDays(10); // > 7 days

        assertThrows(AppException.class, () -> 
            loanRequestService.createRequest(1L, 1L, borrowDate, returnDate)
        );
    }
}
