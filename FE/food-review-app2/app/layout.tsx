import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import { AppProvider } from "@/contexts/app-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FoodBuddy - AI 리뷰 작성 도우미",
  description: "AI가 도와주는 스마트한 음식점 리뷰 작성 앱",
  manifest: "/manifest.json",
  themeColor: "#FF5722",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AppProvider>
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</main>
          <Navigation />
        </AppProvider>
      </body>
    </html>
  )
}
