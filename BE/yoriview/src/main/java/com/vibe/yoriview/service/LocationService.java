package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.restaurant.Location;

import java.util.List;
import java.util.Optional;

public interface LocationService {
    Location registerLocation(Location location);
    Optional<Location> getById(String locationId);
    List<Location> getAll();
}
