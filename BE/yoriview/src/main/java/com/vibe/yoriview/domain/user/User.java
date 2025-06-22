package com.vibe.yoriview.domain.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "nickname", length = 50)
    private String nickname;

    @Column(name = "default_style_id", length = 10)
    private String defaultStyleId;

    @Column(name = "location_enabled", columnDefinition = "CHAR(1) DEFAULT 'Y'")
    private String locationEnabled = "Y";

    @Column(name = "review_visibility", columnDefinition = "CHAR(1) DEFAULT 'N'")
    private String reviewVisibility = "N";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void assignUUID() {
        if (this.userId == null) {
            this.userId = UUID.randomUUID().toString();
        }
    }
}
