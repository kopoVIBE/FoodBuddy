package com.vibe.yoriview.domain.review.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompleteReviewRequestDto {
    
    // OCR 정보
    private String ocrRestaurantName;
    private String ocrAddress;
    private String originalImg;
    private LocalDate receiptDate;
    private List<OCRMenuItem> ocrMenuItems;
    
    // 식당 정보
    private String restaurantName;
    private String restaurantCategory;
    private String restaurantAddress;
    private String locationId;
    
    // 리뷰 정보
    private String styleId;
    private String reviewContent;
    private BigDecimal rating;
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OCRMenuItem {
        private String name;
        private Integer price;
        private Integer quantity;
    }
} 