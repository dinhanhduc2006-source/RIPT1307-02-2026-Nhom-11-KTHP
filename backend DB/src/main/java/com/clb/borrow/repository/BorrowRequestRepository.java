// Placeholder for BorrowRequestRepository.java
package com.clb.borrow.repository;

import com.clb.borrow.entity.BorrowRequest;
import com.clb.borrow.entity.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {

    List<BorrowRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<BorrowRequest> findAllByOrderByCreatedAtDesc();

    List<BorrowRequest> findByStatus(RequestStatus status);

    @Query("SELECT r FROM BorrowRequest r WHERE r.status IN :statuses AND r.returnDate < :today")
    List<BorrowRequest> findOverdue(@Param("statuses") List<RequestStatus> statuses,
                                    @Param("today") LocalDate today);

    @Query("SELECT r FROM BorrowRequest r WHERE r.status IN :statuses AND r.returnDate = :dueDate")
    List<BorrowRequest> findDueOn(@Param("statuses") List<RequestStatus> statuses,
                                  @Param("dueDate") LocalDate dueDate);
}
