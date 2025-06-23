package com.vibe.yoriview.domain.visit;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
public class VisitLogController {

    private final VisitLogService visitLogService;

    @PostMapping("/{restaurantId}")
    public void recordVisit(@PathVariable String restaurantId) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        visitLogService.recordVisit(userId, restaurantId);
    }

    @GetMapping("/me")
    public List<VisitLog> myVisits() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return visitLogService.getMyVisits(userId);
    }

    @GetMapping("/me/{restaurantId}/count")
    public long countVisits(@PathVariable String restaurantId) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return visitLogService.countMyVisitsToRestaurant(userId, restaurantId);
    }
}
