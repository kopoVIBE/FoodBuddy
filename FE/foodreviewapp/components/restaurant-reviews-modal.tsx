"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Star, MapPin } from "lucide-react"
import Image from "next/image"

interface Review {
  id: number
  restaurantName: string
  location: string
  rating: number
  date: string
  content: string
  image?: string
  tags: string[]
  receiptImage?: string
}

interface RestaurantReviewsModalProps {
  isOpen: boolean
  onClose: () => void
  restaurantName: string
  reviews: Review[]
  className?: string
}

export default function RestaurantReviewsModal({
  isOpen,
  onClose,
  restaurantName,
  reviews,
  className = "",
}: RestaurantReviewsModalProps) {
  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 ${className}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 bg-white sticky top-0 z-10">
          <h3 className="text-[18px] font-semibold">{restaurantName} 리뷰</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 리뷰 목록 */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(85vh-200px)]">
          {reviews.map((review) => (
            <Card key={review.id} className="border-0 shadow-sm bg-gray-50">
              <CardContent className="p-4">
                {/* 상단 영역: 별점, 날짜 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* 별점 */}
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-[14px] h-[14px] ${i < review.rating ? "fill-[#FFDC17] text-[#FFDC17]" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-[13px] font-medium text-gray-900">{review.rating}</span>
                  </div>

                  {/* 날짜 */}
                  <span className="text-[10px] text-[#BCBCBC] font-normal">{review.date}</span>
                </div>

                {/* 위치 정보 */}
                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="w-[14px] h-[14px] text-[#BCBCBC]" />
                  <span className="text-[10px] text-[#BCBCBC] font-normal">{review.location}</span>
                </div>

                {/* 리뷰 내용 */}
                <div className="mb-3">
                  <p className="text-[14px] leading-5 font-light text-[#333333]">{review.content}</p>
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {review.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* 영수증 이미지 */}
                {review.receiptImage && (
                  <div className="flex justify-end">
                    <div className="w-[65px] h-[65px] bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={review.receiptImage || "/placeholder.svg"}
                        alt="영수증"
                        width={65}
                        height={65}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[13px] text-gray-500">아직 작성된 리뷰가 없습니다.</p>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 bg-white mb-4">
          <Button className="w-full bg-[#EB4C34] hover:bg-[#d63e2a] text-white rounded-[10px] text-[15px]">
            새 리뷰 작성하기
          </Button>
        </div>
      </div>
    </div>
  )
}
