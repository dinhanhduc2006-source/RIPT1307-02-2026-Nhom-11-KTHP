package com.lending.backend.repository;

import com.lending.backend.entity.Penalty;
import com.lending.backend.entity.User;
import com.lending.backend.enums.PenaltyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PenaltyRepository extends JpaRepository<Penalty, Long> {
    List<Penalty> findByUser(User user);
    List<Penalty> findByStatus(PenaltyStatus status);
    
    // Check if user has unpaid penalties
    boolean existsByUserAndStatus(User user, PenaltyStatus status);
}
