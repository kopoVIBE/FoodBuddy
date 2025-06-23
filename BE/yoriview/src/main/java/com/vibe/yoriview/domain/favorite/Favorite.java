package com.vibe.yoriview.domain.favorite;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "favorite", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "restaurantId"}) // 같은 사용자가 같은 음식점을 중복으로 즐겨찾기하지 못하도록 제약 설정
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @Column(length = 36)
    private String favoriteId; // 즐겨찾기 고유 ID (UUID)

    @Column(length = 36, nullable = false)
    private String userId; // 사용자 ID

    @Column(length = 36, nullable = false)
    private String restaurantId; // 음식점 ID

    @CreationTimestamp
    private LocalDateTime createdAt; // 즐겨찾기 등록 시각 자동 저장

    @PrePersist
    public void assignUUID() {
        // favoriteId가 비어 있으면 UUID 자동 생성
        if (this.favoriteId == null) {
            this.favoriteId = UUID.randomUUID().toString();
        }
    }
}
