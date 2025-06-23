package com.vibe.yoriview.domain.review;

import com.vibe.yoriview.domain.review.dto.ReviewRequestDto;
import com.vibe.yoriview.domain.review.dto.ReviewResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

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

    //
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
            reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);  // 최신순 기본
        }

        return reviews.stream()
                .map(ReviewResponseDto::from)
                .toList();
    }

    public ReviewResponseDto updateReview(String reviewId, ReviewRequestDto dto, String userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

        // 사용자 권한 확인
        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("리뷰 수정 권한이 없습니다.");
        }

        // 수정 가능 필드만 업데이트
        review.setContent(dto.getContent());
        review.setRating(dto.getRating());
        review.setStyleId(dto.getStyleId());
        review.setLocationId(dto.getLocationId());

        reviewRepository.save(review);
        return ReviewResponseDto.from(review);
    }

    public void deleteReview(String reviewId, String userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("리뷰 삭제 권한이 없습니다.");
        }

        reviewRepository.delete(review);
    }



}
