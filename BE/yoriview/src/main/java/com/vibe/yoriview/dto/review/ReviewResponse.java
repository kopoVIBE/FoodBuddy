package com.vibe.yoriview.dto.review;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private String reviewId;
    private String userId;
    private String restaurantName;
    private String styleId;
    private String content;
    private double rating;
    private String createdAt; // 포맷된 날짜 문자열로 내려줄 수 있음
}
