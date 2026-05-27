package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.Penalty;
import com.lending.backend.service.PenaltyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/penalties")
@RequiredArgsConstructor
public class PenaltyController {

    private final PenaltyService penaltyService;

    @GetMapping("/my")
    public ResponseResult<List<Penalty>> getMyPenalties(@RequestParam Long userId) {
        return ResponseResult.success(penaltyService.getMyPenalties(userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('Admin')")
    public ResponseResult<List<Penalty>> getAll() {
        return ResponseResult.success(penaltyService.getAll());
    }

    @PatchMapping("/{id}/pay")
    @PreAuthorize("hasRole('Admin')")
    public ResponseResult<Penalty> pay(@PathVariable Long id) {
        return ResponseResult.success(penaltyService.payPenalty(id));
    }
}
