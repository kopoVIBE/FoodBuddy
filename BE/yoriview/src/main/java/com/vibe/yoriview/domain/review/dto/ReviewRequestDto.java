package com.vibe.yoriview.domain.review.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequestDto {

    @NotBlank(message = "스타일 ID는 필수입니다.")
    private String styleId;

    @NotBlank(message = "영수증 ID는 필수입니다.")
    private String receiptId;

    @NotBlank(message = "식당 ID는 필수입니다.")
    private String restaurantId;

    @NotBlank(message = "위치 ID는 필수입니다.")
    private String locationId;

    @NotBlank(message = "리뷰 내용은 비워둘 수 없습니다.")
    private String content;

    @DecimalMin(value = "0.5", message = "평점은 0.5 이상이어야 합니다.")
    @DecimalMax(value = "5.0", message = "평점은 5.0 이하여야 합니다.")
    private BigDecimal rating;
}
