package com.vibe.yoriview.domain.restaurant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "restaurant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @Column(name = "restaurant_id", length = 36)
    private String restaurantId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "location_id", length = 10)
    private String locationId;
}
