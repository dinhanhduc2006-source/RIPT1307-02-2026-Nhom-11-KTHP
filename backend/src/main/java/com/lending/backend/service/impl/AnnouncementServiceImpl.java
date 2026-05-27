package com.lending.backend.service.impl;

import com.lending.backend.entity.Announcement;
import com.lending.backend.entity.User;
import com.lending.backend.enums.AnnouncementStatus;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.repository.AnnouncementRepository;
import com.lending.backend.repository.UserRepository;
import com.lending.backend.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @Override
    public Announcement create(Announcement announcement, Long authorId) {
        User author = userRepository.findById(authorId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        announcement.setAuthor(author);
        return announcementRepository.save(announcement);
    }

    @Override
    public List<Announcement> getAllActive() {
        return announcementRepository.findByStatus(AnnouncementStatus.Active);
    }

    @Override
    public List<Announcement> getAll() {
        return announcementRepository.findAll();
    }

    @Override
    public void delete(Long id) {
        announcementRepository.deleteById(id);
    }
}
