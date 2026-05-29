package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.Announcement;
import com.lending.backend.entity.User;
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
    public ResponseResult<Announcement> create(@RequestBody Announcement announcement) {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseResult.success(announcementService.create(announcement, currentUser.getId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<Announcement> update(@PathVariable("id") Long id, @RequestBody Announcement announcement) {
        return ResponseResult.success(announcementService.update(id, announcement));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseResult<String> delete(@PathVariable("id") Long id) {
        announcementService.delete(id);
        return ResponseResult.success("Deleted successfully");
    }
}
