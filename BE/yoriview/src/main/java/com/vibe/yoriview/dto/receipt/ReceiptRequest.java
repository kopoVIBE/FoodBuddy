package com.vibe.yoriview.dto.receipt;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptRequest {
    private String receiptId;
    private String userId;
    private String restaurantId;
    private String originalImg;      // 이미지 경로 또는 S3 키
    private String receiptDate;      // "2025-06-22" 형식 문자열
    private String receiptAddress;
}
