package com.vibe.yoriview.domain.visit;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitLogService {

    private final VisitLogRepository visitLogRepository;

    public void recordVisit(String userId, String restaurantId) {
        VisitLog visit = VisitLog.builder()
                .userId(userId)
                .restaurantId(restaurantId)
                .build();
        visitLogRepository.save(visit);
    }

    public List<VisitLog> getMyVisits(String userId) {
        return visitLogRepository.findByUserId(userId);
    }

    public long countMyVisitsToRestaurant(String userId, String restaurantId) {
        return visitLogRepository.countByUserIdAndRestaurantId(userId, restaurantId);
    }
}
