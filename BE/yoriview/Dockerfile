FROM gradle:8.5-jdk17 as builder

WORKDIR /app
COPY . .
RUN gradle build -x test

FROM openjdk:17-slim

# Python 설치
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# OCR 디렉토리 생성 및 파일 복사 (경로 수정)
RUN mkdir -p /app/ocr/input /app/ocr/output
COPY --from=builder /app/BE/yoriview/ocr/ocr-parser.py /app/ocr/
COPY --from=builder /app/BE/yoriview/ocr/.env /app/ocr/

# Python 패키지 설치
RUN pip3 install python-dotenv requests google-generativeai

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"] 