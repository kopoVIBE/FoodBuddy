package com.vibe.yoriview.domain.review;

import com.vibe.yoriview.domain.receipt.Receipt;
import com.vibe.yoriview.domain.receipt.ReceiptItem;
import com.vibe.yoriview.domain.receipt.ReceiptItemRepository;
import com.vibe.yoriview.domain.receipt.ReceiptRepository;
import com.vibe.yoriview.domain.restaurant.Restaurant;
import com.vibe.yoriview.domain.restaurant.RestaurantRepository;
import com.vibe.yoriview.domain.review.dto.CompleteReviewRequestDto;
import com.vibe.yoriview.domain.review.dto.CompleteReviewResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompleteReviewService {

    private final ReceiptRepository receiptRepository;
    private final ReceiptItemRepository receiptItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;

    @Transactional
    public CompleteReviewResponseDto saveCompleteReview(CompleteReviewRequestDto dto, String userId) {
        try {
            log.info("통합 리뷰 저장 시작 - 사용자: {}", userId);

            // 1. 식당 정보 저장 (또는 기존 식당 찾기)
            Restaurant restaurant = findOrCreateRestaurant(dto);
            log.info("식당 정보 처리 완료 - ID: {}, 이름: {}", restaurant.getRestaurantId(), restaurant.getName());

            // 2. 영수증 정보 저장
            Receipt receipt = saveReceipt(dto, userId, restaurant.getRestaurantId());
            log.info("영수증 저장 완료 - ID: {}", receipt.getReceiptId());

            // 3. 영수증 항목들 저장
            saveReceiptItems(dto.getOcrMenuItems(), receipt.getReceiptId());
            log.info("영수증 항목 저장 완료 - 항목 수: {}", dto.getOcrMenuItems().size());

            // 4. 리뷰 저장
            Review review = saveReview(dto, userId, receipt.getReceiptId(), restaurant.getRestaurantId());
            log.info("리뷰 저장 완료 - ID: {}", review.getReviewId());

            // 5. OCR input 폴더의 이미지 파일 삭제
            deleteOcrInputFiles();

            return CompleteReviewResponseDto.builder()
                    .success(true)
                    .reviewId(review.getReviewId())
                    .receiptId(receipt.getReceiptId())
                    .restaurantId(restaurant.getRestaurantId())
                    .message("리뷰가 성공적으로 저장되었습니다.")
                    .build();

        } catch (Exception e) {
            log.error("통합 리뷰 저장 중 오류 발생", e);
            throw new RuntimeException("리뷰 저장에 실패했습니다: " + e.getMessage());
        }
    }

    private Restaurant findOrCreateRestaurant(CompleteReviewRequestDto dto) {
        // 이름과 주소로 기존 식당 찾기
        List<Restaurant> existingRestaurants = restaurantRepository.findByNameAndAddress(
                dto.getRestaurantName(), dto.getRestaurantAddress());

        if (!existingRestaurants.isEmpty()) {
            return existingRestaurants.get(0);
        }

        // 새 식당 생성
        Restaurant newRestaurant = Restaurant.builder()
                .restaurantId(UUID.randomUUID().toString())
                .name(dto.getRestaurantName())
                .category(dto.getRestaurantCategory())
                .address(dto.getRestaurantAddress())
                .locationId(dto.getLocationId())
                .build();

        return restaurantRepository.save(newRestaurant);
    }

    private Receipt saveReceipt(CompleteReviewRequestDto dto, String userId, String restaurantId) {
        Receipt receipt = Receipt.builder()
                .userId(userId)
                .restaurantId(restaurantId)
                .restaurantName(dto.getOcrRestaurantName())
                .originalImg(dto.getOriginalImg())
                .receiptDate(dto.getReceiptDate())
                .receiptAddress(dto.getOcrAddress())
                .build();

        return receiptRepository.save(receipt);
    }

    private void saveReceiptItems(List<CompleteReviewRequestDto.OCRMenuItem> menuItems, String receiptId) {
        if (menuItems != null && !menuItems.isEmpty()) {
            List<ReceiptItem> items = menuItems.stream()
                    .map(item -> ReceiptItem.builder()
                            .receiptId(receiptId)
                            .foodName(item.getName())
                            .price(item.getPrice())
                            .quantity(item.getQuantity() != null ? item.getQuantity() : 1)
                            .build())
                    .toList();

            receiptItemRepository.saveAll(items);
        }
    }

    private Review saveReview(CompleteReviewRequestDto dto, String userId, String receiptId, String restaurantId) {
        Review review = Review.builder()
                .userId(userId)
                .receiptId(receiptId)
                .styleId(dto.getStyleId())
                .restaurantId(restaurantId)
                .locationId(dto.getLocationId())
                .content(dto.getReviewContent())
                .rating(dto.getRating())
                .build();

        return reviewRepository.save(review);
    }

    /**
     * OCR input 폴더의 이미지 파일들을 삭제합니다.
     */
    private void deleteOcrInputFiles() {
        try {
            String ocrBasePath = findOcrBasePath();
            String inputDir = ocrBasePath + "/input";
            Path inputDirPath = Paths.get(inputDir);
            
            if (Files.exists(inputDirPath) && Files.isDirectory(inputDirPath)) {
                // input 폴더의 모든 파일 삭제
                Files.list(inputDirPath)
                    .filter(Files::isRegularFile)
                    .forEach(file -> {
                        try {
                            Files.delete(file);
                            log.info("OCR input 파일 삭제됨: {}", file.getFileName());
                        } catch (IOException e) {
                            log.warn("OCR input 파일 삭제 실패: {} - {}", file.getFileName(), e.getMessage());
                        }
                    });
                log.info("OCR input 폴더 정리 완료");
            } else {
                log.debug("OCR input 폴더가 존재하지 않음: {}", inputDir);
            }
        } catch (Exception e) {
            log.warn("OCR input 파일 삭제 중 오류 발생: {}", e.getMessage());
            // 파일 삭제 실패는 전체 프로세스에 영향을 주지 않도록 예외를 던지지 않음
        }
    }

    /**
     * OCR 기본 경로를 찾는 메소드
     */
    private String findOcrBasePath() {
        String userDir = System.getProperty("user.dir");
        String[] possiblePaths = {
            userDir + "/BE/yoriview/ocr",  // Spring Boot jar 실행 시 (EC2)
            userDir + "/ocr"               // 로컬 개발 시
        };
        
        for (String path : possiblePaths) {
            File scriptFile = new File(path + "/ocr-parser.py");
            if (scriptFile.exists()) {
                return path;
            }
        }
        
        // 기본값으로 BE/yoriview/ocr 반환
        return userDir + "/BE/yoriview/ocr";
    }
} 