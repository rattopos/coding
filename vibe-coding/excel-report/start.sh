#!/bin/bash

# Excel Insights 앱 실행 스크립트
# Backend와 Frontend를 자동으로 실행합니다.

set -e  # 오류 발생 시 스크립트 중단

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📊 Excel Insights 앱을 시작합니다...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 현재 디렉토리 저장
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# 1. Backend 패키지 확인 및 설치
echo -e "${YELLOW}[1/4] Backend 패키지를 확인하는 중...${NC}"
cd "$BACKEND_DIR"

if python3 -c "import flask, flask_cors, pandas, openpyxl" 2>/dev/null; then
    echo -e "${GREEN}✓ 모든 Backend 패키지가 설치되어 있습니다.${NC}"
else
    echo -e "${YELLOW}⚠ Backend 패키지를 설치합니다...${NC}"
    pip install Flask flask-cors pandas openpyxl xlrd numpy
fi
echo ""

# 2. Frontend 패키지 확인 및 설치
echo -e "${YELLOW}[2/4] Frontend 패키지를 확인하는 중...${NC}"
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ] || [ ! -d "node_modules/react-scripts" ]; then
    echo -e "${YELLOW}⚠ Frontend 패키지를 설치합니다...${NC}"
    npm install
else
    echo -e "${GREEN}✓ Frontend 패키지가 설치되어 있습니다.${NC}"
fi
echo ""

# 3. Backend 서버 시작
echo -e "${YELLOW}[3/4] Backend 서버를 시작합니다...${NC}"
cd "$BACKEND_DIR"

# 기존 프로세스 종료
pkill -f "python3.*app.py" 2>/dev/null || true

# Backend 시작 (백그라운드)
nohup python3 app.py > backend.log 2>&1 &
BACKEND_PID=$!

# Backend 서버가 시작될 때까지 대기
echo -e "${BLUE}Backend 서버 시작 대기 중...${NC}"
for i in {1..10}; do
    sleep 1
    if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend 서버가 시작되었습니다! (PID: $BACKEND_PID)${NC}"
        echo -e "${GREEN}  URL: http://localhost:5001${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${RED}✗ Backend 서버 시작에 실패했습니다.${NC}"
        echo -e "${YELLOW}로그를 확인하세요: $BACKEND_DIR/backend.log${NC}"
        exit 1
    fi
done
echo ""

# 4. Frontend 서버 시작
echo -e "${YELLOW}[4/4] Frontend 서버를 시작합니다...${NC}"
cd "$FRONTEND_DIR"

echo -e "${GREEN}✓ Frontend 서버를 시작합니다...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 앱이 실행되었습니다!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}📍 Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}📍 Backend:  http://localhost:5001${NC}"
echo ""
echo -e "${YELLOW}⚠  종료하려면 Ctrl+C를 누르세요${NC}"
echo ""

# Frontend 시작 (포그라운드)
npm start

