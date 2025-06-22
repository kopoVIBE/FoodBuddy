package com.vibe.yoriview.domain.review;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "REVIEW_STYLE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewStyle {

    @Id
    @Column(name = "style_id", length = 10)
    private String styleId;  // 예: FRIENDLY, EXPERT

    @Column(name = "style_name", nullable = false, length = 50)
    private String styleName;

    @Column(columnDefinition = "TEXT")
    private String description;
}
