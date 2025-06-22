package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.receipt.ReceiptItem;

import java.util.List;
import java.util.Optional;

public interface ReceiptItemService {
    ReceiptItem addItem(ReceiptItem item);
    List<ReceiptItem> getItemsByReceiptId(String receiptId);
    Optional<ReceiptItem> getItemById(String itemId);
}
