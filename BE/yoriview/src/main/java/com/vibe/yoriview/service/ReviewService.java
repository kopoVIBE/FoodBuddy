package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.review.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    Review createReview(Review review);
    Optional<Review> getReviewById(String reviewId);
    List<Review> getReviewsByUserId(String userId);
}
