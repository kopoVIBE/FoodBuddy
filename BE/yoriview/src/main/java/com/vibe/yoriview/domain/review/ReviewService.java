package com.vibe.yoriview.domain.review;

import com.vibe.yoriview.domain.review.dto.ReviewRequestDto;
import com.vibe.yoriview.domain.review.dto.ReviewResponseDto;
import com.vibe.yoriview.domain.review.dto.MyReviewResponseDto;
import com.vibe.yoriview.domain.restaurant.RestaurantRepository;
import com.vibe.yoriview.domain.receipt.ReceiptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final ReceiptRepository receiptRepository;

    public ReviewResponseDto create(ReviewRequestDto dto, String userId) {
        Review review = Review.builder()
                .userId(userId)
                .receiptId(dto.getReceiptId())
                .styleId(dto.getStyleId())
                .restaurantId(dto.getRestaurantId())
                .locationId(dto.getLocationId())
                .content(dto.getContent())
                .rating(dto.getRating())
                .build();
        reviewRepository.save(review);
        return ReviewResponseDto.from(review);
    }

    public List<ReviewResponseDto> findAll() {
        return reviewRepository.findAll().stream()
                .map(ReviewResponseDto::from)
                .toList();
    }

    public List<ReviewResponseDto> findByUserId(String userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(ReviewResponseDto::from)
                .toList();
    }

    public List<ReviewResponseDto> findByUserId(String userId, String order) {
        List<Review> reviews;
        if ("oldest".equalsIgnoreCase(order)) {
            reviews = reviewRepository.findByUserIdOrderByCreatedAtAsc(userId);
        } else {
            reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }

        return reviews.stream()
                .map(ReviewResponseDto::from)
                .toList();
    }

    // 사용자의 리뷰를 상세 정보와 함께 조회
    public List<MyReviewResponseDto> getMyReviews(String userId, String order) {
        List<Review> reviews;
        if ("oldest".equalsIgnoreCase(order)) {
            reviews = reviewRepository.findByUserIdOrderByCreatedAtAsc(userId);
        } else {
            reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }

        return reviews.stream()
                .map(review -> {
                    MyReviewResponseDto dto = MyReviewResponseDto.builder()
                            .reviewId(review.getReviewId())
                            .userId(review.getUserId())
                            .receiptId(review.getReceiptId())
                            .styleId(review.getStyleId())
                            .restaurantId(review.getRestaurantId())
                            .locationId(review.getLocationId())
                            .content(review.getContent())
                            .rating(review.getRating())
                            .createdAt(review.getCreatedAt())
                            .build();

                    // 식당 정보 조회
                    restaurantRepository.findById(review.getRestaurantId())
                            .ifPresent(restaurant -> {
                                dto.setRestaurantName(restaurant.getName());
                                dto.setRestaurantAddress(restaurant.getAddress());
                                dto.setRestaurantCategory(restaurant.getCategory());
                            });

                    // 영수증 정보 조회
                    receiptRepository.findById(review.getReceiptId())
                            .ifPresent(receipt -> {
                                dto.setOriginalImg(receipt.getOriginalImg());
                                dto.setReceiptDate(receipt.getReceiptDate());
                            });

                    return dto;
                })
                .toList();
    }

    public ReviewResponseDto updateReview(String reviewId, ReviewRequestDto dto, String userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("리뷰 수정 권한이 없습니다.");
        }

        review.setContent(dto.getContent());
        review.setRating(dto.getRating());
        review.setStyleId(dto.getStyleId());
        review.setLocationId(dto.getLocationId());

        reviewRepository.save(review);
        return ReviewResponseDto.from(review);
    }

    @Transactional
    public void deleteReview(String reviewId, String userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("리뷰 삭제 권한이 없습니다.");
        }

        reviewRepository.delete(review);
    }
}
