package com.vibe.yoriview.domain.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "USER") // MySQL에서 예약어이지만 큰 문제는 없음 (주의: 대소문자 구분하는 OS에서는 조심)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(name = "user_id", length = 36)
    private String userId;  // UUID

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(length = 50)
    private String nickname;

    @Column(name = "default_style_id", length = 10)
    private String defaultStyleId;

    @Column(name = "location_enabled", length = 1)
    private String locationEnabled = "Y";  // 'Y' or 'N'

    @Column(name = "review_visibility", length = 1)
    private String reviewVisibility = "N"; // 'Y' or 'N'

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
