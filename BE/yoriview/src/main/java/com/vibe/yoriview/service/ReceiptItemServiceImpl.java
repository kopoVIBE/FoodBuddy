package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.receipt.ReceiptItem;
import com.vibe.yoriview.repository.ReceiptItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReceiptItemServiceImpl implements ReceiptItemService {

    private final ReceiptItemRepository itemRepository;

    @Override
    public ReceiptItem addItem(ReceiptItem item) {
        return itemRepository.save(item);
    }

    @Override
    public Optional<ReceiptItem> getItemById(String itemId) {
        return itemRepository.findById(itemId);
    }

    @Override
    public List<ReceiptItem> getItemsByReceiptId(String receiptId) {
        return itemRepository.findAll().stream()
                .filter(item -> item.getReceipt().getReceiptId().equals(receiptId))
                .toList();
    }
}
