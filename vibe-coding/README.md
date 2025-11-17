# 📊 Excel Insights - 데이터 분석 보도자료 생성기

엑셀 파일을 업로드하면 자동으로 데이터를 분석하여 가장 중요한 인사이트 5가지를 추출하고, 적절한 차트와 함께 보도자료 형식으로 제공하는 웹 애플리케이션입니다.

## ✨ 주요 기능

1. **엑셀 파일 업로드**: .xlsx, .xls, .csv 파일 지원
2. **자동 데이터 분석**: 업로드된 데이터에서 중요한 패턴과 인사이트 추출
3. **인터랙티브 차트**: Recharts를 활용한 다양한 시각화 (막대 그래프, 선 그래프, 파이 차트 등)
4. **보도자료 자동 생성**: 분석 결과를 보도자료 형식으로 자동 작성
5. **현대적인 UI/UX**: 반응형 디자인과 직관적인 인터페이스

## 🛠 기술 스택

### Backend
- **Flask**: Python 웹 프레임워크
- **pandas**: 데이터 분석 및 처리
- **openpyxl**: 엑셀 파일 읽기
- **NumPy**: 수치 계산

### Frontend
- **React**: UI 라이브러리
- **Recharts**: 차트 시각화
- **Axios**: HTTP 클라이언트
- **React Dropzone**: 파일 업로드

## 📦 설치 및 실행 방법

### 1. 저장소 클론

```bash
cd vibe-coding
```

### 2. Backend 설정

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend 서버가 `http://localhost:5000`에서 실행됩니다.

### 3. Frontend 설정

새 터미널 창을 열고:

```bash
cd frontend
npm install
npm start
```

Frontend 개발 서버가 `http://localhost:3000`에서 실행됩니다.

## 🚀 사용 방법

1. 브라우저에서 `http://localhost:3000` 접속
2. 엑셀 파일을 드래그 앤 드롭하거나 클릭하여 업로드
3. 자동으로 분석된 인사이트 5가지와 차트 확인
4. 보도자료 형식의 상세한 분석 결과 확인
5. "복사하기" 버튼을 클릭하여 보도자료 복사

## 📊 분석 내용

애플리케이션이 자동으로 추출하는 인사이트:

1. **데이터셋 개요**: 전체 행/열 개수, 컬럼명
2. **최고 수치 기록**: 최대값과 해당 위치
3. **주요 통계 지표**: 평균, 표준편차 등
4. **데이터 추세**: 증가/감소 패턴 분석
5. **분포 분석**: 카테고리별 또는 수치별 분포

## 📁 프로젝트 구조

```
vibe-coding/
├── backend/
│   ├── app.py              # Flask 애플리케이션
│   └── requirements.txt    # Python 의존성
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.js      # 파일 업로드 컴포넌트
│   │   │   ├── FileUpload.css
│   │   │   ├── InsightCards.js    # 인사이트 카드 컴포넌트
│   │   │   ├── InsightCards.css
│   │   │   ├── PressRelease.js    # 보도자료 컴포넌트
│   │   │   └── PressRelease.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🔧 API 엔드포인트

### POST /api/upload
엑셀 파일을 업로드하고 분석 결과를 반환합니다.

**Request:**
- Content-Type: multipart/form-data
- Body: file (Excel/CSV 파일)

**Response:**
```json
{
  "success": true,
  "insights": [...],
  "press_release": "...",
  "data_preview": [...]
}
```

### GET /api/health
서버 상태를 확인합니다.

## 💡 예제 데이터

테스트를 위해 다음과 같은 엑셀 파일을 준비하세요:

| 날짜 | 매출액 | 방문자수 | 전환율 |
|------|--------|----------|--------|
| 2025-01-01 | 1000000 | 500 | 2.5 |
| 2025-01-02 | 1200000 | 600 | 3.0 |
| ... | ... | ... | ... |

## 🎨 UI 특징

- **그라데이션 배경**: 보라색 계열의 모던한 디자인
- **드래그 앤 드롭**: 직관적인 파일 업로드
- **애니메이션**: 부드러운 페이드 인 효과
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **인터랙티브 차트**: 마우스 오버 시 상세 정보 표시

## ⚠️ 주의사항

1. Backend 서버가 먼저 실행되어야 Frontend에서 파일을 업로드할 수 있습니다.
2. 큰 파일(수만 행 이상)의 경우 처리 시간이 길어질 수 있습니다.
3. 현재 버전은 로컬 환경에서만 동작합니다. 프로덕션 배포 시 추가 설정이 필요합니다.

## 🔮 향후 개선 사항

- [ ] AI 기반 더욱 정교한 인사이트 추출 (GPT API 연동)
- [ ] 사용자 정의 분석 기준 설정
- [ ] 다양한 차트 타입 추가
- [ ] PDF 보고서 다운로드 기능
- [ ] 여러 파일 비교 분석
- [ ] 데이터 필터링 및 정렬 기능

## 📝 라이센스

MIT License

## 👨‍💻 개발자

데이터 기반 의사결정을 지원하는 Excel Insights

---

**문제가 발생하거나 개선 사항이 있다면 이슈를 등록해주세요!**

