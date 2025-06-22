package com.vibe.yoriview.domain.restaurant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "location")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @Column(name = "location_id", length = 10)
    private String locationId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;
}
