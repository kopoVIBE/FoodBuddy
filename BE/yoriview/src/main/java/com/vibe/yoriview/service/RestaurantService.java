package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.restaurant.Restaurant;

import java.util.List;
import java.util.Optional;

public interface RestaurantService {
    Restaurant registerRestaurant(Restaurant restaurant);
    Optional<Restaurant> getRestaurantById(String restaurantId);
    List<Restaurant> getAllRestaurants();
}
