package com.vibe.yoriview.domain.favorite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, String> {
    boolean existsByUserIdAndRestaurantId(String userId, String restaurantId);
    void deleteByUserIdAndRestaurantId(String userId, String restaurantId);
    List<Favorite> findByUserId(String userId);
}
