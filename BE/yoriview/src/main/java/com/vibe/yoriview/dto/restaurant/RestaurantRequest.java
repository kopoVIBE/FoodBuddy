package com.vibe.yoriview.dto.restaurant;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantRequest {
    private String restaurantId;
    private String name;
    private String category;
    private String address;
    private String locationId;
}
