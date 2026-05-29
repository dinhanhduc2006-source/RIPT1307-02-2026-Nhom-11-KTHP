package com.lending.backend.service.impl;

import com.lending.backend.entity.Penalty;
import com.lending.backend.enums.PenaltyStatus;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.repository.PenaltyRepository;
import com.lending.backend.service.PenaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PenaltyServiceImpl implements PenaltyService {
    private final PenaltyRepository penaltyRepository;

    private final com.lending.backend.repository.UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Penalty> getMyPenalties(Long userId) {
        com.lending.backend.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return penaltyRepository.findByUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Penalty> getAll() {
        return penaltyRepository.findAll();
    }

    @Override
    @Transactional
    public Penalty payPenalty(Long penaltyId) {
        Penalty penalty = penaltyRepository.findById(penaltyId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        penalty.setStatus(PenaltyStatus.Paid);
        return penaltyRepository.save(penalty);
    }

    @Override
    @Transactional
    public Penalty createPenalty(com.lending.backend.dto.PenaltyCreateRequest request) {
        com.lending.backend.entity.User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        
        Penalty penalty = Penalty.builder()
                .user(user)
                .reason(request.getReason())
                .amount(request.getAmount())
                .status(PenaltyStatus.Unpaid)
                .date(java.time.LocalDate.now())
                .build();
        
        if (request.getLoanRequestId() != null) {
            // Optional: link to a loan request
        }
        
        return penaltyRepository.save(penalty);
    }
}
