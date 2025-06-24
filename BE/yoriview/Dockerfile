FROM gradle:8.5-jdk17 as builder

WORKDIR /app
COPY . .
RUN gradle build -x test

FROM openjdk:17-slim

# Python과 pip 설치 (OCR 스크립트 실행을 위해)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# OCR 관련 파일들 복사
COPY --from=builder /app/ocr ./ocr

# 환경변수 파일 복사 (있는 경우)
COPY --from=builder /app/.env ./.env 2>/dev/null || true

# OCR Python 스크립트 실행 권한 부여
RUN chmod +x ./ocr/ocr-parser.py 2>/dev/null || true

# 작업 디렉토리 생성
RUN mkdir -p ./ocr/input ./ocr/output

# Python 의존성 사전 설치 (OCR 스크립트가 자동 설치하지만 미리 설치하여 속도 향상)
RUN pip3 install python-dotenv requests google-generativeai 2>/dev/null || true

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"] 