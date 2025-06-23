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
  const [showSplash, setShowSplash] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 환경인지 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 클라이언트에서만 스플래시 화면 로직 실행
  useEffect(() => {
    if (!isClient) return;

    // 홈페이지에서만 스플래시 화면 체크
    if (pathname === "/") {
      // localStorage에서 스플래시 표시 여부 확인
      const hasShownSplash = localStorage.getItem("hasShownSplash");

      if (!hasShownSplash) {
        // 처음 실행이면 스플래시 표시
        setShowSplash(true);

        // 3초 후 스플래시 화면 숨기고 localStorage에 기록
        const timer = setTimeout(() => {
          setShowSplash(false);
          localStorage.setItem("hasShownSplash", "true");
        }, 3000);

        return () => clearTimeout(timer);
      } else {
        // 이미 스플래시를 본 적이 있으면 바로 메인 화면
        setShowSplash(false);
      }
    } else {
      setShowSplash(false);
    }
  }, [pathname, isClient]);

  // 스플래시 화면이거나 랜딩 페이지일 때는 네비게이션 숨김
  const hideNavigation =
    showSplash || pathname === "/landing" || pathname === "/splash";

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
      {!hideNavigation && <Navigation />}
    </>
  );
}
