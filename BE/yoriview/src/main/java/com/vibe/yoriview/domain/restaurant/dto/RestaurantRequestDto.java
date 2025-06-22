package com.vibe.yoriview.domain.restaurant.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantRequestDto {
    private String name;
    private String category;
    private String address;
    private String locationId;
}
