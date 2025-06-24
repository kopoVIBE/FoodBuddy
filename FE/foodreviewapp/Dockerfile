FROM node:18-alpine AS builder

WORKDIR /app

# 📦 빌드 아규먼트 정의 (GitHub Actions에서 전달됨)
ARG NEXT_PUBLIC_LOCAL_BACK_URL
ARG NEXT_PUBLIC_KAKAO_JAVA_SCRIPT_KEY
ARG NEXT_PUBLIC_OPENAI_API_KEY

# 🔧 환경변수로 설정 (빌드 시점에 번들에 포함됨)
ENV NEXT_PUBLIC_LOCAL_BACK_URL=${NEXT_PUBLIC_LOCAL_BACK_URL}
ENV NEXT_PUBLIC_KAKAO_JAVA_SCRIPT_KEY=${NEXT_PUBLIC_KAKAO_JAVA_SCRIPT_KEY}
ENV NEXT_PUBLIC_OPENAI_API_KEY=${NEXT_PUBLIC_OPENAI_API_KEY}

# 🐛 디버깅용 로그 (빌드 시점에서 환경변수 확인)
RUN echo "🔍 빌드 시점 환경변수 확인:" && \
    echo "NEXT_PUBLIC_LOCAL_BACK_URL: $NEXT_PUBLIC_LOCAL_BACK_URL" && \
    echo "NEXT_PUBLIC_KAKAO_JAVA_SCRIPT_KEY 길이: $(echo $NEXT_PUBLIC_KAKAO_JAVA_SCRIPT_KEY | wc -c)"

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"] 