package com.lending.backend.repository;

import com.lending.backend.dto.EquipmentReportResponse;
import com.lending.backend.entity.BorrowRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.QueryHints;
import jakarta.persistence.QueryHint;
import java.util.stream.Stream;
import static org.hibernate.jpa.HibernateHints.HINT_FETCH_SIZE;

@Repository
public interface BorrowRequestItemRepository extends JpaRepository<BorrowRequestItem, Long> {
    List<BorrowRequestItem> findByRequestId(Long requestId);

    @QueryHints(value = @QueryHint(name = HINT_FETCH_SIZE, value = "500"))
    @Query("SELECT bri FROM BorrowRequestItem bri JOIN FETCH bri.equipment e JOIN FETCH bri.request r " +
           "WHERE FUNCTION('MONTH', r.createdAt) = :month AND FUNCTION('YEAR', r.createdAt) = :year")
    Stream<BorrowRequestItem> streamAllByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT new com.lending.backend.dto.EquipmentReportResponse(e.name, COUNT(bri.id)) " +
           "FROM BorrowRequestItem bri JOIN bri.equipment e JOIN bri.request r " +
           "WHERE FUNCTION('MONTH', r.createdAt) = :month AND FUNCTION('YEAR', r.createdAt) = :year " +
           "GROUP BY e.id, e.name " +
           "ORDER BY COUNT(bri.id) DESC")
    List<EquipmentReportResponse> getMonthlyBorrowingStats(@Param("month") int month, @Param("year") int year);
}
