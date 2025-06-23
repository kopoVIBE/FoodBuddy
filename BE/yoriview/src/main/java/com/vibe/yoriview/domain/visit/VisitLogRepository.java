package com.vibe.yoriview.domain.visit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitLogRepository extends JpaRepository<VisitLog, String> {
    List<VisitLog> findByUserId(String userId);
    long countByUserIdAndRestaurantId(String userId, String restaurantId);
}
