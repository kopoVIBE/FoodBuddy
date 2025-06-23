"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 3000) // 3초 = 3000ms

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF5722] to-[#FF7043] flex items-center justify-center relative overflow-hidden">
      {/* 메인 콘텐츠 */}
      <div className="text-center animate-in fade-in zoom-in duration-1000">
        {/* 로고 */}
        <div className="mb-8 animate-pulse">
          <Image
            src="/images/logo_splash.png"
            alt="FoodBuddy Logo"
            width={120}
            height={120}
            className="mx-auto drop-shadow-lg"
            priority
          />
        </div>

        {/* 앱 이름 */}
        <h1 className="text-4xl font-bold text-white mb-12 tracking-wide">FoodBuddy</h1>

        {/* 로딩 애니메이션 */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  )
}
