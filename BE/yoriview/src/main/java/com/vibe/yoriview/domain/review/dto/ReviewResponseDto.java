package com.vibe.yoriview.domain.review.dto;

import com.vibe.yoriview.domain.review.Review;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponseDto {
    private String reviewId;
    private String userId;
    private String receiptId;
    private String styleId;
    private String restaurantId;
    private String locationId;
    private String content;
    private BigDecimal rating;
    private LocalDateTime createdAt;

    public static ReviewResponseDto from(Review review) {
        return ReviewResponseDto.builder()
                .reviewId(review.getReviewId())
                .userId(review.getUserId())
                .receiptId(review.getReceiptId())
                .styleId(review.getStyleId())
                .restaurantId(review.getRestaurantId())
                .locationId(review.getLocationId())
                .content(review.getContent())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
