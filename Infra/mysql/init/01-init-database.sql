-- 🗄️ FoodBuddy MySQL 초기화 스크립트
-- 데이터베이스, 사용자, 기본 테이블 생성

-- 🌍 문자셋 및 콜레이션 설정
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 🗄️ 데이터베이스 생성 (존재하지 않는 경우)
CREATE DATABASE IF NOT EXISTS foodbuddy_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 📊 데이터베이스 사용
USE foodbuddy_db;

-- 👤 사용자 권한 설정 (이미 docker-compose에서 생성됨)
-- GRANT ALL PRIVILEGES ON foodbuddy_db.* TO 'foodbuddy_user'@'%';
-- FLUSH PRIVILEGES;

-- 🏪 위치 정보 테이블 (이미 JPA Entity로 관리되지만 참고용)
-- CREATE TABLE IF NOT EXISTS locations (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     address VARCHAR(500) NOT NULL COMMENT '주소',
--     latitude DECIMAL(10, 8) COMMENT '위도',
--     longitude DECIMAL(11, 8) COMMENT '경도',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='위치 정보';

-- 🍽️ 음식점 테이블 (JPA Entity로 관리)
-- CREATE TABLE IF NOT EXISTS restaurants (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(200) NOT NULL COMMENT '음식점 이름',
--     phone VARCHAR(20) COMMENT '전화번호',
--     location_id BIGINT COMMENT '위치 ID',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='음식점 정보';

-- 👤 사용자 테이블 (JPA Entity로 관리)
-- CREATE TABLE IF NOT EXISTS users (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     email VARCHAR(255) UNIQUE NOT NULL COMMENT '이메일',
--     password VARCHAR(255) NOT NULL COMMENT '비밀번호 (암호화)',
--     nickname VARCHAR(100) NOT NULL COMMENT '닉네임',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 정보';

-- 📝 리뷰 테이블 (JPA Entity로 관리)
-- CREATE TABLE IF NOT EXISTS reviews (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     user_id BIGINT NOT NULL COMMENT '사용자 ID',
--     restaurant_id BIGINT NOT NULL COMMENT '음식점 ID',
--     content TEXT NOT NULL COMMENT '리뷰 내용',
--     rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5) COMMENT '평점 (1-5)',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--     FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='리뷰 정보';

-- 📋 영수증 테이블 (JPA Entity로 관리)
-- CREATE TABLE IF NOT EXISTS receipts (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     user_id BIGINT NOT NULL COMMENT '사용자 ID',
--     restaurant_id BIGINT NOT NULL COMMENT '음식점 ID',
--     total_amount DECIMAL(10,2) NOT NULL COMMENT '총 금액',
--     purchase_date TIMESTAMP NOT NULL COMMENT '구매 일시',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
--     FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='영수증 정보';

-- 📑 영수증 아이템 테이블 (JPA Entity로 관리)
-- CREATE TABLE IF NOT EXISTS receipt_items (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     receipt_id BIGINT NOT NULL COMMENT '영수증 ID',
--     item_name VARCHAR(200) NOT NULL COMMENT '상품명',
--     quantity INT NOT NULL DEFAULT 1 COMMENT '수량',
--     unit_price DECIMAL(10,2) NOT NULL COMMENT '단가',
--     total_price DECIMAL(10,2) NOT NULL COMMENT '총 가격',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='영수증 상품 정보';

-- 🎨 리뷰 스타일 테이블 (JPA Entity로 관리)
-- CREATE TABLE IF NOT EXISTS review_styles (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     review_id BIGINT NOT NULL COMMENT '리뷰 ID',
--     style_name VARCHAR(100) NOT NULL COMMENT '스타일명',
--     style_value VARCHAR(500) COMMENT '스타일 값',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='리뷰 스타일 정보';

-- 📊 인덱스 추가 (성능 최적화)
-- CREATE INDEX idx_restaurants_name ON restaurants(name);
-- CREATE INDEX idx_reviews_user_id ON reviews(user_id);
-- CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
-- CREATE INDEX idx_reviews_rating ON reviews(rating);
-- CREATE INDEX idx_reviews_created_at ON reviews(created_at);
-- CREATE INDEX idx_receipts_user_id ON receipts(user_id);
-- CREATE INDEX idx_receipts_purchase_date ON receipts(purchase_date);
-- CREATE INDEX idx_receipt_items_receipt_id ON receipt_items(receipt_id);

-- 💡 초기 데이터 삽입 (테스트용 - 선택사항)
-- INSERT INTO locations (address, latitude, longitude) VALUES 
-- ('서울특별시 강남구 역삼동', 37.5012767, 127.0396597),
-- ('서울특별시 마포구 홍대입구', 37.5563135, 126.9236309);

-- INSERT INTO restaurants (name, phone, location_id) VALUES 
-- ('맛있는 한식당', '02-1234-5678', 1),
-- ('홍대 맥주집', '02-8765-4321', 2);

-- 🎉 초기화 완료 메시지
SELECT '🎉 FoodBuddy 데이터베이스 초기화 완료!' as message;
SELECT 'Spring Boot JPA가 자동으로 테이블을 생성합니다.' as note;
SELECT CONCAT('현재 시간: ', NOW()) as timestamp; 