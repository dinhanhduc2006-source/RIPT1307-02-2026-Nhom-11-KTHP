package com.lending.backend.repository;

import com.lending.backend.entity.BorrowRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRequestItemRepository extends JpaRepository<BorrowRequestItem, Long> {
    List<BorrowRequestItem> findByRequestId(Long requestId);
}
