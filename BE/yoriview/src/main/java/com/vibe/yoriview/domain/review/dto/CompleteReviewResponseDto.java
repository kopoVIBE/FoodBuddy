package com.vibe.yoriview.domain.review.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompleteReviewResponseDto {
    
    private String reviewId;
    private String receiptId;
    private String restaurantId;
    private String message;
    private boolean success;
} 