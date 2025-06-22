package com.vibe.yoriview.dto.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSignupRequest {
    private String userId;
    private String email;
    private String password;         // 클라이언트에서 평문 전송
    private String nickname;
    private String defaultStyleId;
    private String locationEnabled;  // 'Y' 또는 'N'
    private String reviewVisibility; // 'Y' 또는 'N'
}
