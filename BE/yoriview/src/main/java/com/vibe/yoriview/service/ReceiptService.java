package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.receipt.Receipt;

import java.util.List;
import java.util.Optional;

public interface ReceiptService {
    Receipt uploadReceipt(Receipt receipt);
    Optional<Receipt> getReceiptById(String receiptId);
    List<Receipt> getReceiptsByUserId(String userId);
}
