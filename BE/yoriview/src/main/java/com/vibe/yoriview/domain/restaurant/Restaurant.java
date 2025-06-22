package com.vibe.yoriview.domain.restaurant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "RESTAURANT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @Column(name = "restaurant_id", length = 36)
    private String restaurantId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String category;

    @Column(length = 255)
    private String address;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;
}
