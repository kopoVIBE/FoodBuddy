package com.vibe.yoriview.dto.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String userId;
    private String email;
    private String nickname;
    private String defaultStyleId;
    private String reviewVisibility;
}
