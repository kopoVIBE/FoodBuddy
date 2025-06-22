package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.review.ReviewStyle;

import java.util.List;
import java.util.Optional;

public interface ReviewStyleService {
    Optional<ReviewStyle> getStyleById(String styleId);
    List<ReviewStyle> getAllStyles();
}
