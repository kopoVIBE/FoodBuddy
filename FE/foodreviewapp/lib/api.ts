import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_BACK_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰이 있으면 헤더에 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않음
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

// 회원가입 API 타입 정의
export interface SignupData {
  email: string;
  password: string;
  nickname: string;
  defaultStyleId: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  nickname: string;
  defaultStyleId: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  nickname: string;
}

// 회원가입 API
export const signup = async (data: SignupData): Promise<SignupResponse> => {
  const response = await axiosInstance.post("/api/users/register", data);
  return response.data;
};

// 로그인 API
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/api/users/login", data);
  return response.data;
};

// OCR API
export interface OCRResult {
  text: string;
  restaurantName: string;
  items: Array<{ name: string; price: number }>;
  total: number;
  address?: string;
}

export const processOCR = async (file: File): Promise<OCRResult> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post("/api/ocr/process", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 60000, // OCR 처리는 60초까지 대기
  });

  return response.data;
};

// 리뷰 생성 API
export interface ReviewGenerationRequest {
  restaurantName: string;
  menuItems: Array<{ name: string; price: number }>;
  tone: string; // friendly, professional, simple, emotional
  rating: number; // 1-5
  additionalKeywords?: string;
}

export interface ReviewGenerationResponse {
  review: string;
}

const getToneInstruction = (tone: string): string => {
  switch (tone) {
    case "friendly":
      return "친근하고 활발한 말투로 작성해주세요. 이모티콘이나 감탄사를 적절히 사용하세요.";
    case "professional":
      return "정중하고 객관적인 말투로 작성해주세요. 전문적이고 신뢰감 있는 표현을 사용하세요.";
    case "simple":
      return "간단명료한 말투로 작성해주세요. 핵심만 담아 짧고 명확하게 표현하세요.";
    case "emotional":
      return "감성적이고 따뜻한 말투로 작성해주세요. 개인적인 감정과 추억을 담아 표현하세요.";
    default:
      return "자연스럽고 일반적인 말투로 작성해주세요.";
  }
};

const getSatisfactionLevel = (rating: number): string => {
  switch (rating) {
    case 1:
      return "매우 불만족 (1점)";
    case 2:
      return "불만족 (2점)";
    case 3:
      return "보통 (3점)";
    case 4:
      return "만족 (4점)";
    case 5:
      return "매우 만족 (5점)";
    default:
      return "보통";
  }
};

export const generateReview = async (
  data: ReviewGenerationRequest
): Promise<ReviewGenerationResponse> => {
  const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!openaiApiKey) {
    throw new Error("OpenAI API 키가 설정되지 않았습니다.");
  }

  try {
    // 메뉴 정보를 문자열로 변환
    const menuInfo = data.menuItems
      .map((item) => `${item.name} ${item.price.toLocaleString()}원`)
      .join(", ");

    // 말투별 프롬프트 설정
    const toneInstruction = getToneInstruction(data.tone);

    // 별점을 만족도로 변환
    const satisfactionLevel = getSatisfactionLevel(data.rating);

    // OpenAI 프롬프트 구성
    let prompt = `다음 정보를 바탕으로 음식점 리뷰를 작성해주세요:

식당명: ${data.restaurantName}
주문 메뉴: ${menuInfo}
만족도: ${satisfactionLevel}
말투: ${data.tone}
${toneInstruction}

요구사항:
- 실제 방문한 것처럼 생생하게 작성
- 메뉴의 맛, 가격, 서비스에 대한 언급 포함
- 100-200자 정도의 적당한 길이
- 자연스럽고 진정성 있는 표현 사용`;

    // 추가 키워드가 있으면 포함
    if (data.additionalKeywords && data.additionalKeywords.trim()) {
      prompt += `\n- 다음 키워드를 자연스럽게 포함: ${data.additionalKeywords}`;
    }

    // OpenAI API 호출
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API 오류: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    const generatedReview = result.choices[0].message.content.trim();

    return { review: generatedReview };
  } catch (error: any) {
    console.error("OpenAI 리뷰 생성 중 오류:", error);
    throw new Error(`리뷰 생성에 실패했습니다: ${error.message}`);
  }
};

// 사용자 정보 수정 관련 타입 정의
export interface UserUpdateData {
  nickname: string;
  defaultStyleId?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface UserInfoResponse {
  userId: string;
  email: string;
  nickname: string;
  defaultStyleId: string;
  locationEnabled: string;
  reviewVisibility: string;
  createdAt: string;
}

// 사용자 정보 조회 API
export const getUserInfo = async (): Promise<UserInfoResponse> => {
  const response = await axiosInstance.get("/api/users/me");
  return response.data;
};

// 사용자 정보 수정 API (닉네임)
export const updateUserInfo = async (data: UserUpdateData): Promise<UserInfoResponse> => {
  const response = await axiosInstance.put("/api/users/me", data);
  return response.data;
};

// 비밀번호 변경 API
export const changePassword = async (data: PasswordChangeData): Promise<string> => {
  const response = await axiosInstance.put("/api/users/password", data);
  return response.data;
};

// 통합 리뷰 저장 관련 타입 정의
export interface CompleteReviewRequest {
  // OCR 정보
  ocrRestaurantName: string;
  ocrAddress: string;
  originalImg: string;
  receiptDate: string;
  ocrMenuItems: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  
  // 식당 정보
  restaurantName: string;
  restaurantCategory: string;
  restaurantAddress: string;
  locationId: string;
  
  // 리뷰 정보
  styleId: string;
  reviewContent: string;
  rating: number;
}

export interface CompleteReviewResponse {
  success: boolean;
  reviewId: string;
  receiptId: string;
  restaurantId: string;
  message: string;
}

// 통합 리뷰 저장 API
export const saveCompleteReview = async (data: CompleteReviewRequest): Promise<CompleteReviewResponse> => {
  const response = await axiosInstance.post("/api/reviews/complete", data);
  return response.data;
};

// 리뷰 관련 타입 정의
export interface MyReviewResponse {
  reviewId: string;
  userId: string;
  receiptId: string;
  styleId: string;
  restaurantId: string;
  locationId: string;
  content: string;
  rating: number;
  createdAt: string;
  // 조인된 정보들
  restaurantName: string;
  restaurantAddress: string;
  restaurantCategory: string;
  originalImg: string; // 영수증 이미지 Base64
  receiptDate: string;
}

// 사용자 상세 리뷰 목록 조회 API
export const getMyDetailedReviews = async (order: string = "latest"): Promise<MyReviewResponse[]> => {
  const response = await axiosInstance.get(`/api/reviews/me/detailed?order=${order}`);
  return response.data;
};

// 사용자 리뷰 목록 조회 API (기존)
export const getMyReviews = async (order: string = "latest"): Promise<MyReviewResponse[]> => {
  const response = await axiosInstance.get(`/api/reviews/me?order=${order}`);
  return response.data;
};

export default axiosInstance;
