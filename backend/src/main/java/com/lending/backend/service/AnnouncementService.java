package com.lending.backend.service;

import com.lending.backend.entity.Announcement;
import com.lending.backend.enums.AnnouncementStatus;
import java.util.List;

public interface AnnouncementService {
    Announcement create(Announcement announcement, Long authorId);
    Announcement update(Long id, Announcement details);
    List<Announcement> getAllActive();
    List<Announcement> getAll();
    void delete(Long id);
}
