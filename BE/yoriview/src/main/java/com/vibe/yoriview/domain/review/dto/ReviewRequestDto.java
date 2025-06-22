package com.vibe.yoriview.domain.review.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequestDto {
    private String userId;
    private String receiptId;
    private String styleId;
    private String restaurantId;
    private String locationId;
    private String content;
    private BigDecimal rating;
}
