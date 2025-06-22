package com.vibe.yoriview.domain.restaurant.dto;

import com.vibe.yoriview.domain.restaurant.Restaurant;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantResponseDto {
    private String restaurantId;
    private String name;
    private String category;
    private String address;
    private String locationId;

    public static RestaurantResponseDto from(Restaurant restaurant) {
        return RestaurantResponseDto.builder()
                .restaurantId(restaurant.getRestaurantId())
                .name(restaurant.getName())
                .category(restaurant.getCategory())
                .address(restaurant.getAddress())
                .locationId(restaurant.getLocationId())
                .build();
    }
}
