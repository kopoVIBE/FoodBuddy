package com.vibe.yoriview.domain.receipt;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "receipt") // 영수증 정보를 저장하는 테이블
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receipt {

    @Id
    @Column(name = "receipt_id", length = 36)
    private String receiptId; // 영수증 고유 식별자(UUID)

    @Column(name = "user_id", length = 36)
    private String userId; // 영수증을 등록한 사용자 ID

    @Column(name = "restaurant_id", length = 36)
    private String restaurantId; // 등록된 음식점의 고유 ID(참조용)

    @Column(name = "restaurant_name", length = 100) // OCR 결과로 추출한 원본 상호명
    private String restaurantName;

    @Column(name = "original_img", columnDefinition = "LONGTEXT")
    private String originalImg;

    @Column(name = "receipt_date")
    private LocalDate receiptDate; // 영수증에 찍힌 날짜 (방문일자)

    @Column(name = "receipt_address", length = 255)
    private String receiptAddress; // 영수증에 찍힌 주소

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt; // 시스템에 영수증이 업로드 된 시각 (자동 생성)

    @PrePersist
    public void assignUUID() {
        // 영수증 저장 전 UUID 자동 생성
        if (this.receiptId == null) {
            this.receiptId = UUID.randomUUID().toString();
        }
    }
}
