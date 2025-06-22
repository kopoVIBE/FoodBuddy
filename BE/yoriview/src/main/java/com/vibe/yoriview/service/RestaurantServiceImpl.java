package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.restaurant.Restaurant;
import com.vibe.yoriview.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;

    @Override
    public Restaurant registerRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    @Override
    public Optional<Restaurant> getRestaurantById(String restaurantId) {
        return restaurantRepository.findById(restaurantId);
    }

    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }
}
