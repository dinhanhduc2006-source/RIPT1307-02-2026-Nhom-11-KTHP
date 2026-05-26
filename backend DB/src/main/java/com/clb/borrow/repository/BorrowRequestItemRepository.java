// Placeholder for BorrowRequestItemRepository.java
package com.clb.borrow.repository;

import com.clb.borrow.entity.BorrowRequestItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BorrowRequestItemRepository extends JpaRepository<BorrowRequestItem, Long> {

    @Query("""
        SELECT i.equipment.id, i.equipment.name, SUM(i.quantity)
        FROM BorrowRequestItem i
        JOIN i.request r
        WHERE r.status IN ('APPROVED', 'BORROWED', 'RETURNED', 'OVERDUE')
          AND r.processedAt >= :from AND r.processedAt < :to
        GROUP BY i.equipment.id, i.equipment.name
        ORDER BY SUM(i.quantity) DESC
        """)
    List<Object[]> topBorrowedInMonth(@Param("from") LocalDateTime from,
                                      @Param("to") LocalDateTime to);
}
