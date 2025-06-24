package com.vibe.yoriview.domain.review.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyReviewResponseDto {
    // 리뷰 기본 정보
    private String reviewId;
    private String userId;
    private String receiptId;
    private String styleId;
    private String restaurantId;
    private String locationId;
    private String content;
    private BigDecimal rating;
    private LocalDateTime createdAt;
    
    // 식당 정보
    private String restaurantName;
    private String restaurantAddress;
    private String restaurantCategory;
    
    // 영수증 정보
    private String originalImg; // Base64 이미지
    private LocalDate receiptDate;
} 