"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/contexts/app-context"

export default function Navigation() {
  const pathname = usePathname()
  const { t, isDarkMode } = useApp()

  const navItems = [
    { href: "/", icon: "/icons/home.svg", labelKey: "home" },
    { href: "/map", icon: "/icons/map.svg", labelKey: "map" },
    { href: "/write", icon: "/icons/write.svg", labelKey: "write", highlight: true },
    { href: "/storage", icon: "/icons/statistics.svg", labelKey: "statistics" },
    { href: "/settings", icon: "/icons/settings.svg", labelKey: "settings" },
  ]

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 border-t z-50 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map(({ href, icon, labelKey, highlight }) => {
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
                <Image
                  src={icon || "/placeholder.svg"}
                  alt={t(labelKey)}
                  width={20}
                  height={20}
                  className={`h-5 w-5 mb-1 ${
                    isActive
                      ? "brightness-0 saturate-100"
                      : isDarkMode
                        ? "brightness-0 invert opacity-60"
                        : "brightness-0 opacity-60"
                  }`}
                  style={{
                    filter: isActive
                      ? "brightness(0) saturate(100%) invert(35%) sepia(89%) saturate(1752%) hue-rotate(8deg) brightness(96%) contrast(95%)"
                      : undefined,
                  }}
                />
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
