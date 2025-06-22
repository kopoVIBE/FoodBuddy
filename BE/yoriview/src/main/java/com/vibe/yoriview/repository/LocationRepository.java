package com.vibe.yoriview.repository;

import com.vibe.yoriview.domain.restaurant.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, String> {
}
