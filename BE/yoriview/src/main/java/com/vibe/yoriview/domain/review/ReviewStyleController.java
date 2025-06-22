package com.vibe.yoriview.domain.review;

import com.vibe.yoriview.domain.review.dto.ReviewStyleRequestDto;
import com.vibe.yoriview.domain.review.dto.ReviewStyleResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review-styles")
@RequiredArgsConstructor
public class ReviewStyleController {

    private final ReviewStyleService reviewStyleService;

    @PostMapping
    public ReviewStyleResponseDto create(@RequestBody ReviewStyleRequestDto dto) {
        return reviewStyleService.create(dto);
    }

    @GetMapping
    public List<ReviewStyleResponseDto> getAll() {
        return reviewStyleService.findAll();
    }
}
