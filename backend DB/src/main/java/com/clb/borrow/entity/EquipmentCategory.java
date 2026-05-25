// Placeholder for EquipmentCategory.java
package com.clb.borrow.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "equipment_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String name;
}
