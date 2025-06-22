"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF5722] to-[#FF7043] flex items-center justify-center relative overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-40 right-16 w-3 h-3 bg-white/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-20 w-5 h-5 bg-white/25 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-white/40 rounded-full animate-bounce delay-700"></div>
      </div>

      {/* 메인 로고 */}
      <div className="text-center animate-in fade-in zoom-in duration-1000">
        <div className="mb-8 animate-pulse">
          <Image
            src="/images/splash.png"
            alt="FoodBuddy Splash"
            width={300}
            height={600}
            className="mx-auto"
            priority
          />
        </div>

        {/* 로딩 애니메이션 */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  )
}
