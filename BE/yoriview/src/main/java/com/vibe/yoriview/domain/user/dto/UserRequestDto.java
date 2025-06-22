package com.vibe.yoriview.domain.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDto {
    private String email;
    private String passwordHash;
    private String nickname;
    private String defaultStyleId;
}
