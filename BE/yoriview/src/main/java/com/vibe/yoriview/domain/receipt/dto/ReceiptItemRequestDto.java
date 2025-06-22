package com.vibe.yoriview.domain.receipt.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptItemRequestDto {
    private String foodName;
    private Integer price;
    private Integer quantity;
}
