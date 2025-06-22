package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.restaurant.Location;
import com.vibe.yoriview.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;

    @Override
    public Location registerLocation(Location location) {
        return locationRepository.save(location);
    }

    @Override
    public Optional<Location> getById(String locationId) {
        return locationRepository.findById(locationId);
    }

    @Override
    public List<Location> getAll() {
        return locationRepository.findAll();
    }
}
