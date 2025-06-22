"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, PenTool, Map, Archive, Settings } from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/write", icon: PenTool, label: "작성" },
  { href: "/map", icon: Map, label: "지도" },
  { href: "/storage", icon: Archive, label: "저장소" },
  { href: "/settings", icon: Settings, label: "설정" },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors ${
                  isActive ? "text-orange-600 bg-orange-50" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
