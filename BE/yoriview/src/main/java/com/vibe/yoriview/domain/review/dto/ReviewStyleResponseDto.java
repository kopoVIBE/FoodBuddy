package com.vibe.yoriview.domain.review.dto;

import com.vibe.yoriview.domain.review.ReviewStyle;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewStyleResponseDto {
    private String styleId;
    private String styleName;
    private String description;

    public static ReviewStyleResponseDto from(ReviewStyle entity) {
        return ReviewStyleResponseDto.builder()
                .styleId(entity.getStyleId())
                .styleName(entity.getStyleName())
                .description(entity.getDescription())
                .build();
    }
}
