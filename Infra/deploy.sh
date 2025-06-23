#!/bin/bash
# 🚀 FoodBuddy 배포 스크립트
# 환경별 배포, 롤백 기능, 헬스체크 포함

set -e  # 에러 발생 시 스크립트 중단

# 🎨 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 📋 설정 변수
PROJECT_NAME="foodbuddy"
ECR_REGISTRY="268556604739.dkr.ecr.ap-northeast-2.amazonaws.com"
AWS_REGION="ap-northeast-2"

# 🔧 기본 함수들
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 📖 사용법 출력
show_usage() {
    echo "🚀 FoodBuddy 배포 스크립트"
    echo ""
    echo "사용법: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "명령어:"
    echo "  deploy [ENV] [TAG]    - 애플리케이션 배포"
    echo "  rollback [ENV]        - 이전 버전으로 롤백"
    echo "  status [ENV]          - 서비스 상태 확인"
    echo "  logs [ENV] [SERVICE]  - 로그 조회"
    echo "  cleanup [ENV]         - 사용하지 않는 이미지 정리"
    echo ""
    echo "환경 (ENV):"
    echo "  prod     - 프로덕션 환경"
    echo "  dev      - 개발 환경"
    echo ""
    echo "예시:"
    echo "  $0 deploy prod latest"
    echo "  $0 rollback prod"
    echo "  $0 status dev"
    echo "  $0 logs prod backend"
}

# 🔍 환경 검증
validate_environment() {
    local env=$1
    if [[ ! "$env" =~ ^(prod|dev)$ ]]; then
        log_error "지원하지 않는 환경입니다: $env"
        log_info "지원되는 환경: prod, dev"
        exit 1
    fi
}

# 📁 배포 디렉토리 설정
setup_deploy_directory() {
    local env=$1
    DEPLOY_DIR="/home/ubuntu/${PROJECT_NAME}-${env}"
    
    log_info "배포 디렉토리 설정: $DEPLOY_DIR"
    mkdir -p "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
}

# 🔑 AWS ECR 로그인
ecr_login() {
    log_info "AWS ECR에 로그인 중..."
    aws ecr get-login-password --region $AWS_REGION | \
        docker login --username AWS --password-stdin $ECR_REGISTRY
    log_success "ECR 로그인 완료"
}

# 📝 환경변수 파일 생성
create_env_file() {
    local env=$1
    local env_file=".env"
    
    log_info "환경변수 파일 생성 중..."
    
    # 환경별 설정
    if [[ "$env" == "prod" ]]; then
        NODE_ENV="production"
        MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-foodbuddy_prod_root_2024!}"
        MYSQL_PASSWORD="${MYSQL_PASSWORD:-foodbuddy_prod_user_2024!}"
        JWT_SECRET="${JWT_SECRET:-foodbuddy-super-secret-jwt-production-key-2024}"
    else
        NODE_ENV="development"
        MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-foodbuddy_dev_root_2024}"
        MYSQL_PASSWORD="${MYSQL_PASSWORD:-foodbuddy_dev_user_2024}"
        JWT_SECRET="${JWT_SECRET:-foodbuddy-dev-jwt-key-2024}"
    fi
    
    cat > "$env_file" << EOF
# 🌍 FoodBuddy 환경 설정 ($env)
NODE_ENV=$NODE_ENV

# 🗄️ 데이터베이스 설정
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_DATABASE=foodbuddy_db
MYSQL_USER=foodbuddy_user
MYSQL_PASSWORD=$MYSQL_PASSWORD

# 🔗 서비스 URL
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000

# 🐳 Docker 이미지 설정
ECR_REGISTRY=$ECR_REGISTRY
PROJECT_NAME=$PROJECT_NAME
IMAGE_TAG=${IMAGE_TAG:-latest}

# 🔐 보안 설정
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=86400000

# 📊 모니터링 설정
NEXT_TELEMETRY_DISABLED=1
EOF
    
    log_success "환경변수 파일 생성 완료"
}

# 🐳 Docker Compose 파일 다운로드
download_compose_file() {
    log_info "Docker Compose 파일 다운로드 중..."
    
    # GitHub에서 최신 compose 파일 다운로드
    curl -sSL -o docker-compose.yml \
        "https://raw.githubusercontent.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/main/Infra/docker-compose.yml" || {
        log_warn "GitHub에서 다운로드 실패, 로컬 파일 사용"
        if [[ -f "../docker-compose.yml" ]]; then
            cp ../docker-compose.yml .
        else
            log_error "Docker Compose 파일을 찾을 수 없습니다"
            exit 1
        fi
    }
    
    log_success "Docker Compose 파일 준비 완료"
}

# 🚀 애플리케이션 배포
deploy_application() {
    local env=$1
    local tag=${2:-latest}
    
    log_info "🚀 $env 환경에 $tag 버전 배포 시작"
    
    validate_environment "$env"
    setup_deploy_directory "$env"
    ecr_login
    
    # 이미지 태그 설정
    export IMAGE_TAG="$tag"
    
    create_env_file "$env"
    download_compose_file
    
    # 배포 이전 백업
    backup_current_version "$env"
    
    log_info "서비스 중지 및 새 이미지 배포 중..."
    docker-compose down --remove-orphans
    docker-compose pull
    docker-compose up -d
    
    # 헬스체크
    perform_health_check "$env"
    
    log_success "🎉 $env 환경 배포 완료!"
}

# 💾 현재 버전 백업
backup_current_version() {
    local env=$1
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    
    log_info "현재 버전 백업 중..."
    mkdir -p "$backup_dir"
    
    # 현재 실행 중인 컨테이너 정보 저장
    docker-compose ps > "$backup_dir/containers.txt" 2>/dev/null || true
    
    # 환경변수 파일 백업
    [[ -f ".env" ]] && cp .env "$backup_dir/.env.backup"
    
    log_success "백업 완료: $backup_dir"
}

# 🔄 롤백 수행
rollback_application() {
    local env=$1
    
    log_info "🔄 $env 환경 롤백 시작"
    
    validate_environment "$env"
    setup_deploy_directory "$env"
    
    # 최신 백업 찾기
    local backup_dir=$(ls -1t backups/ 2>/dev/null | head -n1)
    
    if [[ -z "$backup_dir" ]]; then
        log_error "백업을 찾을 수 없습니다"
        exit 1
    fi
    
    log_info "백업 버전으로 롤백: $backup_dir"
    
    # 백업된 환경변수 복원
    if [[ -f "backups/$backup_dir/.env.backup" ]]; then
        cp "backups/$backup_dir/.env.backup" .env
        log_success "환경변수 복원 완료"
    fi
    
    # 서비스 재시작
    docker-compose down
    docker-compose up -d
    
    perform_health_check "$env"
    
    log_success "🎉 $env 환경 롤백 완료!"
}

# 🏥 헬스체크 수행
perform_health_check() {
    local env=$1
    local max_attempts=30
    local attempt=1
    
    log_info "헬스체크 시작..."
    
    # 서비스 시작 대기
    sleep 10
    
    # 백엔드 헬스체크
    log_info "백엔드 서비스 확인 중..."
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
            log_success "✅ 백엔드 서비스 정상"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "❌ 백엔드 헬스체크 실패"
            show_service_logs "backend"
            exit 1
        fi
        
        log_warn "백엔드 대기 중... ($attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    # 프론트엔드 헬스체크
    attempt=1
    log_info "프론트엔드 서비스 확인 중..."
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
            log_success "✅ 프론트엔드 서비스 정상"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "❌ 프론트엔드 헬스체크 실패"
            show_service_logs "frontend"
            exit 1
        fi
        
        log_warn "프론트엔드 대기 중... ($attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    log_success "🎉 모든 서비스 정상 구동!"
}

# 📊 서비스 상태 확인
check_service_status() {
    local env=$1
    
    validate_environment "$env"
    setup_deploy_directory "$env"
    
    log_info "📊 $env 환경 서비스 상태"
    echo ""
    
    docker-compose ps
    echo ""
    
    # 개별 서비스 상태
    services=("mysql" "backend" "frontend")
    for service in "${services[@]}"; do
        if docker-compose ps | grep -q "$service.*Up"; then
            log_success "$service: 정상 실행 중"
        else
            log_error "$service: 중지됨 또는 오류"
        fi
    done
}

# 📋 서비스 로그 조회
show_service_logs() {
    local env=$1
    local service=${2:-""}
    
    validate_environment "$env"
    setup_deploy_directory "$env"
    
    if [[ -n "$service" ]]; then
        log_info "📋 $service 서비스 로그 (최근 50줄)"
        docker-compose logs --tail=50 -f "$service"
    else
        log_info "📋 전체 서비스 로그 (최근 50줄)"
        docker-compose logs --tail=50 -f
    fi
}

# 🧹 이미지 정리
cleanup_images() {
    local env=$1
    
    validate_environment "$env"
    
    log_info "🧹 사용하지 않는 Docker 이미지 정리 중..."
    
    # 사용하지 않는 이미지 삭제
    docker image prune -f
    
    # 30일 이상 된 백업 삭제
    find backups/ -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true
    
    log_success "정리 완료"
}

# 🚀 메인 실행 로직
main() {
    case "${1:-}" in
        "deploy")
            deploy_application "${2:-}" "${3:-latest}"
            ;;
        "rollback")
            rollback_application "${2:-}"
            ;;
        "status")
            check_service_status "${2:-}"
            ;;
        "logs")
            show_service_logs "${2:-}" "${3:-}"
            ;;
        "cleanup")
            cleanup_images "${2:-}"
            ;;
        "help"|"-h"|"--help"|"")
            show_usage
            ;;
        *)
            log_error "알 수 없는 명령어: $1"
            show_usage
            exit 1
            ;;
    esac
}

# 스크립트 실행
main "$@" 