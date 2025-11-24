# 소비자물가지수 통계 분석 앱

지출목적별 소비자물가지수 데이터를 분석하여 주요 통계량 10개를 도출하고 보도자료를 자동 생성하는 웹 애플리케이션입니다.

## 주요 기능

1. **KOSIS API 연동**
   - KOSIS.kr OpenAPI를 통해 실시간 데이터 수집
   - 지출목적별 소비자물가지수 데이터 자동 로드
   - Excel 파일 업로드 없이 API에서 직접 데이터 가져오기

2. **주요 통계량 10개 분석**
   - 전체 평균 물가지수
   - 최고/최저 물가지수
   - 최근 1년/3년 평균
   - 연평균 증가율
   - 변동성 분석
   - 지출목적별 상승률 분석
   - 최근 추세 분석

3. **보도자료 자동 생성**
   - Word 문서 형식의 보도자료 자동 생성
   - 통계량과 종합 분석 포함

## 설치 방법

1. Python 3.8 이상이 설치되어 있어야 합니다.

2. 필요한 패키지 설치:
```bash
pip install -r requirements.txt
```

3. KOSIS API 키 설정:
   - [KOSIS OpenAPI](https://kosis.kr/openapi/openApiList.do)에서 API 키 발급
   - 프로젝트 루트 디렉토리에 `.env` 파일 생성
   - `.env` 파일에 다음 내용 추가:
   ```
   KOSIS_API_KEY=your_api_key_here
   ```
   - 발급받은 API 키로 `your_api_key_here` 부분을 교체

## 실행 방법

1. 앱 실행:
```bash
python app.py
```

2. 웹 브라우저에서 접속:
```
http://localhost:8889
```

3. 사용 방법:
   - **통계 분석**: "통계 분석 실행" 버튼을 클릭하여 데이터 분석
   - **보도자료 생성**: 분석 결과 확인 후 "보도자료 다운로드" 버튼 클릭

## 프로젝트 구조

```
vibe-coding/
├── app.py                          # Flask 백엔드 애플리케이션
├── .env                            # 환경 변수 (KOSIS API KEY)
├── templates/
│   └── index.html                  # 메인 HTML 템플릿
├── static/
│   ├── css/
│   │   └── style.css              # 스타일시트
│   └── js/
│       └── main.js                 # JavaScript 클라이언트 코드
├── requirements.txt                # Python 의존성
└── README.md                       # 프로젝트 설명서
```

## 기술 스택

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Data Processing**: pandas, numpy
- **API Integration**: KOSIS OpenAPI (requests)
- **Document Generation**: python-docx
- **Environment Management**: python-dotenv

## 주요 통계량 설명

1. **전체 평균**: 전체 기간의 평균 소비자물가지수
2. **최고/최저 물가지수**: 전체 기간 중 최고/최저 값과 해당 시점
3. **최근 1년 평균**: 최근 1년간의 평균 물가지수
4. **최근 3년 평균**: 최근 3년간의 평균 물가지수
5. **연평균 증가율**: 연도별 평균 증가율
6. **변동성**: 표준편차를 통한 변동성 측정
7. **최고/최저 상승률 지출목적**: 가장 높은/낮은 상승률을 보인 지출목적
8. **상위 지출목적 평균**: 평균 물가지수가 가장 높은 지출목적 상위 3개
9. **최근 추세**: 최근 6개월 대비 이전 6개월의 변화율

## 라이선스

이 프로젝트는 개인 사용 목적으로 제작되었습니다.

