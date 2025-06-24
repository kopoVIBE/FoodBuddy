package com.vibe.yoriview.domain.restaurant;

import com.vibe.yoriview.domain.restaurant.dto.LocationDto;
import com.vibe.yoriview.domain.restaurant.dto.RestaurantRequestDto;
import com.vibe.yoriview.domain.restaurant.dto.RestaurantResponseDto;
import com.vibe.yoriview.domain.review.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final LocationRepository locationRepository;
    private final ReviewRepository reviewRepository;

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

    // 사용자가 방문한 음식점 조회 (리뷰를 작성한 음식점)
    public List<RestaurantResponseDto> getVisitedRestaurants(String userId) {
        // 사용자가 작성한 리뷰의 음식점 ID 목록 조회
        List<String> visitedRestaurantIds = reviewRepository.findByUserId(userId)
                .stream()
                .map(review -> review.getRestaurantId())
                .distinct()
                .collect(Collectors.toList());

        // 해당 음식점들의 정보 조회
        return restaurantRepository.findAllById(visitedRestaurantIds)
                .stream()
                .map(RestaurantResponseDto::from)
                .collect(Collectors.toList());
    }
}
