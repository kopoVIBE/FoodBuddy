#!/bin/bash

# FoodBuddy 로컬 개발 환경 설정 스크립트

set -e

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 도움말 표시
show_help() {
    echo "FoodBuddy 로컬 개발 환경 관리 스크립트"
    echo ""
    echo "사용법: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build     - Docker 이미지 빌드"
    echo "  up        - 개발 환경 시작"
    echo "  down      - 개발 환경 중지"
    echo "  restart   - 개발 환경 재시작"
    echo "  logs      - 로그 확인"
    echo "  clean     - 모든 컨테이너, 이미지, 볼륨 삭제"
    echo "  status    - 서비스 상태 확인"
    echo "  test      - 백엔드 테스트 실행"
    echo "  help      - 이 도움말 표시"
    echo ""
    echo "예시:"
    echo "  $0 up           # 개발 환경 시작"
    echo "  $0 logs backend # 백엔드 로그만 확인"
    echo "  $0 test         # 테스트 실행"
}

# Docker와 Docker Compose 설치 확인
check_requirements() {
    log_info "필수 요구사항 확인 중..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker가 설치되지 않았습니다. Docker를 먼저 설치해주세요."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose가 설치되지 않았습니다. Docker Compose를 먼저 설치해주세요."
        exit 1
    fi
    
    log_success "필수 요구사항 확인 완료"
}

# Docker 이미지 빌드
build_images() {
    log_info "Docker 이미지 빌드 중..."
    docker-compose -f docker-compose.dev.yml build --no-cache
    log_success "Docker 이미지 빌드 완료"
}

# 개발 환경 시작
start_dev() {
    log_info "개발 환경 시작 중..."
    docker-compose -f docker-compose.dev.yml up -d
    
    log_info "서비스 시작 대기 중..."
    sleep 10
    
    # 헬스체크
    check_services
    
    log_success "개발 환경이 성공적으로 시작되었습니다!"
    echo ""
    echo "접속 정보:"
    echo "  - 프론트엔드: http://localhost:3001"
    echo "  - 백엔드 API: http://localhost:8081"
    echo "  - MySQL: localhost:3307"
}

# 개발 환경 중지
stop_dev() {
    log_info "개발 환경 중지 중..."
    docker-compose -f docker-compose.dev.yml down
    log_success "개발 환경이 중지되었습니다."
}

# 개발 환경 재시작
restart_dev() {
    log_info "개발 환경 재시작 중..."
    docker-compose -f docker-compose.dev.yml restart
    sleep 5
    check_services
    log_success "개발 환경이 재시작되었습니다."
}

# 로그 확인
show_logs() {
    if [ -n "$1" ]; then
        case $1 in
            backend|be)
                docker-compose -f docker-compose.dev.yml logs -f backend-dev
                ;;
            frontend|fe)
                docker-compose -f docker-compose.dev.yml logs -f frontend-dev
                ;;
            mysql|db)
                docker-compose -f docker-compose.dev.yml logs -f mysql-dev
                ;;
            *)
                log_error "알 수 없는 서비스: $1"
                echo "사용 가능한 서비스: backend, frontend, mysql"
                exit 1
                ;;
        esac
    else
        docker-compose -f docker-compose.dev.yml logs -f
    fi
}

# 모든 것 정리
clean_all() {
    log_warning "모든 개발 환경 데이터가 삭제됩니다. 계속하시겠습니까? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log_info "개발 환경 정리 중..."
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        log_success "개발 환경이 정리되었습니다."
    else
        log_info "취소되었습니다."
    fi
}

# 서비스 상태 확인
check_services() {
    log_info "서비스 상태 확인 중..."
    
    # MySQL 확인
    if docker-compose -f docker-compose.dev.yml ps mysql-dev | grep -q "Up"; then
        log_success "MySQL: 실행 중"
    else
        log_error "MySQL: 중지됨"
    fi
    
    # 백엔드 확인
    if docker-compose -f docker-compose.dev.yml ps backend-dev | grep -q "Up"; then
        if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
            log_success "백엔드: 실행 중 (헬스체크 통과)"
        else
            log_warning "백엔드: 실행 중 (헬스체크 실패)"
        fi
    else
        log_error "백엔드: 중지됨"
    fi
    
    # 프론트엔드 확인
    if docker-compose -f docker-compose.dev.yml ps frontend-dev | grep -q "Up"; then
        if curl -s http://localhost:3001 > /dev/null 2>&1; then
            log_success "프론트엔드: 실행 중 (접근 가능)"
        else
            log_warning "프론트엔드: 실행 중 (접근 불가)"
        fi
    else
        log_error "프론트엔드: 중지됨"
    fi
}

# 백엔드 테스트 실행
run_tests() {
    log_info "백엔드 테스트 실행 중..."
    
    # 테스트용 컨테이너 실행
    docker run --rm \
        -v "$(pwd)/BE/yoriview:/app" \
        -w /app \
        eclipse-temurin:17-alpine \
        sh -c "chmod +x ./gradlew && ./gradlew test"
    
    log_success "테스트 완료"
}

# 메인 로직
main() {
    case "${1:-help}" in
        build)
            check_requirements
            build_images
            ;;
        up|start)
            check_requirements
            start_dev
            ;;
        down|stop)
            stop_dev
            ;;
        restart)
            restart_dev
            ;;
        logs)
            show_logs "$2"
            ;;
        clean)
            clean_all
            ;;
        status)
            check_services
            ;;
        test)
            run_tests
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "알 수 없는 명령어: $1"
            show_help
            exit 1
            ;;
    esac
}

# 스크립트 실행
main "$@" 