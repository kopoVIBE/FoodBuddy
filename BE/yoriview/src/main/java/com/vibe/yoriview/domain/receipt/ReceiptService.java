package com.vibe.yoriview.domain.receipt;

import com.vibe.yoriview.domain.receipt.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final ReceiptItemRepository receiptItemRepository;

    public ReceiptResponseDto saveReceipt(ReceiptRequestDto dto) {
        // 영수증 저장
        Receipt receipt = Receipt.builder()
                .userId(dto.getUserId())
                .restaurantId(dto.getRestaurantId())
                .originalImg(dto.getOriginalImg())
                .receiptDate(dto.getReceiptDate())
                .receiptAddress(dto.getReceiptAddress())
                .build();
        receiptRepository.save(receipt);

        // 항목 저장
        List<ReceiptItem> savedItems = dto.getItems().stream()
                .map(itemDto -> ReceiptItem.builder()
                        .receiptId(receipt.getReceiptId())
                        .foodName(itemDto.getFoodName())
                        .price(itemDto.getPrice())
                        .quantity(itemDto.getQuantity() != null ? itemDto.getQuantity() : 1)
                        .build())
                .map(receiptItemRepository::save)
                .toList();

        // 응답 DTO 생성
        List<ReceiptItemResponseDto> itemDtos = savedItems.stream()
                .map(item -> ReceiptItemResponseDto.builder()
                        .itemId(item.getItemId())
                        .foodName(item.getFoodName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build())
                .toList();

        return ReceiptResponseDto.builder()
                .receiptId(receipt.getReceiptId())
                .userId(receipt.getUserId())
                .restaurantId(receipt.getRestaurantId())
                .originalImg(receipt.getOriginalImg())
                .receiptDate(receipt.getReceiptDate())
                .receiptAddress(receipt.getReceiptAddress())
                .uploadedAt(receipt.getUploadedAt())
                .items(itemDtos)
                .build();
    }

    public List<ReceiptResponseDto> findAll() {
        return receiptRepository.findAll().stream().map(r -> {
            List<ReceiptItemResponseDto> itemDtos = receiptItemRepository.findByReceiptId(r.getReceiptId()).stream()
                    .map(i -> ReceiptItemResponseDto.builder()
                            .itemId(i.getItemId())
                            .foodName(i.getFoodName())
                            .price(i.getPrice())
                            .quantity(i.getQuantity())
                            .build())
                    .toList();

            return ReceiptResponseDto.builder()
                    .receiptId(r.getReceiptId())
                    .userId(r.getUserId())
                    .restaurantId(r.getRestaurantId())
                    .originalImg(r.getOriginalImg())
                    .receiptDate(r.getReceiptDate())
                    .receiptAddress(r.getReceiptAddress())
                    .uploadedAt(r.getUploadedAt())
                    .items(itemDtos)
                    .build();
        }).toList();
    }
}
