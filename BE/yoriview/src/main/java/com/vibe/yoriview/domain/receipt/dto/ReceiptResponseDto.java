package com.vibe.yoriview.domain.receipt.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptResponseDto {
    private String receiptId;
    private String userId;
    private String restaurantId;
    private String restaurantName; // OCR로 추출한 상호명 필드 추가
    private String originalImg;
    private LocalDate receiptDate;
    private String receiptAddress;
    private LocalDateTime uploadedAt;
    private List<ReceiptItemResponseDto> items;
}
