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
    hello: "안녕하세요! 마틸님",
    goodDay: "오늘도 맛있는 하루 되세요",
    writtenReviews: "작성한 리뷰",
    reviewsWithBuddy: "버디와 쓴 리뷰",
    latest: "최신순",
    oldest: "오래된순",
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
  },
  en: {
    home: "Home",
    map: "Map",
    write: "Write",
    statistics: "Stats",
    settings: "Settings",
    hello: "Hello! Matil",
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
