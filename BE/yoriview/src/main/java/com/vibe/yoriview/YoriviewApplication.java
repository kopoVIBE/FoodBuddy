package com.vibe.yoriview;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class YoriviewApplication {

    public static void main(String[] args) {
        // .env 로딩
        Dotenv dotenv = Dotenv.configure()
                .load();  // 따로 directory() 지정 필요 없음

        // 환경 변수 시스템 프로퍼티로 등록
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));

        // 확인용 로그
        System.out.println("✅ .env 로딩 완료");
        System.out.println("➡ DB_USERNAME = " + System.getProperty("DB_USERNAME"));

        SpringApplication.run(YoriviewApplication.class, args);
    }
}
