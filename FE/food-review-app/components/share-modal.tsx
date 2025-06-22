"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Instagram, Facebook, Link, X } from "lucide-react"
import { useState } from "react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
}

export default function ShareModal({ isOpen, onClose, title, content }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const shareText = `${title}\n\n${content}`

  const handleKakaoShare = () => {
    // 실제로는 Kakao SDK 사용
    alert("카카오톡 공유 기능은 실제 환경에서 구현됩니다.")
    onClose()
  }

  const handleInstagramShare = () => {
    // 인스타그램은 직접 공유가 제한적이므로 클립보드 복사
    navigator.clipboard.writeText(shareText)
    alert("텍스트가 복사되었습니다. 인스타그램에 붙여넣기 해주세요!")
    onClose()
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, "_blank", "width=600,height=400")
    onClose()
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        onClose()
      }, 1000)
    } catch (error) {
      alert("링크 복사에 실패했습니다.")
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-md bg-white rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">공유하기</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={handleKakaoShare}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-yellow-800" />
            </div>
            <span className="text-xs font-medium text-center">카카오톡</span>
          </button>

          <button
            onClick={handleInstagramShare}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-center">Instagram</span>
          </button>

          <button
            onClick={handleFacebookShare}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Facebook className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-center">Facebook</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              <Link className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-center">{copied ? "복사됨!" : "링크 복사"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
