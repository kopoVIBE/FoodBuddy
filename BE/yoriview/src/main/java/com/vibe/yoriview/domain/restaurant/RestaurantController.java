package com.vibe.yoriview.domain.restaurant;

import com.vibe.yoriview.domain.restaurant.dto.LocationDto;
import com.vibe.yoriview.domain.restaurant.dto.RestaurantRequestDto;
import com.vibe.yoriview.domain.restaurant.dto.RestaurantResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    // 음식점 등록
    @PostMapping
    public RestaurantResponseDto register(@RequestBody RestaurantRequestDto dto) {
        return restaurantService.create(dto);
    }

    // 음식점 전체 조회
    @GetMapping
    public List<RestaurantResponseDto> getAll() {
        return restaurantService.getAllRestaurants();
    }

    // 지역 목록 조회
    @GetMapping("/locations")
    public List<LocationDto> getLocations() {
        return restaurantService.getAllLocations();
    }

    // 현재 사용자가 방문한 음식점 조회
    @GetMapping("/visited")
    public List<RestaurantResponseDto> getVisitedRestaurants() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return restaurantService.getVisitedRestaurants(userId);
    }
}
