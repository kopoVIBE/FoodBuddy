"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  step: number
  onStepChange: (step: number) => void
  uploadedImage: string | null
}

export default function ReviewModal({ isOpen, onClose, step, onStepChange, uploadedImage }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "맛있는 김치찌개",
    address: "서울시 강남구 테헤란로 123",
    menu: "김치찌개",
    price: "8,000원",
    total: "9,000원",
  })

  if (!isOpen) return null

  const handleNext = () => {
    if (step < 4) {
      onStepChange(step + 1)
    }
  }

  // "네" 선택 시 바로 별점 단계(3단계)로 이동
  const handleYes = () => {
    onStepChange(3)
  }

  // "아니요" 선택 시 수정 단계(2단계)로 이동
  const handleNo = () => {
    onStepChange(2)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">정보가 맞나요?</h3>
            <div className="text-left space-y-2 text-sm">
              <p>맛있는 김치찌개</p>
              <p>서울시 강남구 테헤란로 123</p>
              <p>김치찌개 8,000원</p>
              <p>공기밥 1,000원</p>
              <p>총액: 9,000원</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleYes} className="flex-1 bg-[#FF5722] hover:bg-[#E64A19]">
                네
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleNo}>
                아니요
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">정보를 수정해주세요</h3>
            <div className="space-y-3 text-left">
              <div>
                <label className="text-sm text-gray-600">가게명</label>
                <Input
                  value={restaurantInfo.name}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">주소</label>
                <Input
                  value={restaurantInfo.address}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleNext} className="w-full bg-[#FF5722] hover:bg-[#E64A19]">
              수정완료
            </Button>
          </div>
        )

      case 3:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">맛있는 김치찌개의 별점을 남겨주세요.</h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="p-1">
                  <Star className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
            <Button onClick={handleNext} className="w-full bg-[#FF5722] hover:bg-[#E64A19]">
              다음
            </Button>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Image src="/images/logo.png" alt="FoodBuddy" width={32} height={32} className="w-8 h-8 animate-bounce" />
              <div className="animate-pulse">
                <span className="text-lg font-medium">✏️</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold">버디가 리뷰를 작성하고 있어요!</h3>
            <p className="text-sm text-gray-600">잠시만 기다려주세요.</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-[#FF5722] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#FF5722] rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-[#FF5722] rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl p-6">{renderStep()}</div>
    </div>
  )
}
