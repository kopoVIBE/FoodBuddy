"use client";

import type React from "react";
import Navigation from "@/components/navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isShowingPageLevelSplash, setIsShowingPageLevelSplash] =
    useState(false);

  // 홈페이지에서 스플래시 화면이 표시되는지 체크
  useEffect(() => {
    if (pathname === "/") {
      // 클라이언트 사이드에서만 체크
      if (typeof window !== "undefined") {
        const authToken = localStorage.getItem("authToken");
        const hasShownSplash = localStorage.getItem("hasShownSplash");

        // 토큰이 있고 스플래시를 아직 안 봤으면 스플래시 표시 중
        if (authToken && !hasShownSplash) {
          setIsShowingPageLevelSplash(true);

          // 2초 후 스플래시 종료 (시간 단축)
          const timer = setTimeout(() => {
            setIsShowingPageLevelSplash(false);
          }, 2000);

          return () => clearTimeout(timer);
        }
      }
    }
    setIsShowingPageLevelSplash(false);
  }, [pathname]);

  // 스플래시 화면이거나 랜딩 페이지, 인증 페이지일 때는 네비게이션 숨김
  const hideNavigation =
    isShowingPageLevelSplash ||
    pathname === "/landing" ||
    pathname === "/splash" ||
    pathname === "/auth";

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
      {!hideNavigation && <Navigation />}
    </>
  );
}
