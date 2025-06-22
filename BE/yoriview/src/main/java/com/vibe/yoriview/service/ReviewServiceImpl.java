package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.review.Review;
import com.vibe.yoriview.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    @Override
    public Optional<Review> getReviewById(String reviewId) {
        return reviewRepository.findById(reviewId);
    }

    @Override
    public List<Review> getReviewsByUserId(String userId) {
        return reviewRepository.findAll().stream()
                .filter(review -> review.getUser().getUserId().equals(userId))
                .toList();
    }
}
