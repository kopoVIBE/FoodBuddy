package com.vibe.yoriview.domain.favorite;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    // 즐겨찾기 추가 메서드
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
}

