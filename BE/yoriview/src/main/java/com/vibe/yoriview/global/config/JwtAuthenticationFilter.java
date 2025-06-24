package com.vibe.yoriview.global.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. 요청 헤더에서 Authorization 토큰 추출
        String authHeader = request.getHeader("Authorization");
        
        log.info("=== JWT Filter 처리 시작 ===");
        log.info("요청 URI: {}", request.getRequestURI());
        log.info("Authorization 헤더: {}", authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // "Bearer " 이후
            log.info("추출된 토큰 (앞 20자): {}...", token.length() > 20 ? token.substring(0, 20) : token);

            try {
                // 2. 토큰에서 userId(subject) 추출
                String userId = jwtTokenProvider.getUserIdFromToken(token);
                log.info("토큰에서 추출된 userId: {}", userId);

                // 3. SecurityContext에 인증 객체 설정
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userId, null, null);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                log.info("인증 성공! SecurityContext에 userId 설정됨: {}", userId);

            } catch (Exception e) {
                // 유효하지 않은 토큰이면 무시하고 통과 (필요시 로그 가능)
                log.error("토큰 검증 실패: {}", e.getMessage());
                SecurityContextHolder.clearContext();
            }
        } else {
            log.warn("Authorization 헤더가 없거나 Bearer 형식이 아님");
        }
        
        log.info("=== JWT Filter 처리 완료 ===");

        filterChain.doFilter(request, response);
    }
}
