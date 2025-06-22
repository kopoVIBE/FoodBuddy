package com.vibe.yoriview.domain.restaurant;

import com.vibe.yoriview.domain.restaurant.dto.LocationDto;
import com.vibe.yoriview.domain.restaurant.dto.RestaurantRequestDto;
import com.vibe.yoriview.domain.restaurant.dto.RestaurantResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final LocationRepository locationRepository;

    public RestaurantResponseDto create(RestaurantRequestDto dto) {
        Restaurant entity = Restaurant.builder()
                .restaurantId(java.util.UUID.randomUUID().toString())
                .name(dto.getName())
                .category(dto.getCategory())
                .address(dto.getAddress())
                .locationId(dto.getLocationId())
                .build();
        restaurantRepository.save(entity);
        return RestaurantResponseDto.from(entity);
    }

    public List<RestaurantResponseDto> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(RestaurantResponseDto::from)
                .toList();
    }

    public List<LocationDto> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(LocationDto::from)
                .toList();
    }
}
