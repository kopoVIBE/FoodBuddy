package com.vibe.yoriview.domain.review;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "review")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @Column(name = "review_id", length = 36)
    private String reviewId;

    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @Column(name = "receipt_id", length = 36, nullable = false)
    private String receiptId;

    @Column(name = "style_id", length = 10, nullable = false)
    private String styleId;

    @Column(name = "restaurant_id", length = 36, nullable = false)
    private String restaurantId;

    @Column(name = "location_id", length = 10, nullable = false)
    private String locationId;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "rating", precision = 2, scale = 1)
    private BigDecimal rating;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void assignUUID() {
        if (this.reviewId == null) {
            this.reviewId = UUID.randomUUID().toString();
        }
    }
}
