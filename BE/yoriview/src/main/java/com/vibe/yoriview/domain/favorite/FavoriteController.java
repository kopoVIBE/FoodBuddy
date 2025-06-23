package com.vibe.yoriview.domain.favorite;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{restaurantId}")
    public void add(@PathVariable String restaurantId) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        favoriteService.addFavorite(userId, restaurantId);
    }

    @DeleteMapping("/{restaurantId}")
    public void remove(@PathVariable String restaurantId) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        favoriteService.removeFavorite(userId, restaurantId);
    }

    @GetMapping("/me")
    public List<Favorite> myFavorites() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return favoriteService.getMyFavorites(userId);
    }

    @GetMapping("/me/{restaurantId}")
    public boolean isMyFavorite(@PathVariable String restaurantId) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return favoriteService.isFavorited(userId, restaurantId);
    }
}
