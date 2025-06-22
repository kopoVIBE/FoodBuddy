package com.vibe.yoriview.domain.receipt.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptItemResponseDto {
    private String itemId;
    private String foodName;
    private Integer price;
    private Integer quantity;
}
