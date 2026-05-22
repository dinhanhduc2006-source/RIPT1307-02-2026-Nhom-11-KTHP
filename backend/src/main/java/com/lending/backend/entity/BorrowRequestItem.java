package com.lending.backend.entity;

import com.lending.backend.enums.BorrowItemStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_request_items", 
       uniqueConstraints = {@UniqueConstraint(columnNames = {"request_id", "equipment_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowRequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private BorrowRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_status", nullable = false)
    private BorrowItemStatus itemStatus = BorrowItemStatus.pending;

    @Column(name = "condition_note", length = 255)
    private String conditionNote;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
