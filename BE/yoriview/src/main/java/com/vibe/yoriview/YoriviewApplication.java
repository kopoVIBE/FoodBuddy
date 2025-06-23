package com.vibe.yoriview;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class YoriviewApplication {

    public static void main(String[] args) {
        try {
            // .env 파일이 없어도 에러가 발생하지 않도록 설정
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing() // 이 옵션이 핵심: .env 파일이 없어도 에러가 발생하지 않음
                    .load();

            // 환경 변수가 있으면 사용하고, 없으면 docker-compose의 환경 변수 사용
            if (dotenv != null) {
                System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
                System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
                System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
            }

            System.out.println("✅ 환경 설정 완료");

        } catch (Exception e) {
            System.out.println("⚠️ .env 파일 로딩 실패 (docker 환경 변수를 사용합니다): " + e.getMessage());
        }

        SpringApplication.run(YoriviewApplication.class, args);
    }
}
