package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.receipt.Receipt;
import com.vibe.yoriview.repository.ReceiptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {

    private final ReceiptRepository receiptRepository;

    @Override
    public Receipt uploadReceipt(Receipt receipt) {
        return receiptRepository.save(receipt);
    }

    @Override
    public Optional<Receipt> getReceiptById(String receiptId) {
        return receiptRepository.findById(receiptId);
    }

    @Override
    public List<Receipt> getReceiptsByUserId(String userId) {
        return receiptRepository.findAll().stream()
                .filter(receipt -> receipt.getUser().getUserId().equals(userId))
                .toList();
    }
}
