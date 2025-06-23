# FoodBuddy 로컬 개발 환경 가이드

EC2에 운영 환경이 배포되어 있고, 로컬에서 개발하기 위한 환경 설정 가이드입니다.

## 🚀 빠른 시작

### 1. 환경변수 설정

```bash
# 환경변수 파일 복사
cp env.dev.example .env.dev

# 필요하다면 .env.dev 파일을 수정하세요
```

### 2. 개발 환경 시작

```bash
# 모든 서비스 시작
./dev-setup.sh up

# 또는 단계별로
./dev-setup.sh build  # 이미지 빌드
./dev-setup.sh up     # 서비스 시작
```

### 3. 접속 정보

- **프론트엔드**: http://localhost:3001
- **백엔드 API**: http://localhost:8081
- **MySQL**: localhost:3307

## 📋 개발 환경 구성

### 포트 매핑

```
서비스        로컬 포트    컨테이너 포트   운영 포트
Frontend      3001        3000           80
Backend       8081        8080           8080
MySQL         3307        3306           3306
```

### 서비스 관리 명령어

```bash
# 서비스 시작
./dev-setup.sh up

# 서비스 중지
./dev-setup.sh down

# 서비스 재시작
./dev-setup.sh restart

# 서비스 상태 확인
./dev-setup.sh status

# 로그 확인
./dev-setup.sh logs           # 모든 서비스
./dev-setup.sh logs backend   # 백엔드만
./dev-setup.sh logs frontend  # 프론트엔드만
./dev-setup.sh logs mysql     # MySQL만

# 테스트 실행
./dev-setup.sh test

# 개발 환경 완전 정리
./dev-setup.sh clean
```

## 🛠 개발 워크플로우

### 백엔드 개발

```bash
# 백엔드 로그 실시간 확인
./dev-setup.sh logs backend

# 백엔드만 재시작 (코드 변경 후)
docker-compose -f docker-compose.dev.yml restart backend-dev

# 백엔드 테스트
./dev-setup.sh test
```

### 프론트엔드 개발

```bash
# 프론트엔드 로그 실시간 확인
./dev-setup.sh logs frontend

# 프론트엔드만 재시작 (코드 변경 후)
docker-compose -f docker-compose.dev.yml restart frontend-dev
```

### 데이터베이스 관리

```bash
# MySQL 접속
docker exec -it foodbuddy-mysql-dev mysql -u dev_user -p yoriview_dev

# MySQL 로그 확인
./dev-setup.sh logs mysql

# 데이터베이스 초기화
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d mysql-dev
```

## 🔧 트러블슈팅

### 포트 충돌 해결

만약 로컬에서 이미 사용 중인 포트가 있다면:

1. `docker-compose.dev.yml` 에서 포트 수정
2. `.env.dev` 에서 관련 환경변수 수정

### 컨테이너 빌드 오류

```bash
# Docker 캐시 완전 정리
./dev-setup.sh clean

# 이미지 다시 빌드
./dev-setup.sh build

# 시스템 정리
docker system prune -a
```

### 데이터베이스 연결 오류

```bash
# MySQL 상태 확인
./dev-setup.sh status

# MySQL 로그 확인
./dev-setup.sh logs mysql

# MySQL 컨테이너 재시작
docker-compose -f docker-compose.dev.yml restart mysql-dev
```

## 📊 로컬 vs 운영 환경 차이점

| 항목            | 로컬 개발              | EC2 운영           |
| --------------- | ---------------------- | ------------------ |
| 도메인          | localhost              | 54.180.109.147     |
| 프론트엔드 포트 | 3001                   | 80                 |
| 백엔드 포트     | 8081                   | 8080               |
| MySQL 포트      | 3307                   | 3306               |
| SSL             | 없음                   | 있음               |
| 환경변수        | .env.dev               | .env               |
| Docker Compose  | docker-compose.dev.yml | docker-compose.yml |

## 🐛 디버깅

### 백엔드 디버깅

Spring Boot의 디버그 포트를 추가하려면 `docker-compose.dev.yml`의 backend-dev 서비스에 추가:

```yaml
ports:
  - "8081:8080"
  - "5005:5005" # 디버그 포트
environment:
  - JAVA_OPTS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005
```

### 프론트엔드 디버깅

브라우저 개발자 도구를 사용하거나, VS Code의 디버거를 설정할 수 있습니다.

## 📝 개발 팁

1. **핫 리로드**: Docker 볼륨 마운트로 코드 변경 시 자동 반영
2. **로그 모니터링**: `./dev-setup.sh logs` 명령어로 실시간 로그 확인
3. **포트 분리**: 로컬 서비스와 충돌하지 않도록 다른 포트 사용
4. **데이터 지속성**: MySQL 데이터는 Docker 볼륨에 저장되어 컨테이너 재시작 시에도 유지

## 🔄 CI/CD와의 연동

로컬에서 개발한 코드는 `infra/setup-cicd-pipeline` 브랜치에 푸시하면 자동으로 개발 환경에 배포됩니다.

```bash
# 개발 완료 후 커밋
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin infra/setup-cicd-pipeline

# GitHub Actions에서 자동 빌드 및 배포 진행
```

## 📞 문제 발생 시

1. 먼저 `./dev-setup.sh status`로 서비스 상태 확인
2. `./dev-setup.sh logs` 로 로그 확인
3. 문제가 지속되면 `./dev-setup.sh clean && ./dev-setup.sh up`으로 완전 재설치
