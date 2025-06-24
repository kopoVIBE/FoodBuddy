import os
import sys
import subprocess
import json
import re
import glob
import time
import uuid
import importlib.metadata  # 패키지 확인을 위한 표준 라이브러리
import requests            # 누락되었던 requests 모듈 임포트 추가
from dotenv import load_dotenv
import google.generativeai as genai

# --- 1. 패키지 자동 설치 (개선된 버전) ---
def check_and_install_packages():
    """스크립트 실행에 필요한 패키지들을 확인하고, 없으면 자동으로 설치합니다."""
    required_packages = ['python-dotenv', 'requests', 'google-generativeai']
    print("필요한 패키지를 확인합니다...")
    for package in required_packages:
        try:
            # 설치된 패키지 버전을 확인하는 방식으로 존재 여부 체크
            importlib.metadata.version(package)
            print(f" - '{package}' (설치됨)")
        except importlib.metadata.PackageNotFoundError:
            print(f" - '{package}' (설치 안됨) -> 설치를 시작합니다...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", package])
                print(f"   '{package}' 설치 완료.")
            except subprocess.CalledProcessError as e:
                print(f"   '{package}' 설치 중 오류가 발생했습니다: {e}")
                sys.exit(1)

check_and_install_packages()

# --- .env 파일에서 환경 변수 불러오기 ---
load_dotenv()

# API 인증 정보
secret_key = os.getenv('CLOVA_OCR_SECRET_KEY')
api_url = os.getenv('CLOVA_OCR_APIGW_INVOKE_URL')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# 환경 변수 확인
if not all([secret_key, api_url, GOOGLE_API_KEY]):
    print("오류: .env 파일에 필요한 모든 API 키가 올바르게 설정되었는지 확인하세요.")
    sys.exit(1)

# Google Gemini API 설정
genai.configure(api_key=GOOGLE_API_KEY)


def find_receipt_image():
    """
    'input' 폴더에서 'receipt'라는 이름의 이미지 파일을 찾아,
    파일 경로와 확장자를 함께 반환합니다.
    """
    input_dir = 'input'
    if not os.path.exists(input_dir):
        print(f"'{input_dir}' 폴더를 찾을 수 없어 새로 생성합니다.")
        os.makedirs(input_dir)

    search_pattern = os.path.join(input_dir, 'receipt.*')
    files_found = glob.glob(search_pattern)

    if not files_found:
        print(f"오류: '{input_dir}' 폴더 안에 'receipt.jpg' 또는 'receipt.png' 같은 파일을 넣어주세요.")
        return None, None

    image_path = files_found[0]
    # 파일 경로에서 확장자만 추출 (예: '.jpg' -> 'jpg')
    file_format = os.path.splitext(image_path)[1][1:].lower()

    print(f"이미지 파일을 찾았습니다: {image_path} (포맷: {file_format})")
    return image_path, file_format


def save_result_to_file(parsed_data, input_filename):
    """파싱된 결과를 'output' 폴더에 JSON 파일로 저장합니다."""
    output_dir = 'output'
    if not os.path.exists(output_dir):
        print(f"'{output_dir}' 폴더를 찾을 수 없어 새로 생성합니다.")
        os.makedirs(output_dir)

    base_filename = os.path.splitext(os.path.basename(input_filename))[0]
    output_filename = os.path.join(output_dir, f"{base_filename}_result.json")

    try:
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(parsed_data, f, indent=4, ensure_ascii=False)
        print(f"파싱 결과를 '{output_filename}' 파일에 성공적으로 저장했습니다.")
    except Exception as e:
        print(f"결과 파일 저장 중 오류 발생: {e}")


def parse_receipt_with_ai(ocr_text: str) -> dict:
    """생성형 AI(Gemini 2.5 Flash)를 사용하여 OCR 텍스트를 파싱하는 함수."""
    model = genai.GenerativeModel('gemini-2.5-flash')
    prompt = f"""
    당신은 영수증 OCR 텍스트를 분석하여 지정된 JSON 형식으로 변환하는 매우 정밀한 데이터 추출 엔진입니다.

    ### 지침 ###
    1.  **출력 형식:** 반드시 유효한 JSON 객체 하나만 응답해야 합니다. 다른 설명, 주석, 마크다운(` ```json `)을 절대로 포함하지 마세요.
    2.  **키 구조:** JSON의 최상위 키는 'storeName', 'address', 'menuItems', 'totalPrice' 만을 사용합니다. 다른 키는 추가하지 마세요.
    3.  **메뉴 항목:** 'menuItems'는 `[__{{"name": "메뉴명", "price": 가격}}__]` 형태의 리스트여야 합니다. 가격을 식별할 수 없는 항목은 목록에 포함하지 마세요.
    4.  **가격 처리:** 모든 가격 정보는 오직 정수(integer) 형태여야 합니다. 쉼표나 통화 기호는 제거하세요.
    5.  **정보 부재:** 특정 정보를 명확히 찾을 수 없는 경우, 해당 키의 값은 `null` 로 설정하세요.
    6.  **OCR 오류 보정:** 텍스트에 명백한 OCR 오류가 있다면(예: '마리닝' -> '마라탕', '용용선생 영등포역점 상호' -> '용용선생 영등포역점'), 문맥을 파악하여 올바른 정보로 보정하세요. 하지만 없는 정보를 추측해서 만들지는 마세요.
    7.  **메뉴 이름 정제:** '3인세트'와 같이 여러 줄에 걸쳐 설명된 메뉴는 핵심적인 대표 메뉴 이름만 간결하게 추출하세요.

    ---
    ### 예시1 (Example1) ###

    [입력 OCR 텍스트]
    용용선생
    영등포역점
    76,900원
    (NH체크카드)
    ... (중략) ...
    3인세트
    고추바삭유림기/마라미요새우(3,000)
    48,400
    1
    /간장계란볶음
    64,900
    밥
    ... (중략) ...
    진로이즈백
    6,000
    2
    12,000
    ... (중략) ...
    결제금액
    76,900
    ... (중략) ...
    상호
    강양림
    대표
    ... (중략) ...
    주소
    서울특별시
    영등포구
    (영등포동3가)
    영중로4길
    9-2
    1층

    [출력 JSON]
    {{
        "storeName": "용용선생 영등포역점",
        "address": "서울특별시 영등포구(영등포동3가) 영중로4길 9-2 1층",
        "menuItems": [
            {{"name": "3인세트", "price": 64900}},
            {{"name": "진로이즈백", "price": 12000}}
        ],
        "totalPrice": 76900
    }}
    ---

    ---
    ### 예시2 (Example2) ###

    [입력 OCR 텍스트]
    지지속성호
    [영
    수
    승]
    (105호)탕화쿵푸마리닝(호계) /
    299-27-00913
    /
    김호
    경기 인양시
    동인구
    평촌대로223번길
    59 (호
    계동,
    서련코아빌딩)
    201호
    031-1234-5678
    /
    ... (중략) ...
    상
    품
    명
    단
    가
    수량
    금액
    마라탕보통맛
    9,600
    1
    9,600
    입 계
    금액
    9,600
    ... (중략) ...
    승인금액:
    9,600
    승인번호:
    53504426
    승인일시:
    2025-06-21
    ... (중략) ...
    승
    인
    [주문번호]
    0031

    [출력 JSON]
    {{
        "storeName": "탕화쿵푸마라탕(호계)",
        "address": "경기 안양시 동안구 평촌대로223번길 59 (호계동, 서련코아빌딩) 201호",
        "menuItems": [
            {{"name": "마라탕보통맛", "price": 9600}}
        ],
        "totalPrice": 9600
    }}
    ---

    ### 실제 작업 ###
    [입력 OCR 텍스트]
    {ocr_text}

    [출력 JSON]
    """
    try:
        print("AI 파싱을 요청합니다...")
        response = model.generate_content(prompt)
        json_text = response.text.strip()
        match = re.search(r'\{[\s\S]*\}', json_text)
        if match: json_text = match.group(0)
        return json.loads(json_text)
    except Exception as e:
        print(f"AI 파싱 중 오류 발생: {e}")
        return {"storeName": None, "address": None, "menuItems": [], "totalPrice": None}


def parse_receipt(ocr_result):
    lines = [field.get('inferText', '') for image in ocr_result.get('images', []) for field in image.get('fields', [])]
    full_text = "\n".join(lines)
    return parse_receipt_with_ai(full_text)

# --- 메인 실행 로직 ---
if __name__ == "__main__":
    # 파일 경로와 포맷을 함께 받아옴
    image_file_path, image_format = find_receipt_image()
    if not image_file_path:
        sys.exit(1)

    headers = {"X-OCR-SECRET": secret_key}
    # 동적으로 감지된 포맷을 API 요청에 사용
    request_json = {
        "images": [{"format": image_format, "name": "receipt"}],
        "requestId": str(uuid.uuid4()),
        "version": "V2",
        "timestamp": int(round(time.time() * 1000))
    }
    payload = {'message': json.dumps(request_json).encode('UTF-8')}

    try:
        with open(image_file_path, 'rb') as f:
            files = [('file', f)]
            print("Naver CLOVA OCR API에 요청을 보냅니다...")
            response = requests.post(api_url, headers=headers, data=payload, files=files)
            response.raise_for_status()
    except Exception as e:
        print(f"API 요청 중 오류가 발생했습니다: {e}")
        sys.exit(1)

    result = response.json()
    print("API 응답을 성공적으로 받았습니다.")

    parsed_result = parse_receipt(result)
    print("\n--- 최종 파싱 결과 (터미널) ---")
    print(json.dumps(parsed_result, indent=4, ensure_ascii=False))
    print("--------------------------")

    save_result_to_file(parsed_result, image_file_path)