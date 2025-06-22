package com.vibe.yoriview.domain.receipt;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "receipt_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptItem {

    @Id
    @Column(name = "item_id", length = 36)
    private String itemId;

    @Column(name = "receipt_id", length = 36)
    private String receiptId;

    @Column(name = "food_name", length = 100)
    private String foodName;

    @Column(name = "price")
    private Integer price;

    @Column(name = "quantity")
    private Integer quantity = 1;

    @PrePersist
    public void assignUUID() {
        if (this.itemId == null) {
            this.itemId = UUID.randomUUID().toString();
        }
    }
}
