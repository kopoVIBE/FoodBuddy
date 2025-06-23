package com.vibe.yoriview.domain.review;

import com.vibe.yoriview.domain.review.dto.ReviewRequestDto;
import com.vibe.yoriview.domain.review.dto.ReviewResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 등록
    @PostMapping
    public ReviewResponseDto create(@Valid @RequestBody ReviewRequestDto dto) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return reviewService.create(dto, userId);
    }

    // 리뷰 수정
    @PutMapping("/{reviewId}")
    public ReviewResponseDto updateReview(
            @PathVariable String reviewId,
            @Valid @RequestBody ReviewRequestDto dto
    ) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return reviewService.updateReview(reviewId, dto, userId);
    }

    // 전체 리뷰 조회 (관리자/테스트용)
    @GetMapping
    public List<ReviewResponseDto> getAll() {
        return reviewService.findAll();
    }

    // 특정 사용자 리뷰 조회
    @GetMapping("/user/{userId}")
    public List<ReviewResponseDto> getByUser(@PathVariable String userId) {
        return reviewService.findByUserId(userId);
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable String reviewId) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        reviewService.deleteReview(reviewId, userId);
    }

    // 로그인한 사용자의 리뷰만 조회
    @GetMapping("/me")
    public List<ReviewResponseDto> getMyReviews(
            @RequestParam(defaultValue = "latest") String order
    ) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return reviewService.findByUserId(userId, order);
    }

}
