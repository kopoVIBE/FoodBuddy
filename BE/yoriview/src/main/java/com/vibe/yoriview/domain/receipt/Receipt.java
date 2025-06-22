package com.vibe.yoriview.domain.receipt;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "receipt")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receipt {

    @Id
    @Column(name = "receipt_id", length = 36)
    private String receiptId;

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "restaurant_id", length = 36)
    private String restaurantId;

    @Column(name = "original_img", length = 255)
    private String originalImg;

    @Column(name = "receipt_date")
    private LocalDate receiptDate;

    @Column(name = "receipt_address", length = 255)
    private String receiptAddress;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    public void assignUUID() {
        if (this.receiptId == null) {
            this.receiptId = UUID.randomUUID().toString();
        }
    }
}
