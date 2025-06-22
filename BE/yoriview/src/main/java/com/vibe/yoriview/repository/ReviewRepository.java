package com.vibe.yoriview.repository;

import com.vibe.yoriview.domain.review.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, String> {
}
