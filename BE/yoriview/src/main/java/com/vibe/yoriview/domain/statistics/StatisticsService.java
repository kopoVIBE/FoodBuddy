package com.vibe.yoriview.domain.statistics;

import com.vibe.yoriview.domain.review.Review;
import com.vibe.yoriview.domain.review.ReviewRepository;
import com.vibe.yoriview.domain.restaurant.RestaurantRepository;
import com.vibe.yoriview.domain.statistics.dto.UserStatisticsResponseDto;
import com.vibe.yoriview.domain.visit.VisitLog;
import com.vibe.yoriview.domain.visit.VisitLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final VisitLogRepository visitLogRepository;

    public UserStatisticsResponseDto getUserStatistics(String userId) {
        List<Review> reviews = reviewRepository.findByUserId(userId);
        List<VisitLog> visits = visitLogRepository.findByUserId(userId);

        LocalDate now = LocalDate.now();

        // 1. 총 리뷰 수, 평균 평점
        int total = reviews.size();
        double avg = reviews.stream()
                .mapToDouble(r -> r.getRating().doubleValue())
                .average()
                .orElse(0.0);

        // 2. 이번 달 리뷰 수
        int thisMonth = (int) reviews.stream()
                .filter(r -> r.getCreatedAt().getMonth() == now.getMonth()
                        && r.getCreatedAt().getYear() == now.getYear())
                .count();

        // 3. 월별 리뷰 수 (yyyy-MM 기준)
        Map<String, Integer> monthlyCount = new HashMap<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        for (Review r : reviews) {
            String key = r.getCreatedAt().format(fmt);
            monthlyCount.put(key, monthlyCount.getOrDefault(key, 0) + 1);
        }

        // 4. 평점 분포 (ex: "4.5" -> 3개)
        Map<String, Integer> ratingDist = new HashMap<>();
        for (Review r : reviews) {
            String key = String.format("%.1f", r.getRating());
            ratingDist.put(key, ratingDist.getOrDefault(key, 0) + 1);
        }

        // 5. 카테고리 분포 (한식, 중식, 양식 등)
        Map<String, Integer> categoryDist = new HashMap<>();
        for (Review r : reviews) {
            restaurantRepository.findById(r.getRestaurantId()).ifPresent(res -> {
                String category = res.getCategory();
                categoryDist.put(category, categoryDist.getOrDefault(category, 0) + 1);
            });
        }

        // 6. 자주 방문한 음식점 TOP 3
        Map<String, UserStatisticsResponseDto.TopVisitedDto> visitMap = new HashMap<>();
        for (VisitLog log : visits) {
            restaurantRepository.findById(log.getRestaurantId()).ifPresent(res -> {
                String name = res.getName();
                visitMap.computeIfAbsent(name, n ->
                        UserStatisticsResponseDto.TopVisitedDto.builder()
                                .name(name)
                                .category(res.getCategory())
                                .visitCount(0)
                                .build()
                ).setVisitCount(
                        visitMap.get(name).getVisitCount() + 1
                );
            });
        }

        List<UserStatisticsResponseDto.TopVisitedDto> topVisited = new ArrayList<>(visitMap.values());
        topVisited.sort((a, b) -> b.getVisitCount() - a.getVisitCount());
        if (topVisited.size() > 3) topVisited = topVisited.subList(0, 3);

        // 7. 통합 응답
        return UserStatisticsResponseDto.builder()
                .totalReviewCount(total)
                .avgRating(Math.round(avg * 10.0) / 10.0)
                .thisMonthReviewCount(thisMonth)
                .monthlyReviewCount(monthlyCount)
                .ratingDistribution(ratingDist)
                .categoryDistribution(categoryDist)
                .topVisitedRestaurants(topVisited)
                .build();
    }
}
