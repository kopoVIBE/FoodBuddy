package com.vibe.yoriview.domain.visit;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "visit_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitLog {

    @Id
    @Column(length = 36)
    private String visitId;

    @Column(length = 36, nullable = false)
    private String userId;

    @Column(length = 36, nullable = false)
    private String restaurantId;

    @CreationTimestamp
    private LocalDateTime visitedAt;

    @PrePersist
    public void assignUUID() {
        if (this.visitId == null) {
            this.visitId = UUID.randomUUID().toString();
        }
    }
}
