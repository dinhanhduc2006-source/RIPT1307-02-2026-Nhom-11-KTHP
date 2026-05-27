package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.Announcement;
import com.lending.backend.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping("/active")
    public ResponseResult<List<Announcement>> getActive() {
        return ResponseResult.success(announcementService.getAllActive());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<List<Announcement>> getAll() {
        return ResponseResult.success(announcementService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<Announcement> create(@RequestBody Announcement announcement, @RequestParam Long authorId) {
        return ResponseResult.success(announcementService.create(announcement, authorId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<String> delete(@PathVariable Long id) {
        announcementService.delete(id);
        return ResponseResult.success("Deleted successfully");
    }
}
