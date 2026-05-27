package com.lending.backend.service;

import com.lending.backend.entity.Penalty;
import java.util.List;

public interface PenaltyService {
    List<Penalty> getMyPenalties(Long userId);
    List<Penalty> getAll();
    Penalty payPenalty(Long penaltyId);
}
