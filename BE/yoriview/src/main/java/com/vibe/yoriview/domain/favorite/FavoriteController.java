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

    // [POST] 특정 음식점을 즐겨찾기에 추가
    @PostMapping("/{restaurantId}")
    public void add(@PathVariable String restaurantId) {
        // 현재 로그인한 사용자의 ID 가져오기
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        favoriteService.addFavorite(userId, restaurantId);
    }

    // [DELETE] 즐겨찾기에서 특정 음식점 제거
    @DeleteMapping("/{restaurantId}")
    public void remove(@PathVariable String restaurantId) {
        // 현재 로그인한 사용자 ID
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        favoriteService.removeFavorite(userId, restaurantId);
    }

    // [GET] 현재 로그인한 사용자의 즐겨찾기 목록 조회
    @GetMapping("/me")
    public List<Favorite> myFavorites() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return favoriteService.getMyFavorites(userId);
    }

    // [GET] 현재 사용자가 특정 음식점을 즐겨찾기 했는지 여부 확인
    @GetMapping("/me/{restaurantId}")
    public boolean isMyFavorite(@PathVariable String restaurantId) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return favoriteService.isFavorited(userId, restaurantId);
    }
}

