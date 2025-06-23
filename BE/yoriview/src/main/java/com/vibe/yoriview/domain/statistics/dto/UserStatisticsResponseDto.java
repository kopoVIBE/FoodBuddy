package com.vibe.yoriview.domain.statistics.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatisticsResponseDto {
    private int totalReviewCount;                       // 총 리뷰 수
    private double avgRating;                           // 평균 평점
    private int thisMonthReviewCount;                   // 이번 달 리뷰 수
    private Map<String, Integer> monthlyReviewCount;    // 월별 리뷰 수 (yyyy-MM -> count)
    private Map<String, Integer> ratingDistribution;    // 평점 분포 (ex: "4.5" -> 3)
    private Map<String, Integer> categoryDistribution;  // 카테고리 분포 (한식, 일식 등)
    private List<TopVisitedDto> topVisitedRestaurants;  // 자주 방문한 음식점 TOP 3

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopVisitedDto {
        private String name;       // 음식점 이름
        private String category;   // 음식점 카테고리
        private int visitCount;    // 방문 횟수
    }
}
