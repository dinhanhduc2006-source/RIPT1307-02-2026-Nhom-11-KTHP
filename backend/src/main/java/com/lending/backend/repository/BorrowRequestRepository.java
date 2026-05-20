package com.lending.backend.repository;

import com.lending.backend.entity.BorrowRequest;
import com.lending.backend.enums.BorrowRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {
    List<BorrowRequest> findByUserId(Long userId);
    List<BorrowRequest> findByStatus(BorrowRequestStatus status);
}
