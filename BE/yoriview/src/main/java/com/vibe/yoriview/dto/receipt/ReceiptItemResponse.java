package com.vibe.yoriview.dto.receipt;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptItemResponse {
    private String itemId;
    private String foodName;
    private Integer price;
    private Integer quantity;
}
