package com.vibe.yoriview.domain.favorite;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteRestaurantDto {
    private String favoriteId;
    private String restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantCategory;
    private Double rating;
    private Integer visitCount;
    private String lastVisit;
    private String createdAt;
} 