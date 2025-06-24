"use client";

import { useApp } from "@/contexts/app-context";

export default function Loading() {
  const { isDarkMode } = useApp();

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-[#EB4C34] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#EB4C34] rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-[#EB4C34] rounded-full animate-bounce delay-200"></div>
        </div>
        <p
          className={`text-lg font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          지도를 불러오는 중..
        </p>
      </div>
    </div>
  );
}
