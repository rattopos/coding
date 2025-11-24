# 소비자물가지수 통계 분석 앱

지출목적별 소비자물가지수 데이터를 분석하여 주요 통계량 10개를 도출하고 보도자료를 자동 생성하는 웹 애플리케이션입니다.

## 주요 기능

1. **주요 통계량 10개 분석**
   - 전체 평균 물가지수
   - 최고/최저 물가지수
   - 최근 1년/3년 평균
   - 연평균 증가율
   - 변동성 분석
   - 지출목적별 상승률 분석
   - 최근 추세 분석

2. **보도자료 자동 생성**
   - Word 문서 형식의 보도자료 자동 생성
   - 통계량과 종합 분석 포함

3. **PDF to DOCX 변환**
   - PDF 파일을 Word 문서로 변환
   - pypandoc과 PyPDF2를 사용한 변환 기능
   - 웹 인터페이스를 통한 간편한 변환

## 설치 방법

1. Python 3.8 이상이 설치되어 있어야 합니다.

2. Pandoc 설치 (PDF 변환 기능 사용 시 필요):
   - macOS: `brew install pandoc`
   - Ubuntu/Debian: `sudo apt-get install pandoc`
   - Windows: [Pandoc 공식 사이트](https://pandoc.org/installing.html)에서 다운로드

3. 필요한 패키지 설치:
```bash
pip install -r requirements.txt
```

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
   - **PDF 변환**: "PDF 파일 선택" 버튼으로 PDF 파일 업로드 후 "DOCX로 변환" 버튼 클릭

## 프로젝트 구조

```
vibe-coding/
├── app.py                          # Flask 백엔드 애플리케이션
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
- **Document Generation**: python-docx
- **PDF Conversion**: pypandoc, PyPDF2

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

