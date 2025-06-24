package com.vibe.yoriview.domain.favorite;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.vibe.yoriview.domain.restaurant.RestaurantRepository;
import com.vibe.yoriview.domain.review.ReviewRepository;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;

    // 즐겨찾기 추가 메서드
    @Transactional
    public void addFavorite(String userId, String restaurantId) {
        // 이미 즐겨찾기 되어 있다면 예외 발생
        if (favoriteRepository.existsByUserIdAndRestaurantId(userId, restaurantId)) {
            throw new RuntimeException("이미 즐겨찾기한 음식점입니다.");
        }

        // 즐겨찾기 정보 저장
        Favorite favorite = Favorite.builder()
                .userId(userId)
                .restaurantId(restaurantId)
                .build();

        favoriteRepository.save(favorite);
    }

    // 즐겨찾기 삭제 메서드
    @Transactional
    public void removeFavorite(String userId, String restaurantId) {
        favoriteRepository.deleteByUserIdAndRestaurantId(userId, restaurantId);
    }

    // 특정 사용자의 즐겨찾기 목록 조회
    public List<Favorite> getMyFavorites(String userId) {
        return favoriteRepository.findByUserId(userId);
    }

    // 특정 음식점이 즐겨찾기 되어 있는지 확인
    public boolean isFavorited(String userId, String restaurantId) {
        return favoriteRepository.existsByUserIdAndRestaurantId(userId, restaurantId);
    }

    // 즐겨찾기한 음식점들의 상세 정보 조회 (통계 포함)
    public List<FavoriteRestaurantDto> getMyFavoriteRestaurants(String userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        
        return favorites.stream().map(favorite -> {
            // 음식점 정보 조회
            var restaurant = restaurantRepository.findById(favorite.getRestaurantId()).orElse(null);
            if (restaurant == null) return null;

            // 해당 음식점의 리뷰들 조회 (사용자가 작성한 것)
            var reviews = reviewRepository.findByUserIdAndRestaurantId(userId, favorite.getRestaurantId());
            
            // 평균 평점 계산
            double avgRating = reviews.isEmpty() ? 0.0 : 
                reviews.stream().mapToDouble(review -> review.getRating().doubleValue()).average().orElse(0.0);
            
            // 방문 횟수 (리뷰 수)
            int visitCount = reviews.size();
            
            // 최근 방문일 (가장 최근 리뷰 날짜)
            String lastVisit = reviews.isEmpty() ? "" :
                reviews.stream()
                    .map(review -> review.getCreatedAt())
                    .max(java.time.LocalDateTime::compareTo)
                    .map(date -> date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .orElse("");

            return FavoriteRestaurantDto.builder()
                .favoriteId(favorite.getFavoriteId())
                .restaurantId(favorite.getRestaurantId())
                .restaurantName(restaurant.getName())
                .restaurantAddress(restaurant.getAddress())
                .restaurantCategory(restaurant.getCategory())
                .rating(avgRating)
                .visitCount(visitCount)
                .lastVisit(lastVisit)
                .createdAt(favorite.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .build();
        }).filter(dto -> dto != null).collect(Collectors.toList());
    }
}

