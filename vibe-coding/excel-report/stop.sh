#!/bin/bash

# Excel Insights 앱 종료 스크립트

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📊 Excel Insights 앱을 종료합니다...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Backend 종료
echo -e "${YELLOW}Backend 서버를 종료하는 중...${NC}"
pkill -f "python3.*app.py" 2>/dev/null && echo -e "${GREEN}✓ Backend 서버가 종료되었습니다.${NC}" || echo -e "${YELLOW}⚠ 실행 중인 Backend 서버가 없습니다.${NC}"

# Frontend 종료
echo -e "${YELLOW}Frontend 서버를 종료하는 중...${NC}"
pkill -f "react-scripts" 2>/dev/null && echo -e "${GREEN}✓ Frontend 서버가 종료되었습니다.${NC}" || echo -e "${YELLOW}⚠ 실행 중인 Frontend 서버가 없습니다.${NC}"

# 포트 확인
echo ""
echo -e "${YELLOW}포트 5001 상태 확인...${NC}"
lsof -ti:5001 > /dev/null 2>&1 && echo -e "${YELLOW}⚠ 포트 5001이 여전히 사용 중입니다.${NC}" || echo -e "${GREEN}✓ 포트 5001이 해제되었습니다.${NC}"

echo -e "${YELLOW}포트 3000 상태 확인...${NC}"
lsof -ti:3000 > /dev/null 2>&1 && echo -e "${YELLOW}⚠ 포트 3000이 여전히 사용 중입니다.${NC}" || echo -e "${GREEN}✓ 포트 3000이 해제되었습니다.${NC}"

echo ""
echo -e "${GREEN}✓ 모든 서버가 종료되었습니다.${NC}"
echo ""

