package com.vibe.yoriview.repository;

import com.vibe.yoriview.domain.restaurant.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, String> {
}
