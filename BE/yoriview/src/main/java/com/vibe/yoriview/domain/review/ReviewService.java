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

    public ReviewResponseDto create(ReviewRequestDto dto) {
        Review review = Review.builder()
                .userId(dto.getUserId())
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
}
