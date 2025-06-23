package com.vibe.yoriview.domain.user;

import com.vibe.yoriview.domain.user.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/register")
    public UserResponseDto register(@Valid @RequestBody UserRequestDto dto) {
        return userService.register(dto);
    }

    // 전체 유저 조회 (테스트용)
    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        return userService.findAll();
    }

    @PostMapping("/login")
    public LoginResponseDto login(@Valid @RequestBody LoginRequestDto dto) {
        return userService.login(dto);
    }

    @GetMapping("/me")
    public UserResponseDto getMyInfo() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.getUserInfo(userId);
    }

    @PutMapping("/me")
    public UserResponseDto updateMyInfo(@RequestBody UserRequestDto dto) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.updateUserInfo(userId, dto);
    }

    @PutMapping("/password")
    public String changePassword(@Valid @RequestBody PasswordChangeRequestDto dto) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userService.changePassword(userId, dto);
        return "비밀번호가 변경되었습니다.";
    }


}

