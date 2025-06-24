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
from pathlib import Path   # Windows 경로 처리를 위해 추가
from dotenv import load_dotenv
import google.generativeai as genai

# --- 1. 패키지 자동 설치 (개선된 버전) ---
def check_and_install_packages():
    """스크립트 실행에 필요한 패키지들을 확인하고, 없으면 자동으로 설치합니다."""
    required_packages = ['python-dotenv', 'requests', 'google-generativeai']
    print("필요한 패키지를 확인합니다...")
    
    try:
        # pip 모듈 import 확인
        import pip
    except ImportError:
        print("pip 모듈을 찾을 수 없습니다. Python이 올바르게 설치되어 있는지 확인해주세요.")
        sys.exit(1)

    for package in required_packages:
        try:
            # 설치된 패키지 버전을 확인하는 방식으로 존재 여부 체크
            importlib.metadata.version(package)
            print(f" - '{package}' (설치됨)")
        except importlib.metadata.PackageNotFoundError:
            print(f" - '{package}' (설치 안됨) -> 설치를 시작합니다...")
            try:
                # Windows에서는 --user 옵션 없이 설치
                install_cmd = [sys.executable, "-m", "pip", "install", package]
                result = subprocess.run(install_cmd, capture_output=True, text=True)
                
                if result.returncode != 0:
                    print(f"'{package}' 설치 중 오류 발생:")
                    print("STDOUT:", result.stdout)
                    print("STDERR:", result.stderr)
                    sys.exit(1)
                print(f"   '{package}' 설치 완료.")
            except Exception as e:
                print(f"   '{package}' 설치 중 오류가 발생했습니다: {e}")
                sys.exit(1)

print("Python 버전:", sys.version)
print("실행 경로:", sys.executable)
check_and_install_packages()

# 현재 스크립트의 디렉토리와 프로젝트 루트 디렉토리 설정
SCRIPT_DIR = Path(__file__).resolve().parent
# Java의 user.dir과 동일한 경로 계산 (작업 디렉토리 사용)
PROJECT_ROOT = Path(os.getcwd())
print("현재 작업 디렉토리:", PROJECT_ROOT)

# OCR 디렉토리 경로 설정 (Java에서 설정한 작업 디렉토리가 이미 /app/ocr)
OCR_DIR = PROJECT_ROOT  # 작업 디렉토리 자체가 OCR 디렉토리
print("OCR 디렉토리:", OCR_DIR)

# --- .env 파일에서 환경 변수 불러오기 ---
env_path = SCRIPT_DIR / '.env'
load_dotenv(env_path)

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
    input_dir = OCR_DIR / 'input'
    if not input_dir.exists():
        print(f"'{input_dir}' 폴더를 찾을 수 없어 새로 생성합니다.")
        input_dir.mkdir(parents=True, exist_ok=True)

    # Windows에서도 작동하는 파일 검색
    files_found = list(input_dir.glob('receipt.*'))

    if not files_found:
        print(f"오류: '{input_dir}' 폴더 안에 'receipt.jpg' 또는 'receipt.png' 같은 파일을 넣어주세요.")
        return None, None

    image_path = str(files_found[0])
    # 파일 경로에서 확장자만 추출 (예: '.jpg' -> 'jpg')
    file_format = files_found[0].suffix[1:].lower()

    print(f"이미지 파일을 찾았습니다: {image_path} (포맷: {file_format})")
    return image_path, file_format


def save_result_to_file(parsed_data, input_filename):
    """파싱된 결과를 'output' 폴더에 JSON 파일로 저장합니다."""
    output_dir = OCR_DIR / 'output'
    if not output_dir.exists():
        print(f"'{output_dir}' 폴더를 찾을 수 없어 새로 생성합니다.")
        output_dir.mkdir(parents=True, exist_ok=True)

    output_filename = output_dir / "receipt_result.json"  # 항상 같은 파일명 사용

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
    """OCR 결과를 파싱하여 필요한 정보를 추출합니다."""
    try:
        # OCR 결과 검증
        if not isinstance(ocr_result, dict):
            print(f"잘못된 OCR 결과 형식: {type(ocr_result)}")
            return {"storeName": None, "address": None, "menuItems": [], "totalPrice": None}
            
        images = ocr_result.get('images', [])
        if not images:
            print("OCR 결과에 이미지 데이터가 없습니다.")
            return {"storeName": None, "address": None, "menuItems": [], "totalPrice": None}
            
        # OCR 텍스트 추출
        lines = []
        for image in images:
            fields = image.get('fields', [])
            for field in fields:
                text = field.get('inferText', '').strip()
                if text:  # 빈 문자열이 아닌 경우만 추가
                    lines.append(text)
                    
        if not lines:
            print("추출된 텍스트가 없습니다.")
            return {"storeName": None, "address": None, "menuItems": [], "totalPrice": None}
            
        # 전체 텍스트 구성
        full_text = "\n".join(lines)
        print("\n=== OCR 추출 텍스트 ===")
        print(full_text)
        print("=====================\n")
        
        # AI로 파싱
        return parse_receipt_with_ai(full_text)
        
    except Exception as e:
        print(f"OCR 결과 파싱 중 오류 발생: {e}")
        return {"storeName": None, "address": None, "menuItems": [], "totalPrice": None}

# --- 메인 실행 로직 ---
if __name__ == "__main__":
    # 파일 경로와 포맷을 함께 받아옴
    image_file_path, image_format = find_receipt_image()
    if not image_file_path:
        sys.exit(1)

    # JFIF를 JPG로 변환
    if image_format.lower() == 'jfif':
        image_format = 'jpeg'
        print(f"JFIF 형식을 JPEG로 처리합니다.")

    # 이미지 파일을 base64로 인코딩
    with open(image_file_path, 'rb') as f:
        file_data = f.read()
    import base64
    file_data_b64 = base64.b64encode(file_data).decode()

    # API 요청 헤더와 데이터 구성
    headers = {
        "X-OCR-SECRET": secret_key,
        "Content-Type": "application/json"
    }

    request_json = {
        "images": [
            {
                "format": image_format,
                "name": "receipt",
                "data": file_data_b64
            }
        ],
        "requestId": str(uuid.uuid4()),
        "version": "V2",
        "timestamp": int(round(time.time() * 1000))
    }

    print(f"API 요청 구성 완료 (이미지 형식: {image_format})")

    try:
        print("Naver CLOVA OCR API에 요청을 보냅니다...")
        response = requests.post(
            api_url,
            headers=headers,
            json=request_json
        )
        
        if response.status_code != 200:
            print(f"API 오류 응답 (상태 코드: {response.status_code}):")
            print(response.text)
            sys.exit(1)
            
        print("API 응답을 성공적으로 받았습니다.")
    except Exception as e:
        print(f"API 요청 중 오류가 발생했습니다: {e}")
        if hasattr(e, 'response') and hasattr(e.response, 'text'):
            print("API 오류 응답:", e.response.text)
        sys.exit(1)

    result = response.json()
    parsed_result = parse_receipt(result)
    print("\n--- 최종 파싱 결과 (터미널) ---")
    print(json.dumps(parsed_result, indent=4, ensure_ascii=False))
    print("--------------------------")

    save_result_to_file(parsed_result, image_file_path)