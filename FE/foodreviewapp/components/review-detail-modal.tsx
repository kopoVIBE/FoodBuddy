"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Star, MapPin, Calendar, Share2, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

interface Review {
  id: number
  restaurantName: string
  location: string
  rating: number
  date: string
  content: string
  image: string
  tags: string[]
  isFavorite: boolean
  restaurantId?: string // 즐겨찾기 기능을 위해 추가
}

interface ReviewDetailModalProps {
  isOpen: boolean
  onClose: () => void
  review: Review | null
  onShare: (title: string, content: string) => void
  onFavoriteToggle?: (restaurantId: string, isFavorited: boolean) => Promise<void>
  className?: string
}

export default function ReviewDetailModal({
  isOpen,
  onClose,
  review,
  onShare,
  onFavoriteToggle,
  className = "",
}: ReviewDetailModalProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    if (review) {
      setIsFavorited(review.isFavorite)
    }
  }, [review])

  if (!isOpen || !review) return null

  const handleShare = () => {
    onShare(review.restaurantName, review.content)
  }

  const handleFavoriteToggle = async () => {
    if (!review.restaurantId || !onFavoriteToggle || isToggling) return

    try {
      setIsToggling(true)
      await onFavoriteToggle(review.restaurantId, !isFavorited)
      setIsFavorited(!isFavorited)
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 ${className}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold"></h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 컨텐츠 */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* 이미지 */}
          <div className="relative">
            <Image
              src={review.image || "/placeholder.svg"}
              alt={review.restaurantName}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
          </div>

          <div className="p-4 space-y-4">
            {/* 음식점 정보 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xl font-bold text-gray-900">{review.restaurantName}</h4>
                {/* 즐겨찾기 하트 아이콘 */}
                <button
                  onClick={handleFavoriteToggle}
                  disabled={isToggling}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <Image
                    src={isFavorited ? "/icons/heart-filled.svg" : "/icons/heart-unfilled.svg"}
                    alt="즐겨찾기"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {review.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {review.date}
                </div>
              </div>
            </div>

            {/* 평점 */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= review.rating ? "fill-orange-400 text-orange-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="font-semibold text-lg">{review.rating}</span>
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-orange-100 text-orange-700">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* 리뷰 내용 */}
            <div>
              <p className="text-gray-700 leading-relaxed">{review.content}</p>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 bg-white flex gap-2">
          <Button className="flex-1 bg-[#EB4C34] hover:bg-[#d63e2a] text-white rounded-[10px]" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            공유
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-white border border-[#EB4C34] text-[#EB4C34] hover:bg-[#EB4C34]/10 rounded-[10px]"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>
    </div>
  )
}
