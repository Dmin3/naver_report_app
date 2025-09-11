import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app  # FastAPI 애플리케이션 임포트

# 테스트 클라이언트 설정
client = TestClient(app)

# --- Mock Data ---
# Naver API와 Gemini API의 응답을 흉내내는 가짜 데이터
MOCK_NAVER_API_RESPONSE = {"results": [{"title": "Mock Data", "data": []}]}
MOCK_GEMINI_ANALYSIS_RESPONSE = "## Mock Gemini 분석 보고서\n\n- 테스트 데이터입니다."
MOCK_GEMINI_KEYWORDS_RESPONSE = {"related_keywords": ["mock_keyword1", "mock_keyword2"]}

# --- Test Cases ---

# @patch 데코레이터를 사용하여 main 모듈에서 사용하는 api_service 함수들을 모킹합니다.
@patch('main.get_gemini_analysis', return_value=MOCK_GEMINI_ANALYSIS_RESPONSE)
@patch('main.call_naver_api', return_value=MOCK_NAVER_API_RESPONSE)
def test_generate_report(mock_call_naver_api, mock_get_gemini_analysis):
    """
    `/api/report` 엔드포인트가 PDF 보고서를 정상적으로 생성하는지 테스트합니다.
    """
    # 1. 테스트용 요청 본문 데이터 생성
    test_request_data = {
        "ages": ["20", "30"],
        "gender": "f",
        "time_unit": "date",
        "category_title": "패션의류",
        "category_id": "50000000",
        "start_date": "2025-01-01",
        "end_date": "2025-01-07"
    }
    
    # 2. 테스트 클라이언트로 API 요청 전송
    response = client.post("/api/report", json=test_request_data)
    
    # 3. 응답 검증
    assert response.status_code == 200
    assert response.headers['content-type'] == 'application/pdf'
    # PDF 내용이 비어있지 않은지 확인
    assert len(response.content) > 0
    
    # 4. Mock 함수들이 올바르게 호출되었는지 검증
    assert mock_call_naver_api.call_count == 3  # Naver API는 3번 호출되어야 함
    mock_get_gemini_analysis.assert_called_once() # Gemini 분석은 1번 호출되어야 함


@patch('main.get_gemini_keywords', return_value=MOCK_GEMINI_KEYWORDS_RESPONSE)
def test_generate_keyword(mock_get_gemini_keywords):
    """
    `/api/keyword` 엔드포인트가 연관 검색어 JSON을 정상적으로 반환하는지 테스트합니다.
    """
    # 1. 테스트용 요청 데이터
    test_request_data = {"keyword": "테스트"}
    
    # 2. API 요청
    response = client.post("/api/keyword", json=test_request_data)
    
    # 3. 응답 검증
    assert response.status_code == 200
    assert response.json() == MOCK_GEMINI_KEYWORDS_RESPONSE
    
    # 4. Mock 함수 호출 검증
    mock_get_gemini_keywords.assert_called_once()


@patch('main.get_gemini_analysis', return_value=MOCK_GEMINI_ANALYSIS_RESPONSE)
@patch('main.call_naver_api', return_value=MOCK_NAVER_API_RESPONSE)
def test_analyze_keyword(mock_call_naver_api, mock_get_gemini_analysis):
    """
    `/api/keyword/analyze` 엔드포인트가 키워드 분석 PDF 보고서를 정상적으로 생성하는지 테스트합니다.
    """
    # 1. 테스트용 요청 데이터
    test_request_data = {
        "title": "테스트 분석",
        "keywords": ["키워드1", "키워드2"],
        "time_unit": "date",
        "start_date": "2025-01-01",
        "end_date": "2025-01-07",
        "ages": ["30", "40"],
        "gender": "m"
    }
    
    # 2. API 요청
    response = client.post("/api/keyword/analyze", json=test_request_data)
    
    # 3. 응답 검증
    assert response.status_code == 200
    assert response.headers['content-type'] == 'application/pdf'
    assert len(response.content) > 0
    
    # 4. Mock 함수 호출 검증
    mock_call_naver_api.assert_called_once()
    mock_get_gemini_analysis.assert_called_once()
