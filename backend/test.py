import google.generativeai as genai
import os
import json
from typing import List


genai.configure(api_key=os.environ["GEMINI_API_KEY"])


# Gemini 모델 찾기 테스트
print("--- 사용 가능한 모델 목록 ---")
for m in genai.list_models():
  # generateContent 메서드를 지원하는 모델만 출력
  if 'generateContent' in m.supported_generation_methods:
    print(m.name)


## Gemini 응답 값 parsing 방법
# model = genai.GenerativeModel('gemini-2.5-pro')
# prompt = '아무 텍스트나 만들어서 text를 전부 bytearry 타입으로만 리턴해줘'
# report = model.generate_content(prompt)
# print(report)
# print('해당 타입은? = ' , type(report))


# print('-----------------')
# print(report._result.candidates[0].content.parts[0].text)






