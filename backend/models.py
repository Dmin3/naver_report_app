from pydantic import BaseModel
from datetime import date
from typing import List

# --- Pydantic Models ---
# API 요청 본문을 위한 데이터 모델
class ReportRequest(BaseModel):
    ages : List[str]
    gender : str
    time_unit: str
    category_title : str
    category_id: str
    start_date: date
    end_date: date

class KeywordRequest(BaseModel):
    keyword: str

class KeywordAnalyzeRequest(BaseModel):
    title:str
    keywords: List[str]
    time_unit: str
    start_date: date
    end_date: date
    ages : List[str]
    gender : str

