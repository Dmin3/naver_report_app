# AI 네이버 쇼핑 트렌드 분석 리포트 생성기

**AI를 활용하여 네이버 데이터랩 쇼핑 인사이트 데이터를 분석하여 PDF 분석 보고서를 자동으로 생성하는 웹 애플리케이션입니다.**

이 프로젝트는 시장의 흐름을 빠르고 정확하게 파악하고자 하는 소상공인, 마케터를 위해 만들어졌습니다. 복잡한 데이터 분석 과정을 AI를 통해 자동화하여 누구나 쉽게 비즈니스에 활용할 수 있는 인사이트를 제공합니다.

## ✨ 주요 기능

*   **키워드 분석**: 특정 키워드에 대한 쇼핑 트렌드, 연관 검색어 데이터를 분석합니다.
*   **상품 카테고리 분석**: 특정 상품 카테고리의 트렌드를 분석하여 인기 상품 및 시장 동향을 파악합니다.
*   **PDF 리포트 자동 생성**: 분석된 데이터를 시각적으로 정리한 PDF 리포트를 즉시 다운로드할 수 있습니다.
*   **직관적인 웹 인터페이스**: 사용자가 쉽게 키워드와 카테고리를 입력하고 리포트를 요청할 수 있는 UI를 제공합니다.

## 🛠️ 기술 스택

*   **Backend**: Python, FastAPI
*   **Frontend**: React.js
*   **데이터 소스**: Naver DataLab Shopping Insight API, Gemini API
*   **PDF 생성**: FPDF

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone https://github.com/Dmin3/naver_report_app.git
cd naver_report_app
```

### 2. 백엔드 설정

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. 프론트엔드 설정

```bash
cd frontend
npm install
npm start
```

이제 웹 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 사용할 수 있습니다.

## 🖼️ 스크린샷
### 메인 랜딩 페이지
---
<img width="1536" height="907" alt="image" src="https://github.com/user-attachments/assets/4200f4bc-393d-477f-a036-b273a6f8eb49" />
     
### 리포트 생성 폼
---
<img width="688" height="841" alt="image" src="https://github.com/user-attachments/assets/3e07dc77-3112-4556-9e87-ffc26116e212" />

### 생성된 PDF 리포트 예시
---
<img width="969" height="776" alt="image" src="https://github.com/user-attachments/assets/ee8b85b1-829d-475e-838d-0de328aff9bd" />


## 🖥️ 웹 사이트
- https://shop-trend.duckdns.org
