package com.vibe.yoriview.domain.receipt;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReceiptItemRepository extends JpaRepository<ReceiptItem, String> {
    List<ReceiptItem> findByReceiptId(String receiptId);
}
