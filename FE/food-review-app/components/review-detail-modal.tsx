"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Star, MapPin, Calendar, Share2, Edit } from "lucide-react"
import Image from "next/image"

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
}

interface ReviewDetailModalProps {
  isOpen: boolean
  onClose: () => void
  review: Review | null
  onShare: (title: string, content: string) => void
}

export default function ReviewDetailModal({ isOpen, onClose, review, onShare }: ReviewDetailModalProps) {
  if (!isOpen || !review) return null

  const handleShare = () => {
    onShare(review.restaurantName, review.content)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">리뷰 상세</h3>
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
              <h4 className="text-xl font-bold text-gray-900 mb-2">{review.restaurantName}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600">
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
              <h5 className="font-medium text-gray-900 mb-2">리뷰</h5>
              <p className="text-gray-700 leading-relaxed">{review.content}</p>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t bg-gray-50 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            공유
          </Button>
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
            <Edit className="h-4 w-4 mr-2" />
            수정
          </Button>
        </div>
      </div>
    </div>
  )
}
