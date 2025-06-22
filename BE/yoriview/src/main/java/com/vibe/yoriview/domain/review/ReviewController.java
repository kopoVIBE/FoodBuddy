package com.vibe.yoriview.domain.review;

import com.vibe.yoriview.domain.review.dto.ReviewRequestDto;
import com.vibe.yoriview.domain.review.dto.ReviewResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 등록
    @PostMapping
    public ReviewResponseDto create(@RequestBody ReviewRequestDto dto) {
        return reviewService.create(dto);
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
}
