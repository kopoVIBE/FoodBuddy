package com.vibe.yoriview.domain.user.dto;

import com.vibe.yoriview.domain.user.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private String userId;
    private String email;
    private String nickname;
    private String defaultStyleId;
    private String locationEnabled;
    private String reviewVisibility;
    private LocalDateTime createdAt;

    public static UserResponseDto from(User user) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .defaultStyleId(user.getDefaultStyleId())
                .locationEnabled(user.getLocationEnabled())
                .reviewVisibility(user.getReviewVisibility())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
