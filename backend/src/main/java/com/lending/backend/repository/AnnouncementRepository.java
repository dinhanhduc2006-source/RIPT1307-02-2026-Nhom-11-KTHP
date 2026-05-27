package com.lending.backend.repository;

import com.lending.backend.entity.Announcement;
import com.lending.backend.enums.AnnouncementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByStatus(AnnouncementStatus status);
}
