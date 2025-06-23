# ocr-parser

## 개요
ocr-parser는 Naver CLOVA OCR을 사용하여 영수증의 텍스트를 읽고, 
Google Gemini API를 통해 분석하여 상호명, 주소, 상품(메뉴)명, 가격, 결제금액을 추출합니다.

## 준비물
- Python 3.11.x
    - python-dotenv
    - requests
    - google-generativeai
- Naver CLOVA OCR API
- Google Gemini API

## 실행 과정
0. .env에 CLOVA API Gateway URL, CLOVA OCR Secret Key, Gemini API Key 삽입
1. input 폴더에 receipt 이미지 파일을 저장합니다(jpg/jpeg/png)
2. `python ocr-parser.py` 실행 시, 이미지 파일을 Naver CLOVA OCR 엔진에 전달하고 결과를 받아옵니다.
3. CLOVA OCR로부터 결과물을 받아오면, Gemini API를 통해 파싱을 시도합니다. 
4. 정상적으로 파싱에 성공하면 output 폴더에 receipt_result.json 파일이 생성됩니다.
5. json 파일에는 상호명, 주소, 메뉴/가격 목록, 총 결제 금액이 포함됩니다.