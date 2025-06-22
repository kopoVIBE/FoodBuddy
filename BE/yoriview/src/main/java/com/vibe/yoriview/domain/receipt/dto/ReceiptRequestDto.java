package com.vibe.yoriview.domain.receipt.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptRequestDto {
    private String userId;
    private String restaurantId;
    private String originalImg;
    private LocalDate receiptDate;
    private String receiptAddress;
    private List<ReceiptItemRequestDto> items;
}
