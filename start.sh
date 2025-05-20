#!/usr/bin/env bash
set -e

if [ ! -f .env ]; then
  echo "❌ .env 파일을 찾을 수 없습니다. 프로젝트 루트에서 실행하세요."
  exit 1
fi

if [ ! -f docker-compose.yml ]; then
  echo "❌ docker-compose.yml 파일을 찾을 수 없습니다."
  exit 1
fi

echo "🔧 빌드 및 컨테이너 시작 중..."
if docker compose --env-file .env -p reward-platform -f docker-compose.yml up -d --build; then
  echo "✅ 모든 컨테이너가 성공적으로 시작되었습니다!"
  echo
  echo "📦 현재 컨테이너 상태:"
  docker compose -p reward-platform -f docker-compose.yml ps
else
  echo "❌ 컨테이너 시작에 실패했습니다."
  exit 1
fi
