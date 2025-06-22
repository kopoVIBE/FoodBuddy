package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.review.ReviewStyle;
import com.vibe.yoriview.repository.ReviewStyleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewStyleServiceImpl implements ReviewStyleService {

    private final ReviewStyleRepository reviewStyleRepository;

    @Override
    public Optional<ReviewStyle> getStyleById(String styleId) {
        return reviewStyleRepository.findById(styleId);
    }

    @Override
    public List<ReviewStyle> getAllStyles() {
        return reviewStyleRepository.findAll();
    }
}
