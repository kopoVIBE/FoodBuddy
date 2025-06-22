package com.vibe.yoriview.dto.restaurant;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationResponse {
    private String locationId;
    private String name;  // 예: "강남구"
}
