package com.lending.backend.service.impl;

import com.lending.backend.entity.Penalty;
import com.lending.backend.enums.PenaltyStatus;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.repository.PenaltyRepository;
import com.lending.backend.service.PenaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PenaltyServiceImpl implements PenaltyService {
    private final PenaltyRepository penaltyRepository;

    @Override
    public List<Penalty> getMyPenalties(Long userId) {
        return penaltyRepository.findAll().stream()
                .filter(p -> p.getUser().getId().equals(userId))
                .toList();
    }

    @Override
    public List<Penalty> getAll() {
        return penaltyRepository.findAll();
    }

    @Override
    public Penalty payPenalty(Long penaltyId) {
        Penalty penalty = penaltyRepository.findById(penaltyId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        penalty.setStatus(PenaltyStatus.Paid);
        return penaltyRepository.save(penalty);
    }
}
