package com.vibe.yoriview.domain.user;

import com.vibe.yoriview.domain.user.dto.*;
import com.vibe.yoriview.global.config.JwtTokenProvider;
import com.vibe.yoriview.global.exception.EmailAlreadyExistsException;
import com.vibe.yoriview.global.exception.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserResponseDto register(UserRequestDto dto) {
        // 이메일 중복 확인
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("이미 사용 중인 이메일입니다.");
        }

        // 비밀번호 해시 처리
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        User user = User.builder()
                .email(dto.getEmail())
                .passwordHash(encodedPassword)
                .nickname(dto.getNickname())
                .defaultStyleId(dto.getDefaultStyleId())
                .build();

        userRepository.save(user);
        return UserResponseDto.from(user);
    }

    public List<UserResponseDto> findAll() {
        return userRepository.findAll().stream()
                .map(UserResponseDto::from)
                .toList();
    }

    public LoginResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("이메일 또는 비밀번호가 일치하지 않습니다."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }

        String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail());

        return LoginResponseDto.builder()
                .token(token)
                .nickname(user.getNickname())
                .build();
    }

    public UserResponseDto getUserInfo(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return UserResponseDto.from(user);
    }

    public UserResponseDto updateUserInfo(String userId, UserRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 수정 가능한 항목만 갱신
        user.setNickname(dto.getNickname());
        user.setDefaultStyleId(dto.getDefaultStyleId());

        userRepository.save(user);

        return UserResponseDto.from(user);
    }

    public void changePassword(String userId, PasswordChangeRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("기존 비밀번호가 일치하지 않습니다.");
        }

        String newHashed = passwordEncoder.encode(dto.getNewPassword());
        user.setPasswordHash(newHashed);
        userRepository.save(user);
    }



}
