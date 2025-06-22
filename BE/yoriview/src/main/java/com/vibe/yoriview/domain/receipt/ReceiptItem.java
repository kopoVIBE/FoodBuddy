package com.vibe.yoriview.domain.receipt;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "RECEIPT_ITEM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptItem {

    @Id
    @Column(name = "item_id", length = 36)
    private String itemId;

    @ManyToOne
    @JoinColumn(name = "receipt_id")
    private Receipt receipt;

    @Column(name = "food_name", length = 100)
    private String foodName;

    private Integer price;

    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer quantity = 1;
}
