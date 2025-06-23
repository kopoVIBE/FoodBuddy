# 🏗️ FoodBuddy Backend Dockerfile (Spring Boot 최적화)
# 빌드 시간 25초 목표, 테스트 제외, 의존성 캐시 최적화

# ===== Stage 1: Dependencies =====
FROM eclipse-temurin:17-jdk-alpine AS dependencies

WORKDIR /app

# Alpine 패키지 업데이트 및 필수 도구 설치
RUN apk add --no-cache bash

# Gradle Wrapper와 설정 파일만 먼저 복사 (캐시 활용)
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# gradlew 실행 권한 부여
RUN chmod +x ./gradlew

# 의존성만 먼저 다운로드 (캐시 레이어 생성)
RUN ./gradlew dependencies --no-daemon

# ===== Stage 2: Build =====
FROM dependencies AS builder

# 소스 코드 복사
COPY src src

# 최적화된 빌드 실행
# - 테스트 완전 제외 (assemble 사용)
# - 병렬 빌드 활성화
# - 빌드 캐시 활용
# - 데몬 비활성화 (메모리 절약)
RUN ./gradlew clean assemble \
    --parallel \
    --build-cache \
    --no-daemon \
    -x test

# ===== Stage 3: Runtime =====
FROM eclipse-temurin:17-jre-alpine AS runtime

# 🔒 보안: non-root 사용자 생성 (Alpine 방식)
RUN addgroup -g 1001 -S foodbuddy && \
    adduser -u 1001 -S foodbuddy -G foodbuddy

# 📁 애플리케이션 디렉토리 생성
WORKDIR /app

# 🏃‍♂️ 런타임 최적화를 위한 패키지 설치 (Alpine 방식)
RUN apk add --no-cache \
    curl \
    bash

# 📦 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 📁 로그 디렉토리 생성 및 권한 설정
RUN mkdir -p /app/logs && chown -R foodbuddy:foodbuddy /app

# 🔒 non-root 사용자로 전환
USER foodbuddy

# 🌡️ 헬스체크 설정
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# 🚀 애플리케이션 실행
# JVM 최적화 옵션:
# - 메모리 효율성을 위한 G1GC 사용
# - 컨테이너 환경에 맞는 메모리 설정
# - 애플리케이션 시작 시간 단축을 위한 옵션들
EXPOSE 8080

ENTRYPOINT ["java", \
    "-server", \
    "-XX:+UseG1GC", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-XX:+OptimizeStringConcat", \
    "-XX:+UseStringDeduplication", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-Dspring.profiles.active=prod", \
    "-jar", "app.jar"]

# 📝 메타데이터
LABEL maintainer="FoodBuddy Team"
LABEL description="FoodBuddy Backend API Server (Spring Boot)"
LABEL version="1.0.0" 