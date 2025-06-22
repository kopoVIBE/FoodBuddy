package com.vibe.yoriview.dto.receipt;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptResponse {
    private String receiptId;
    private String userId;
    private String restaurantName;
    private String receiptDate;
    private String receiptAddress;
    private String originalImg;
    private String uploadedAt;
}
