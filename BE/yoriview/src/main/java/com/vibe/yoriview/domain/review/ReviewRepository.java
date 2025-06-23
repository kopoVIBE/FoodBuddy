package com.vibe.yoriview.domain.review;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByUserId(String userId);
    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Review> findByUserIdOrderByCreatedAtAsc(String userId);
}

