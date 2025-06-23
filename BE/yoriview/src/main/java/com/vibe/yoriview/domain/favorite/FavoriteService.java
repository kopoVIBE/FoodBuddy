package com.vibe.yoriview.domain.favorite;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public void addFavorite(String userId, String restaurantId) {
        if (favoriteRepository.existsByUserIdAndRestaurantId(userId, restaurantId)) {
            throw new RuntimeException("이미 즐겨찾기한 음식점입니다.");
        }
        Favorite favorite = Favorite.builder()
                .userId(userId)
                .restaurantId(restaurantId)
                .build();
        favoriteRepository.save(favorite);
    }

    public void removeFavorite(String userId, String restaurantId) {
        favoriteRepository.deleteByUserIdAndRestaurantId(userId, restaurantId);
    }

    public List<Favorite> getMyFavorites(String userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public boolean isFavorited(String userId, String restaurantId) {
        return favoriteRepository.existsByUserIdAndRestaurantId(userId, restaurantId);
    }
}
