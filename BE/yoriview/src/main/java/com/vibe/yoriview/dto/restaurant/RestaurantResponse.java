package com.vibe.yoriview.dto.restaurant;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantResponse {
    private String restaurantId;
    private String name;
    private String category;
    private String address;
    private String locationName;  // 구 이름 등 사용자에게 보여줄 지역명
}
