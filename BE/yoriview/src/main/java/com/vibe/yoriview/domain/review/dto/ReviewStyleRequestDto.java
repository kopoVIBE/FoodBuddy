package com.vibe.yoriview.domain.review.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewStyleRequestDto {
    private String styleId;
    private String styleName;
    private String description;
}
