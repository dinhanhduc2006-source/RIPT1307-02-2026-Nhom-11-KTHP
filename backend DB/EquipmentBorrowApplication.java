// Placeholder for BackendApplication.java
package com.clb.borrow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EquipmentBorrowApplication {

    public static void main(String[] args) {
        SpringApplication.run(EquipmentBorrowApplication.class, args);
    }
}
