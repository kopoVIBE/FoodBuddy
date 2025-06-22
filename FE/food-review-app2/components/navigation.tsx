"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, MapPin, PenTool, BarChart3, User } from "lucide-react"
import { useApp } from "@/contexts/app-context"

export default function Navigation() {
  const pathname = usePathname()
  const { t, isDarkMode } = useApp()

  const navItems = [
    { href: "/", icon: Home, labelKey: "home" },
    { href: "/map", icon: MapPin, labelKey: "map" },
    { href: "/write", icon: PenTool, labelKey: "write", highlight: true },
    { href: "/storage", icon: BarChart3, labelKey: "statistics" },
    { href: "/settings", icon: User, labelKey: "settings" },
  ]

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 border-t z-50 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map(({ href, icon: Icon, labelKey, highlight }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${
                  isActive
                    ? "text-[#FF5722]"
                    : `${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"}`
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{t(labelKey)}</span>

                {/* 생성 버튼 말풍선 */}
                {highlight && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#FF5722] text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                      리뷰 만들기!
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#FF5722]"></div>
                    </div>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
