from fpdf import FPDF
import json
import os

# 현재 파일의 디렉토리 경로를 기준으로 폰트 파일의 절대 경로를 계산합니다.
# 이렇게 하면 어떤 위치에서 코드를 실행하더라도 폰트 파일의 경로를 정확하게 찾을 수 있습니다.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FONT_REGULAR_PATH = os.path.join(BASE_DIR, 'NanumGothic-Regular.ttf')
FONT_BOLD_PATH = os.path.join(BASE_DIR, 'NanumGothic-Bold.ttf')


class PDF(FPDF):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # 한글 폰트 추가 (절대 경로 사용)
        try:
            self.add_font('NanumGothic', '', FONT_REGULAR_PATH)
            self.add_font('NanumGothic', 'B', FONT_BOLD_PATH)
        except RuntimeError as e:
            raise RuntimeError(
                "Korean font file not found. Please ensure NanumGothic-Regular.ttf and NanumGothic-Bold.ttf "
                f"are in the '{BASE_DIR}' directory."
            ) from e
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        self.set_font('NanumGothic', 'B', 15)
        self.cell(0, 10, '네이버 쇼핑 분석 보고서', border=1, ln=1, align='C')
        self.ln(10)

    def chapter_title(self, title):
        self.set_font('NanumGothic', 'B', 13)
        self.cell(0, 10, title, ln=1, align='L')
        self.ln(2)

    def chapter_body(self, body):
        self.set_font('NanumGothic', '', 11)
        self.multi_cell(0, 8, body, markdown=True)
        self.ln()


def create_pdf_report(analysis: str, title: str) -> bytes:
    pdf = PDF()
    pdf.add_page()

    # 1. 분석 결과 (Gemini 결과)
    # 한글을 지원하는 폰트를 설정했으므로, 문자열을 그대로 전달합니다.
    pdf.chapter_title(f'네이버 {title} 카테고리 분석 요약')
    pdf.chapter_body(analysis)

    # # 2. 원본 데이터 (JSON)
    # pdf.chapter_title('참고: Naver API 원본 데이터')
    # raw_data_str = json.dumps(api_data, indent=4, ensure_ascii=False)
    # pdf.chapter_body(raw_data_str)

    # pdf.output()은 이미 bytearray를 반환하므로 .encode()가 필요 없습니다.
    return pdf.output()
