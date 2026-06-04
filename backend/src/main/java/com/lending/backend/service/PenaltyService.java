package com.lending.backend.service;

import com.lending.backend.entity.Penalty;
import com.lending.backend.entity.User;
import java.util.List;

public interface PenaltyService {
    List<Penalty> getMyPenalties(Long userId);
    List<Penalty> getAll();
    Penalty payPenalty(Long penaltyId, User payer);
    Penalty confirmTransfer(Long penaltyId, User payer);
    Penalty createPenalty(com.lending.backend.dto.PenaltyCreateRequest request);
}
