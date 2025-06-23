#!/bin/bash
# 🐳 AWS ECR 리포지토리 생성 스크립트

set -e

AWS_REGION="ap-northeast-2"
PROJECT_NAME="foodbuddy"

echo "🚀 AWS ECR 리포지토리 생성 시작..."

# 백엔드 리포지토리 생성
echo "📦 백엔드 리포지토리 생성 중..."
aws ecr create-repository \
    --repository-name "${PROJECT_NAME}-backend" \
    --region ${AWS_REGION} \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256 \
    2>/dev/null || echo "⚠️ 백엔드 리포지토리가 이미 존재합니다."

# 프론트엔드 리포지토리 생성
echo "📦 프론트엔드 리포지토리 생성 중..."
aws ecr create-repository \
    --repository-name "${PROJECT_NAME}-frontend" \
    --region ${AWS_REGION} \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256 \
    2>/dev/null || echo "⚠️ 프론트엔드 리포지토리가 이미 존재합니다."

echo "✅ ECR 리포지토리 생성 완료!"

# 생성된 리포지토리 확인
echo "📋 생성된 리포지토리 목록:"
aws ecr describe-repositories \
    --region ${AWS_REGION} \
    --repository-names "${PROJECT_NAME}-backend" "${PROJECT_NAME}-frontend" \
    --query 'repositories[*].[repositoryName,repositoryUri]' \
    --output table 