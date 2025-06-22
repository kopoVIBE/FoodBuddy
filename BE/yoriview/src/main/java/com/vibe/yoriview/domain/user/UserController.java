package com.vibe.yoriview.domain.user;

import com.vibe.yoriview.domain.user.dto.LoginRequestDto;
import com.vibe.yoriview.domain.user.dto.LoginResponseDto;
import com.vibe.yoriview.domain.user.dto.UserRequestDto;
import com.vibe.yoriview.domain.user.dto.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/register")
    public UserResponseDto register(@RequestBody UserRequestDto dto) {
        return userService.register(dto);
    }

    // 전체 유저 조회 (테스트용)
    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        return userService.findAll();
    }

    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody LoginRequestDto dto) {
        return userService.login(dto);
    }

}
