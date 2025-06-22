package com.vibe.yoriview.dto.review;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequest {
    private String reviewId;        // 생성 시 UUID 직접 생성 or 백에서 처리
    private String userId;
    private String receiptId;
    private String styleId;
    private String restaurantId;
    private String locationId;
    private String content;
    private double rating;
}
