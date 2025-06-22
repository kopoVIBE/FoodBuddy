package com.vibe.yoriview.dto.receipt;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptItemRequest {
    private String itemId;
    private String receiptId;
    private String foodName;
    private Integer price;
    private Integer quantity;
}
