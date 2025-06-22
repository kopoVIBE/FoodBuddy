package com.vibe.yoriview.repository;

import com.vibe.yoriview.domain.receipt.ReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptItemRepository extends JpaRepository<ReceiptItem, String> {
}
