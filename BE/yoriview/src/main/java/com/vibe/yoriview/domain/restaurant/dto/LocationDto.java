package com.vibe.yoriview.domain.restaurant.dto;

import com.vibe.yoriview.domain.restaurant.Location;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationDto {
    private String locationId;
    private String name;

    public static LocationDto from(Location location) {
        return LocationDto.builder()
                .locationId(location.getLocationId())
                .name(location.getName())
                .build();
    }
}
