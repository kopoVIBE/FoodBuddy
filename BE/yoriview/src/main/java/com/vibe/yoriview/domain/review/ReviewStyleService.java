package com.vibe.yoriview.domain.review;

import com.vibe.yoriview.domain.review.dto.ReviewStyleRequestDto;
import com.vibe.yoriview.domain.review.dto.ReviewStyleResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewStyleService {

    private final ReviewStyleRepository reviewStyleRepository;

    public ReviewStyleResponseDto create(ReviewStyleRequestDto dto) {
        ReviewStyle entity = ReviewStyle.builder()
                .styleId(dto.getStyleId())
                .styleName(dto.getStyleName())
                .description(dto.getDescription())
                .build();
        reviewStyleRepository.save(entity);
        return ReviewStyleResponseDto.from(entity);
    }

    public List<ReviewStyleResponseDto> findAll() {
        return reviewStyleRepository.findAll().stream()
                .map(ReviewStyleResponseDto::from)
                .toList();
    }
}
