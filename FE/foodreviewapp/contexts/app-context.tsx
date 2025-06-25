"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface AppContextType {
  isDarkMode: boolean;
  language: string;
  nickname: string | null;
  isAuthenticated: boolean;
  isNavigationDisabled: boolean;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
  setUserInfo: (nickname: string, token: string) => void;
  logout: () => void;
  setNavigationDisabled: (disabled: boolean) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations = {
  ko: {
    home: "홈",
    map: "지도",
    write: "생성",
    statistics: "통계",
    settings: "설정",
    hello: "안녕하세요!",
    goodDay: "오늘도 맛있는 하루 되세요",
    writtenReviews: "작성한 리뷰",
    reviewsWithBuddy: "버디와 쓴 리뷰",
    latest: "최신순",
    oldest: "오래된순",
    favorite: "즐겨찾기",
    alphabetical: "가나다순",
    reviewWriting: "리뷰 작성",
    receiptUpload: "영수증 업로드",
    selectTone: "버디의 말투를 선택해주세요",
    friendlyTone: "친근한 말투",
    professionalTone: "전문가 말투",
    simpleTone: "간단명료한 말투",
    emotionalTone: "감성적인 말투",
    reviewContent: "리뷰 내용",
    generatedReview: "생성된 리뷰",
    copy: "복사",
    share: "공유",
    saveReview: "리뷰 저장",
    guest: "게스트",
    loading: "로딩 중...",
    emailNotAvailable: "이메일 정보를 불러올 수 없습니다",
    loginRequired: "로그인이 필요합니다",
    changeNickname: "닉네임 변경",
    changePassword: "비밀번호 변경",
    termsOfService: "이용약관",
    privacyPolicy: "개인정보처리방침",
    checkTerms: "서비스 이용약관 확인",
    checkPrivacy: "개인정보 처리방침 확인",
    language: "언어",
    korean: "한국어",
    english: "English",
    view: "보기",
    logout: "로그아웃",
    copyright: "2025 FoodReview & Yoriview. All rights reserved.",
    version: "Version 1.0.0",
    buddyReviewsCount: "버디가 남긴 맛집 리뷰",
    reviewsCountUnit: "개",
    buddyFavoriteRestaurants: "버디가 자주 가는 단골 맛집",
    favoriteRestaurantsUnit: "곳이에요!",
    loadingReviews: "리뷰를 불러오는 중...",
    noReviewsYet: "아직 작성한 리뷰가 없습니다.",
    createReviewWithBuddy: "버디와 리뷰를 생성하러 가 볼까요?",
    writeFirstReview: "첫 리뷰 작성하기",
    loadingFavorites: "즐겨찾기를 불러오는 중...",
    noFavorites: "즐겨찾기가 없습니다",
    addFavoriteRestaurants: "마음에 드는 음식점을 즐겨찾기에 추가해보세요",
    visitCount: "방문 횟수",
    visitCountUnit: "회",
    lastVisit: "최근 방문",
    receiptUploadTitle: "영수증 업로드 ⬆",
    receiptUploadDesc: "카메라로 영수증을 촬영하거나 갤러리에서 선택해주세요.",
    analyzingReceipt: "영수증 분석 중...",
    receiptAnalysisComplete: "영수증 분석 완료 ✓",
    clickToReupload: "클릭하여 다시 업로드",
    receiptUploaded: "영수증이 업로드되었습니다",
    additionalWordsLabel: "넣고 싶은 단어나 문장이 있나요? (선택사항)",
    additionalWordsPlaceholder: "예: 맛있어요, 친절해요, 분위기 좋아요...",
    nextStep: "다음 단계",
    reviewPlaceholder: "리뷰를 수정할 수 있습니다...",
    rating: "별점",
    ratingUnit: "점",
    pleaseUploadReceipt: "먼저 영수증을 업로드해주세요!",
    pleaseCompleteOcr: "영수증 정보 확인을 완료해주세요!",
    pleaseSelectTone: "말투를 선택해주세요!",
    pleaseSelectRating: "별점을 선택해주세요!",
    noReceiptInfo: "영수증 정보가 없습니다!",
    reviewSaveSuccess: "리뷰가 성공적으로 저장되었습니다!",
    reviewSaveFailed: "리뷰 저장에 필요한 정보가 부족합니다.",
    reviewCopied: "리뷰가 클립보드에 복사되었습니다!",
    copyNotSupported: "복사 기능을 사용할 수 없습니다. 텍스트를 직접 선택해서 복사해주세요.",
    copyError: "복사 중 오류가 발생했습니다. 텍스트를 직접 선택해서 복사해주세요.",
    aiReviewFailed: "AI 리뷰 생성에 실패하여 기본 템플릿을 사용합니다.",
    ocrError: "영수증 인식 중 오류가 발생했습니다.",
    serverAccessDenied: "서버 접근이 거부되었습니다. CORS 설정을 확인해주세요.",
    serverInternalError: "서버 내부 오류가 발생했습니다.",
    tryAgain: " 다시 시도해주세요.",
    confirmDelete: "정말 삭제하시겠습니까?",
    all: "전체",
    loadingStats: "통계를 불러오는 중...",
    monthUnit: "월",
    reviewUnit: "개",
    reviewsUnit: "개 리뷰",
    timesUnit: "회",
    myStats: "나의 통계",
    totalReviews: "총 리뷰 수",
    averageRating: "평균 평점",
    thisMonthReviews: "이번 달 리뷰",
    categoryDistribution: "카테고리별 분포",
    monthlyReviews: "월별 리뷰 수",
    ratingDistribution: "평점 분포",
    topRestaurants: "자주 방문한 맛집",
    visitTimes: "방문",
    percentage: "%",
    noData: "데이터가 없습니다",
    chinese: "중식",
    japanese: "일식",
    western: "양식",
    cafe: "카페",
    other: "기타",
  },
  en: {
    home: "Home",
    map: "Map",
    write: "Write",
    statistics: "Stats",
    settings: "Settings",
    hello: "Hello!!",
    favorite: "Favorite",
    goodDay: "Have a delicious day",
    writtenReviews: "Written Reviews",
    reviewsWithBuddy: "Reviews with Buddy",
    latest: "Latest",
    oldest: "Oldest",
    alphabetical: "A-Z",
    reviewWriting: "Review Writing",
    receiptUpload: "Receipt Upload",
    selectTone: "Select Buddy's tone",
    friendlyTone: "Friendly Tone",
    professionalTone: "Professional Tone",
    simpleTone: "Simple Tone",
    emotionalTone: "Emotional Tone",
    reviewContent: "Review Content",
    generatedReview: "Generated Review",
    copy: "Copy",
    share: "Share",
    saveReview: "Save Review",
    guest: "Guest",
    loading: "Loading...",
    emailNotAvailable: "Unable to load email information",
    loginRequired: "Login required",
    changeNickname: "Change Nickname",
    changePassword: "Change Password",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    checkTerms: "Check Terms of Service",
    checkPrivacy: "Check Privacy Policy",
    language: "Language",
    korean: "한국어",
    english: "English",
    view: "View",
    logout: "Logout",
    copyright: "2025 FoodReview & Yoriview. All rights reserved.",
    version: "Version 1.0.0",
    buddyReviewsCount: "Restaurant reviews by Buddy",
    reviewsCountUnit: "",
    buddyFavoriteRestaurants: "Buddy's favorite restaurants",
    favoriteRestaurantsUnit: "places!",
    loadingReviews: "Loading reviews...",
    noReviewsYet: "No reviews written yet.",
    createReviewWithBuddy: "Want to create your first review with Buddy?",
    writeFirstReview: "Write First Review",
    loadingFavorites: "Loading favorites...",
    noFavorites: "No favorites yet",
    addFavoriteRestaurants: "Add your favorite restaurants to see them here",
    visitCount: "Visit count",
    visitCountUnit: " times",
    lastVisit: "Last visit",
    receiptUploadTitle: "Upload Receipt ⬆",
    receiptUploadDesc: "Take a photo of your receipt or select from gallery.",
    analyzingReceipt: "Analyzing receipt...",
    receiptAnalysisComplete: "Receipt analysis complete ✓",
    clickToReupload: "Click to upload again",
    receiptUploaded: "Receipt uploaded successfully",
    additionalWordsLabel: "Any words or phrases you'd like to include? (Optional)",
    additionalWordsPlaceholder: "e.g. Delicious, Great service, Nice atmosphere...",
    nextStep: "Next Step",
    reviewPlaceholder: "You can edit the review...",
    rating: "Rating",
    ratingUnit: " stars",
    pleaseUploadReceipt: "Please upload a receipt first!",
    pleaseCompleteOcr: "Please complete receipt information verification!",
    pleaseSelectTone: "Please select a tone!",
    pleaseSelectRating: "Please select a rating!",
    noReceiptInfo: "No receipt information available!",
    reviewSaveSuccess: "Review saved successfully!",
    reviewSaveFailed: "Insufficient information to save review.",
    reviewCopied: "Review copied to clipboard!",
    copyNotSupported: "Copy function not supported. Please select and copy the text manually.",
    copyError: "Error occurred while copying. Please select and copy the text manually.",
    aiReviewFailed: "AI review generation failed. Using default template.",
    ocrError: "Error occurred while recognizing receipt.",
    serverAccessDenied: "Server access denied. Please check CORS settings.",
    serverInternalError: "Internal server error occurred.",
    tryAgain: " Please try again.",
    confirmDelete: "Are you sure you want to delete this?",
    all: "All",
    loadingStats: "Loading statistics...",
    monthUnit: "",
    reviewUnit: "",
    reviewsUnit: " reviews",
    timesUnit: " times",
    myStats: "My Statistics",
    totalReviews: "Total Reviews",
    averageRating: "Average Rating",
    thisMonthReviews: "This Month's Reviews",
    categoryDistribution: "Category Distribution",
    monthlyReviews: "Monthly Reviews",
    ratingDistribution: "Rating Distribution",
    topRestaurants: "Top Visited Restaurants",
    visitTimes: "Visits",
    percentage: "%",
    noData: "No data available",
    chinese: "Chinese",
    japanese: "Japanese",
    western: "Western",
    cafe: "Cafe",
    other: "Other",
  },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguageState] = useState("ko");
  const [nickname, setNickname] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNavigationDisabled, setIsNavigationDisabled] = useState(false);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== "undefined") {
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      const savedLanguage = localStorage.getItem("language") || "ko";
      const savedNickname = localStorage.getItem("nickname");
      const authToken = localStorage.getItem("accessToken");

      setIsDarkMode(savedDarkMode);
      setLanguageState(savedLanguage);
      setNickname(savedNickname);
      setIsAuthenticated(!!authToken);

      if (savedDarkMode) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // 사용자 정보 설정 (로그인 시 호출)
  const setUserInfo = (userNickname: string, token: string) => {
    setNickname(userNickname);
    setIsAuthenticated(true);
    localStorage.setItem("nickname", userNickname);
    localStorage.setItem("accessToken", token);
    // 로그인 시 스플래시를 다시 보여주기 위해 hasShownSplash 제거
    localStorage.removeItem("hasShownSplash");
  };

  // 로그아웃
  const logout = () => {
    setNickname(null);
    setIsAuthenticated(false);
    localStorage.removeItem("nickname");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("hasShownSplash");
  };

  const t = (key: string): string => {
    return (
      translations[language as keyof typeof translations]?.[
        key as keyof typeof translations.ko
      ] || key
    );
  };

  const setNavigationDisabled = (disabled: boolean) => {
    setIsNavigationDisabled(disabled);
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        language,
        nickname,
        isAuthenticated,
        isNavigationDisabled,
        toggleDarkMode,
        setLanguage,
        setUserInfo,
        logout,
        setNavigationDisabled,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
