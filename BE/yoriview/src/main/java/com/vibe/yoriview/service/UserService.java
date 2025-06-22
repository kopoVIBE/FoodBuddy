package com.vibe.yoriview.service;

import com.vibe.yoriview.domain.user.User;

import java.util.Optional;

public interface UserService {
    User registerUser(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findById(String userId);
}
