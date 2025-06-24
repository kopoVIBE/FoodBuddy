"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/map");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
          버디를 기다리는 중..
        </p>
      </div>
    </div>
  );
}
