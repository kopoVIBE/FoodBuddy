package com.vibe.yoriview.domain.user;

import com.vibe.yoriview.domain.user.dto.LoginRequestDto;
import com.vibe.yoriview.domain.user.dto.LoginResponseDto;
import com.vibe.yoriview.domain.user.dto.UserRequestDto;
import com.vibe.yoriview.domain.user.dto.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.vibe.yoriview.global.config.JwtTokenProvider;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // 🔐 의존성 주입
    private final JwtTokenProvider jwtTokenProvider;

    public UserResponseDto register(UserRequestDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        // 🔐 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPasswordHash());

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
                .orElseThrow(() -> new RuntimeException("존재하지 않는 이메일입니다."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // ✅ 토큰 발급 (다음 단계에서 구현할 JwtTokenProvider 사용)
        String token = jwtTokenProvider.generateToken(user.getUserId(), user.getEmail());

        return LoginResponseDto.builder()
                .token(token)
                .nickname(user.getNickname())
                .build();
    }

}
