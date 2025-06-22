package com.vibe.yoriview.domain.receipt;

import com.vibe.yoriview.domain.restaurant.Restaurant;
import com.vibe.yoriview.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "RECEIPT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receipt {

    @Id
    @Column(name = "receipt_id", length = 36)
    private String receiptId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    @Column(name = "original_img", length = 255)
    private String originalImg;

    @Column(name = "receipt_date")
    private LocalDate receiptDate;

    @Column(name = "receipt_address", length = 255)
    private String receiptAddress;

    @Column(name = "uploaded_at")
    private LocalDate uploadedAt = LocalDate.now();
}
