package com.vibe.yoriview.domain.favorite;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "favorite", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "restaurantId"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @Column(length = 36)
    private String favoriteId;

    @Column(length = 36, nullable = false)
    private String userId;

    @Column(length = 36, nullable = false)
    private String restaurantId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @PrePersist
    public void assignUUID() {
        if (this.favoriteId == null) {
            this.favoriteId = UUID.randomUUID().toString();
        }
    }
}
