package com.lending.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemConfig {

    @Id
    private Integer id = 1;

    @Column(name = "max_borrow_days", nullable = false)
    private Integer maxBorrowDays = 7;

    @Column(name = "fine_per_day", nullable = false)
    private Long finePerDay = 20000L;

    @Column(name = "allow_borrow_when_debt", nullable = false)
    private Boolean allowBorrowWhenDebt = false;

    @Column(name = "admin_email", length = 150)
    private String adminEmail;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
