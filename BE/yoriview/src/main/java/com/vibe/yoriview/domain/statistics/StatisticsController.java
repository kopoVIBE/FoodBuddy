package com.vibe.yoriview.domain.statistics;

import com.vibe.yoriview.domain.statistics.dto.UserStatisticsResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    // 로그인한 사용자의 통계 정보 반환
    @GetMapping("/me")
    public UserStatisticsResponseDto getMyStatistics() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return statisticsService.getUserStatistics(userId);
    }
}
