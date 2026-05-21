package com.lending.backend.repository;

import com.lending.backend.dto.EquipmentReportResponse;
import com.lending.backend.entity.BorrowRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRequestItemRepository extends JpaRepository<BorrowRequestItem, Long> {
    List<BorrowRequestItem> findByRequestId(Long requestId);

    @Query("SELECT new com.lending.backend.dto.EquipmentReportResponse(e.name, COUNT(bri.id)) " +
           "FROM BorrowRequestItem bri JOIN bri.equipment e JOIN bri.request r " +
           "WHERE FUNCTION('MONTH', r.createdAt) = :month AND FUNCTION('YEAR', r.createdAt) = :year " +
           "GROUP BY e.id, e.name " +
           "ORDER BY COUNT(bri.id) DESC")
    List<EquipmentReportResponse> getMonthlyBorrowingStats(@Param("month") int month, @Param("year") int year);
}
