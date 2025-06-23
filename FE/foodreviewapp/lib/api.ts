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

export default axiosInstance;
