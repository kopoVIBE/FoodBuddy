package com.vibe.yoriview.domain.restaurant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "LOCATION")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @Column(name = "location_id", length = 10)
    private String locationId;  // 예: "GN"

    @Column(nullable = false, length = 50)
    private String name;        // 예: "강남구"
}
