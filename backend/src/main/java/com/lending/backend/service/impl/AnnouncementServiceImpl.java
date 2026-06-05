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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementServiceImpl implements AnnouncementService {
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Announcement create(Announcement announcement, Long authorId) {
        User author = userRepository.findById(authorId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        announcement.setAuthor(author);
        if (announcement.getStatus() == null) {
            announcement.setStatus(AnnouncementStatus.Active);
        }
        return announcementRepository.save(announcement);
    }

    @Override
    @Transactional
    public Announcement update(Long id, Announcement details) {
        Announcement announcement = announcementRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        if (details.getTitle() != null) announcement.setTitle(details.getTitle());
        if (details.getContent() != null) announcement.setContent(details.getContent());
        if (details.getStatus() != null) announcement.setStatus(details.getStatus());
        return announcementRepository.save(announcement);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Announcement> getAllActive() {
        return announcementRepository.findByStatus(AnnouncementStatus.Active);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Announcement> getAll() {
        return announcementRepository.findAll();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        announcementRepository.deleteById(id);
    }
}
