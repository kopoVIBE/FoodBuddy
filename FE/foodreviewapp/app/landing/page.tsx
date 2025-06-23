"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setAnimationStep(1), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    // 프로토타입이므로 항상 성공
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true")
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 flex items-center justify-center p-4">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-md">
        {/* 로고 애니메이션 */}
        <div
          className={`text-center mb-8 transition-all duration-1000 ${
            animationStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-6">
            <Image
              src="/images/foodbuddy-logo.png"
              alt="FoodBuddy"
              width={150}
              height={75}
              className="mx-auto h-20 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FoodBuddy</h1>
          <p className="text-white/90 text-lg">AI가 도와주는 스마트한 리뷰 작성</p>
          <p className="text-white/80 text-sm mt-2">맛있는 순간을 기록하고 공유하세요</p>
        </div>

        {/* 로그인 카드 */}
        <Card
          className={`backdrop-blur-sm bg-white/95 border-0 shadow-2xl transition-all duration-1000 delay-500 ${
            animationStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{isLogin ? "로그인" : "회원가입"}</h2>
              <p className="text-gray-600">
                {isLogin ? "계정에 로그인하여 시작하세요" : "새 계정을 만들어 시작하세요"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input placeholder="이메일" className="pl-10" type="email" />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input placeholder="비밀번호" className="pl-10 pr-10" type={showPassword ? "text" : "password"} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input placeholder="비밀번호 확인" className="pl-10" type="password" />
                </div>
              )}

              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    로그인 중...
                  </div>
                ) : isLogin ? (
                  "로그인"
                ) : (
                  "회원가입"
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  {isLogin ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 정보 */}
        <div
          className={`text-center mt-6 transition-all duration-1000 delay-1000 ${
            animationStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-white/80 text-sm">📸 영수증 촬영 → 🤖 AI 리뷰 생성 → 📱 간편 공유</p>
        </div>
      </div>
    </div>
  )
}
