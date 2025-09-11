import requests
import json
import logging
from fastapi import HTTPException
import naverConfig
import google.generativeai as genai
import os

# --- Naver API Service ---
# 공통 Header
headers = {
    "X-Naver-Client-Id": naverConfig.NAVER_CLIENT_ID,
    "X-Naver-Client-Secret": naverConfig.NAVER_CLIENT_SECRET,
    "Content-Type": "application/json",
}

def call_naver_api(api_url: str, request_body: dict):
    # 네이버 데이터랩 API를 호출하고 결과를 반환합니다.
    
    try:
        response = requests.post(api_url, headers=headers, data=json.dumps(request_body))
        response.raise_for_status()  # HTTP 에러 발생 시 예외 처리
        api_data = response.json()
        logging.info("Naver API Response: %s", api_data)
        return api_data
    except requests.exceptions.RequestException as e:
        logging.error(f"Naver API request failed: {e}")
        # API 호출 실패 시, 클라이언트에게 500 에러와 함께 구체적인 실패 이유를 전달합니다.
        raise HTTPException(status_code=500, detail=f"Naver API request failed: {e}")


# --- Gemini API Service ---
def get_gemini_analysis(prompt: str) -> str:    
    # Gemini를 사용하여 주어진 프롬프트에 대한 분석 결과를 생성합니다.
    try:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        model = genai.GenerativeModel('gemini-2.5-pro')
        
        logging.info('Gemini 토큰 수 = %s', model.count_tokens(prompt))
        
        response = model.generate_content(prompt)
        
        logging.info("Gemini 결과 응답값 = %s", response)
        analysis_text = response.text
        return analysis_text
    except Exception as e:
        logging.error(f"Gemini API 호출 중 에러 발생: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini API 호출 중 에러 발생: {e}")


def get_gemini_keywords(prompt: str) -> dict:
    # Gemini를 사용하여 연관 검색어 추천(JSON 형식)을 생성합니다.

    try:
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        
        generation_config = {
            "response_mime_type": "application/json",
        }
        model = genai.GenerativeModel('gemini-2.5-flash', generation_config=generation_config)
        
        response = model.generate_content(prompt)
        
        # Gemini API가 반환한 텍스트를 JSON으로 파싱
        related_keywords = json.loads(response.text)
        return related_keywords
    except json.JSONDecodeError:
        logging.error("Gemini API가 유효한 JSON을 반환하지 않았습니다.")
        raise HTTPException(status_code=500, detail="Gemini API가 유효한 JSON을 반환하지 않았습니다.")
    except Exception as e:
        logging.error(f"Gemini API 호출 중 에러 발생: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini API 호출 중 에러 발생: {e}")
