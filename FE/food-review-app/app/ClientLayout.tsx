"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
      setIsLoading(false)

      if (!loggedIn && pathname !== "/landing") {
        router.push("/landing")
      }
    }

    checkAuth()
  }, [pathname, router])

  if (isLoading) {
    return (
      <html lang="ko">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">로딩 중...</p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  if (!isLoggedIn && pathname !== "/landing") {
    return null
  }

  return (
    <html lang="ko">
      <head>
        <title>FoodBuddy - AI 리뷰 작성 도우미</title>
        <meta name="description" content="AI가 도와주는 스마트한 음식점 리뷰 작성 앱" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ea580c" />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">{children}</main>
        {isLoggedIn && pathname !== "/landing" && <Navigation />}
      </body>
    </html>
  )
}
