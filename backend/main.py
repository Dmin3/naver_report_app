from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import io
import logging
import pprint

# --- Local Imports ---
import naverConfig
from models import KeywordRequest, ReportRequest, KeywordAnalyzeRequest
from utils import convert_age_groups
from pdf_generator import create_pdf_report
from api_service import call_naver_api, get_gemini_analysis, get_gemini_keywords

# LOG LEVEL 설정
logging.basicConfig(level=logging.INFO)

# --- FastAPI App Initialization ---
app = FastAPI()

# CORS (Cross-Origin Resource Sharing) 설정
# 프론트엔드 (React App)가 3000번 포트에서 실행될 것이므로, 해당 오리진을 허용
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- API Endpoint ---
@app.post("/api/report")
async def generate_report(request: ReportRequest):
    #네이버 쇼핑인사이트 API를 호출하여 트렌드 데이터를 받고, 이를 기반으로 분석 텍스트를 생성한 후 PDF 보고서를 반환합니다.
    
    # 1. Naver DataLab API 요청 본문 생성
    category_request_body = {
        "startDate": request.start_date.strftime("%Y-%m-%d"),
        "endDate": request.end_date.strftime("%Y-%m-%d"),
        "timeUnit": request.time_unit,
        "category": [{"name": request.category_title, "param": [request.category_id]}],
        "device": "",
        "gender": "",
        "ages": [],
    }
    age_request_body = {
        "startDate": request.start_date.strftime("%Y-%m-%d"),
        "endDate": request.end_date.strftime("%Y-%m-%d"),
        "timeUnit": request.time_unit,
        "category": request.category_id,
        "ages": request.ages,
        "gender": ""
    }
    gender_request_body = {
        "startDate": request.start_date.strftime("%Y-%m-%d"),
        "endDate": request.end_date.strftime("%Y-%m-%d"),
        "timeUnit": request.time_unit,
        "category": request.category_id,
        "ages": [],
        "gender": request.gender
    }

    # 2. Naver DataLab API 호출
    api_category_data = call_naver_api(naverConfig.NAVER_API_CATEGORIES_URL, category_request_body)
    api_category_age = call_naver_api(naverConfig.NAVER_API_AGE_URL, age_request_body)
    api_category_gender = call_naver_api(naverConfig.NAVER_API_GENDER_URL, gender_request_body)

    # 3. Gemini 분석 프롬프트 생성
    prompt = f"""
    다음 JSON 데이터를 분석하여 30초 이내로 전문적인 보고서를 작성해 줘. (내용은 간략해도 괜찮아) 
    보고서의 모든 내용은 **마크다운(Markdown) 형식**을 사용해야 해.
    예를 들어, 보고서의 큰 제목은 '# 제목'으로, 중간 제목은 '## 소제목'으로, 목록은 '-' 기호를 사용해서 표현해 줘.

    [보고서 구성]
    1. 보고서 제목
    2. 데이터 개요
    3. 주요 지표 분석
        - 핵심 지표 1: ...
        - 핵심 지표 2: ...
    4. 결론 및 제언

    [JSON 데이터]
    카테고리 검색 추이 데이터 = {api_category_data}
    ---
    성별 검색 추이 데이터 = {api_category_gender}
    ---
    연령대 검색 추이 데이터 = {api_category_age}
    """

    # 4. Gemini API 호출
    analysis_result = get_gemini_analysis(prompt)

    # 5. PDF 보고서 생성
    pdf_bytes = create_pdf_report(analysis_result, request.category_title)

    # 6. PDF 파일 스트리밍 응답
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=trend_report.pdf"}
    )


@app.post("/api/keyword")
async def generate_keyword(request: KeywordRequest):
    # 입력된 키워드와 연관된 검색어를 Gemini API를 통해 추천받아 JSON 형식으로 반환합니다.

    prompt = f"""
    '{request.keyword}'와(과) 연관된 검색 키워드를 20개 추천해 줘.
    반드시 아래와 같은 JSON 형식으로만 응답해야 해. 다른 설명은 절대 추가하지 마.

    {{
      "related_keywords": ["키워드1", "키워드2", ...]
    }}
    """
    
    # Gemini API 호출하여 연관 검색어 생성
    related_keywords = get_gemini_keywords(prompt)
    return related_keywords


@app.post("/api/keyword/analyze")
async def analyze_keyword(request: KeywordAnalyzeRequest):
    """
    키워드 목록에 대한 네이버 검색량 데이터를 조회하고,
    이를 기반으로 Gemini 분석을 수행하여 PDF 보고서를 반환합니다.
    """
    # 1. Naver API 요청 형식에 맞게 키워드 그룹 생성
    keywordGroups = [
        {"groupName": f"{request.title}#{idx + 1}", "keywords": [keyword]}
        for idx, keyword in enumerate(request.keywords)
    ]
    
    # 연령대 코드를 API 형식으로 변환
    ages = convert_age_groups(request.ages)

    # 2. Naver DataLab API 요청 본문 생성
    search_request_body = {
        "startDate": request.start_date.strftime("%Y-%m-%d"),
        "endDate": request.end_date.strftime("%Y-%m-%d"),
        "timeUnit": request.time_unit,
        "keywordGroups": keywordGroups,
        "ages": ages,
        "gender": request.gender
    }

    # 3. Naver DataLab API 호출
    api_search_data = call_naver_api(naverConfig.NAVER_API_SEARCH_URL, search_request_body)
    pprint.pprint(api_search_data)

    # 4. Gemini 분석 프롬프트 생성
    prompt = f"""
    다음 JSON 데이터를 분석하여 30초 이내로 전문적인 보고서를 작성해 줘. (내용은 간략해도 괜찮아) 
    보고서의 모든 내용은 **마크다운(Markdown) 형식**을 사용해야 해.
    예를 들어, 보고서의 큰 제목은 '# 제목'으로, 중간 제목은 '## 소제목'으로, 목록은 '-' 기호를 사용해서 표현해 줘.

    [보고서 구성]
    1. 보고서 제목
    2. 데이터 개요
    3. 주요 지표 분석
        - 핵심 지표 1: ...
        - 핵심 지표 2: ...
    4. 결론 및 제언

    [JSON 데이터]
    api_search_data = {api_search_data}
    """

    # 5. Gemini API 호출
    analysis_result = get_gemini_analysis(prompt)

    # 6. PDF 보고서 생성
    pdf_bytes = create_pdf_report(analysis_result, request.title)

    # 7. PDF 파일 스트리밍 응답
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=trend_report.pdf"}
    )


# --- Uvicorn Runner ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


