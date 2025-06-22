"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Star, MapPin, Clock, Phone, Navigation, PenTool } from "lucide-react"

interface Restaurant {
  id: number
  name: string
  category: string
  rating?: number
  visitCount?: number
  lastVisit?: string
  avgRating?: number
  address?: string
  phone?: string
  hours?: string
}

interface RestaurantDetailModalProps {
  isOpen: boolean
  onClose: () => void
  restaurant: Restaurant | null
}

export default function RestaurantDetailModal({ isOpen, onClose, restaurant }: RestaurantDetailModalProps) {
  if (!isOpen || !restaurant) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">음식점 정보</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-4 space-y-4">
          {/* 음식점 기본 정보 */}
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h4>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {restaurant.category}
              </Badge>
              {restaurant.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                  <span className="font-medium">{restaurant.rating}</span>
                </div>
              )}
            </div>
          </div>

          {/* 방문 통계 */}
          {restaurant.visitCount && (
            <div className="bg-orange-50 p-3 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">방문 기록</h5>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  총 방문 횟수: <span className="font-medium text-orange-600">{restaurant.visitCount}회</span>
                </p>
                {restaurant.lastVisit && <p>최근 방문: {restaurant.lastVisit}</p>}
                {restaurant.avgRating && (
                  <p>
                    평균 평점: <span className="font-medium text-orange-600">{restaurant.avgRating}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 연락처 정보 */}
          <div className="space-y-3">
            {restaurant.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">주소</p>
                  <p className="text-sm text-gray-600">{restaurant.address}</p>
                </div>
              </div>
            )}

            {restaurant.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">전화번호</p>
                  <p className="text-sm text-gray-600">{restaurant.phone}</p>
                </div>
              </div>
            )}

            {restaurant.hours && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">영업시간</p>
                  <p className="text-sm text-gray-600">{restaurant.hours}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t bg-gray-50 flex gap-2">
          <Button variant="outline" className="flex-1">
            <Navigation className="h-4 w-4 mr-2" />
            길찾기
          </Button>
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
            <PenTool className="h-4 w-4 mr-2" />
            리뷰 작성
          </Button>
        </div>
      </div>
    </div>
  )
}
