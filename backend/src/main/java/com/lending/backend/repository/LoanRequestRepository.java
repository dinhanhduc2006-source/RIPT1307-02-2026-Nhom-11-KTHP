package com.lending.backend.repository;

import com.lending.backend.entity.LoanRequest;
import com.lending.backend.entity.User;
import com.lending.backend.enums.LoanRequestStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanRequestRepository extends JpaRepository<LoanRequest, Long> {
    @Override
    @EntityGraph(attributePaths = {"requester", "equipment"})
    List<LoanRequest> findAll();

    @EntityGraph(attributePaths = {"requester", "equipment"})
    List<LoanRequest> findByRequester(User requester);
    List<LoanRequest> findByStatus(LoanRequestStatus status);
    
    // For Overdue checks: Status is Approved and return_date < current_date
    List<LoanRequest> findByStatusAndReturnDateBefore(LoanRequestStatus status, LocalDate date);

    // Check if user has active overdue requests
    boolean existsByRequesterAndStatusAndReturnDateBefore(User requester, LoanRequestStatus status, LocalDate date);

    boolean existsByEquipmentAndStatusIn(com.lending.backend.entity.Equipment equipment, List<LoanRequestStatus> statuses);
}
