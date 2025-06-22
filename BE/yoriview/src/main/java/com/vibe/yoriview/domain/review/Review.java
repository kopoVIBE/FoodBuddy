package com.vibe.yoriview.domain.review;

import com.vibe.yoriview.domain.receipt.Receipt;
import com.vibe.yoriview.domain.restaurant.Location;
import com.vibe.yoriview.domain.restaurant.Restaurant;
import com.vibe.yoriview.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "REVIEW")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @Column(name = "review_id", length = 36)
    private String reviewId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "receipt_id")
    private Receipt receipt;

    @Column(name = "style_id", length = 10)
    private String styleId;  // REVIEW_STYLE 과 직접 연결하지 않음 (비 FK 방식)

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(precision = 2, scale = 1)
    private BigDecimal rating;  // 예: 4.5

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
