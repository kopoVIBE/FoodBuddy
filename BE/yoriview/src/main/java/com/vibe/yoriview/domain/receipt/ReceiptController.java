package com.vibe.yoriview.domain.receipt;

import com.vibe.yoriview.domain.receipt.dto.ReceiptRequestDto;
import com.vibe.yoriview.domain.receipt.dto.ReceiptResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;

    // 영수증 + 항목 등록
    @PostMapping
    public ReceiptResponseDto uploadReceipt(@RequestBody ReceiptRequestDto dto) {
        return receiptService.saveReceipt(dto);
    }

    // 모든 영수증 조회 (테스트용)
    @GetMapping
    public List<ReceiptResponseDto> getAllReceipts() {
        return receiptService.findAll();
    }
}
