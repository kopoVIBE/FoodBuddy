# 🍽️ FoodBuddy - 음식 리뷰 플랫폼

FoodBuddy는 사용자들이 음식점을 리뷰하고 공유할 수 있는 플랫폼입니다.

## 🏗️ 프로젝트 구조

```
FoodBuddy/
├── BE/                    # 백엔드 (Spring Boot)
│   └── yoriview/         # Spring Boot 애플리케이션
├── FE/                   # 프론트엔드 (Next.js)
│   └── food-review-app/  # React/Next.js 애플리케이션
├── Infra/                # 인프라 및 배포 설정
│   ├── docker-compose.yml
│   ├── deploy.sh
│   ├── env-template
│   └── nginx/
└── .github/              # CI/CD 설정
    └── workflows/
        └── deploy.yml
```

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone <repository-url>
cd FoodBuddy
```

### 2. 환경변수 설정

```bash
cp Infra/env-template .env
# .env 파일을 편집하여 실제 값으로 설정
```

### 3. 로컬 개발 환경 실행

```bash
# Docker Compose로 전체 서비스 실행
cd Infra
docker-compose up -d
```

## 🛠️ 기술 스택

### 백엔드

- **Java 17** + **Spring Boot 3.5.3**
- **Spring Security** + **JWT** 인증
- **JPA/Hibernate** + **MySQL 8.0**
- **Docker** 컨테이너화

### 프론트엔드

- **Next.js 14** + **React 18**
- **TypeScript** + **Tailwind CSS**
- **Radix UI** 컴포넌트
- **Docker** 컨테이너화

### 인프라

- **AWS ECR** (컨테이너 레지스트리)
- **EC2** (54.180.109.147)
- **Docker Compose** (오케스트레이션)
- **Nginx** (리버스 프록시)
- **GitHub Actions** (CI/CD)

## 🔧 CI/CD 파이프라인

### GitHub Actions 워크플로우

- **자동 빌드**: 코드 변경 감지 시 자동 빌드
- **병렬 처리**: 백엔드/프론트엔드 동시 빌드
- **조건부 배포**: 브랜치별 환경 배포
- **헬스체크**: 배포 후 자동 상태 확인

### 배포 환경

- **main 브랜치** → 프로덕션 환경
- **infra/\*, feature/\*** → 개발 환경

### 성능 최적화

- 🧹 **디스크 정리**: 25초 목표
- 🏗️ **백엔드 빌드**: 25초 목표
- 🎨 **프론트엔드 빌드**: 80초 목표
- 🚀 **전체 CI/CD**: 2분 이하

## 📋 환경 설정

### GitHub Secrets 설정

다음 환경변수들을 GitHub Secrets에 설정해야 합니다:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
PROD_EC2_HOST=54.180.109.147
DEV_EC2_HOST=54.180.109.147
EC2_USERNAME=ubuntu
EC2_SSH_KEY=your_ssh_private_key
# SLACK_WEBHOOK_URL=your_slack_webhook_url  # (선택사항 - 나중에 추가 예정)
```

### 로컬 환경변수 설정

```bash
# 환경변수 템플릿 복사
cp Infra/env-template .env

# 필수 환경변수 설정
NODE_ENV=development
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_32_chars_minimum
```

## 🚀 배포 가이드

### 자동 배포 (GitHub Actions)

```bash
# main 브랜치에 푸시하면 자동 프로덕션 배포
git push origin main

# feature 브랜치에 푸시하면 개발 환경 배포
git push origin feature/new-feature
```

### 수동 배포

```bash
# EC2 서버에서 배포 스크립트 실행
./Infra/deploy.sh deploy prod latest

# 서비스 상태 확인
./Infra/deploy.sh status prod

# 롤백 (필요한 경우)
./Infra/deploy.sh rollback prod
```

## 🛡️ 보안 설정

### 필수 보안 체크리스트

- ✅ 모든 기본 패스워드 변경
- ✅ JWT_SECRET 32자 이상 설정
- ✅ 데이터베이스 패스워드 강화
- ✅ HTTPS 적용 (프로덕션)
- ✅ 환경변수 파일 .gitignore 포함
- ✅ non-root 사용자로 컨테이너 실행

### 환경별 보안 설정

- **개발 환경**: 기본 보안 설정
- **운영 환경**: 강화된 패스워드 + HTTPS + 방화벽

## 📊 모니터링 및 로그

### 서비스 상태 확인

```bash
# 전체 서비스 상태
./Infra/deploy.sh status prod

# 특정 서비스 로그 확인
./Infra/deploy.sh logs prod backend
./Infra/deploy.sh logs prod frontend
```

### 헬스체크 엔드포인트

- **백엔드**: http://localhost:8080/actuator/health
- **프론트엔드**: http://localhost:3000
- **Nginx**: http://localhost/health

## 🐛 트러블슈팅

### 일반적인 문제들

#### 1. 빌드 실패

```bash
# 로그 확인
./Infra/deploy.sh logs prod backend

# 컨테이너 재시작
docker-compose restart backend
```

#### 2. 데이터베이스 연결 실패

```bash
# MySQL 상태 확인
docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"

# 네트워크 확인
docker network ls
```

#### 3. 프론트엔드 접속 불가

```bash
# Next.js 로그 확인
./Infra/deploy.sh logs prod frontend

# 포트 확인
netstat -tlnp | grep :3000
```

### 성능 최적화 팁

#### 1. 빌드 시간 단축

- Gradle 캐시 활용
- Docker 레이어 캐싱
- 병렬 빌드 활성화

#### 2. 런타임 최적화

- JVM 메모리 튜닝
- 데이터베이스 커넥션 풀 설정
- Nginx 캐싱 활용

## 🤝 기여 가이드

### 개발 워크플로우

1. Feature 브랜치 생성
2. 개발 및 테스트
3. PR 생성 및 리뷰
4. main 브랜치 머지
5. 자동 배포

### 코드 스타일

- **백엔드**: Google Java Style Guide
- **프론트엔드**: Prettier + ESLint

## 📝 API 문서

### 백엔드 API

- **Base URL**: http://localhost:8080
- **인증**: JWT Bearer Token
- **문서**: Swagger UI (개발 중)

### 주요 엔드포인트

- `POST /api/auth/login` - 로그인
- `GET /api/restaurants` - 음식점 목록
- `POST /api/reviews` - 리뷰 작성
- `GET /api/reviews/{id}` - 리뷰 조회

## 🆘 지원

### 문제 발생 시 연락처

- **개발팀**: development@foodbuddy.com
- **인프라팀**: infra@foodbuddy.com
- **Issue 트래커**: GitHub Issues

### 유용한 링크

- [프로젝트 위키](https://github.com/your-org/foodbuddy/wiki)
- [API 문서](https://api.foodbuddy.com/docs)
- [배포 가이드](https://github.com/your-org/foodbuddy/wiki/deployment)

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

---

_🍽️ FoodBuddy Team에서 개발 및 유지보수하고 있습니다._
