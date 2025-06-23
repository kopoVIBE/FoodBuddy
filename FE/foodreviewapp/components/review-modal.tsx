"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  step: number
  onStepChange: (step: number) => void
  uploadedImage: string | null
  onComplete?: () => void
}

export default function ReviewModal({
  isOpen,
  onClose,
  step,
  onStepChange,
  uploadedImage,
  onComplete,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "맛있는 김치찌개",
    address: "서울시 강남구 테헤란로 123",
    menu: "김치찌개",
    price: "8,000원",
    sideMenu: "공기밥",
    sidePrice: "1,000원",
    total: "9,000원",
  })

  // 수정 가능한 텍스트 상태
  const [editableText, setEditableText] = useState(
    `맛있는 김치찌개\n서울시 강남구 테헤란로 123\n김치찌개 8,000원\n공기밥 1,000원\n총액: 9,000원`,
  )

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

  // 수정완료 버튼 클릭 시
  const handleEditComplete = () => {
    onStepChange(3)
  }

  // 별점 완료 시
  const handleRatingComplete = () => {
    onComplete?.()
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="relative w-[370px] h-[250px]">
            <h3 className="absolute left-1/2 transform -translate-x-1/2 top-[29px] text-base font-semibold text-[#333333] leading-[19px]">
              정보와 일치한가요?
            </h3>

            <div className="absolute left-1/2 transform -translate-x-1/2 top-[62px] w-[328px] h-[106px] bg-[#EFEFEF] rounded-[10px]">
              <div className="absolute left-[11px] top-[9px] w-[306px] h-[79px] text-sm font-medium text-[#333333] leading-4 whitespace-pre-line">
                {editableText}
              </div>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 top-[182px] flex gap-3 w-[328px]">
              <Button
                onClick={handleYes}
                className="flex-1 bg-[#EB4C34] hover:bg-[#d63e2a] text-white rounded-[10px] h-[37px] font-bold text-sm"
              >
                예
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-[#EB4C34] text-[#EB4C34] hover:bg-[#EB4C34] hover:text-white rounded-[10px] h-[37px] font-bold text-sm"
                onClick={handleNo}
              >
                아니오
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="relative w-[370px] h-[250px]">
            <h3 className="absolute left-1/2 transform -translate-x-1/2 top-[29px] text-base font-semibold text-[#333333] leading-[19px]">
              정보를 수정해주세요
            </h3>

            <div className="absolute left-1/2 transform -translate-x-1/2 top-[62px] w-[328px] h-[106px] bg-[#EFEFEF] rounded-[10px] p-[11px]">
              <Textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                className="w-full h-full bg-transparent border-0 text-sm font-medium text-[#333333] leading-4 resize-none p-0 focus:ring-0 focus:outline-none"
                placeholder="정보를 입력하세요..."
              />
            </div>

            <Button
              onClick={handleEditComplete}
              className="absolute left-1/2 transform -translate-x-1/2 top-[182px] w-[328px] h-[37px] bg-[#EB4C34] hover:bg-[#d63e2a] text-white rounded-[10px] font-bold text-sm"
            >
              수정완료
            </Button>
          </div>
        )

      case 3:
        return (
          <div className="relative w-[370px] h-[250px]">
            <h3 className="absolute left-1/2 transform -translate-x-1/2 top-[43px] text-base font-semibold text-[#333333] leading-[19px] text-center">
              {restaurantInfo.name}의 별점을 남겨주세요.
            </h3>

            <div className="absolute left-1/2 transform -translate-x-1/2 top-[95px] flex gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="p-1">
                  <Star
                    className={`w-[35px] h-[35px] ${
                      star <= rating
                        ? "fill-[#FFDC17] text-[#FFDC17]"
                        : "fill-none text-[#BCBCBC] stroke-[#BCBCBC] stroke-1"
                    }`}
                  />
                </button>
              ))}
            </div>

            <Button
              onClick={handleRatingComplete}
              className="absolute left-1/2 transform -translate-x-1/2 top-[182px] w-[328px] h-[37px] bg-[#EB4C34] hover:bg-[#d63e2a] text-white rounded-[10px] font-bold text-sm"
            >
              다음
            </Button>
          </div>
        )

      case 4:
        return (
          <div className="relative w-[370px] h-[250px] flex flex-col items-center justify-center">
            {/* 아이콘 영역 - 로고와 편집 아이콘 함께 */}
            <div className="flex justify-center items-center gap-3 mb-4">
              <Image src="/logo.svg" alt="FoodBuddy Logo" width={48} height={48} className="w-12 h-12" />
              <Image src="/images/edit-icon.svg" alt="Edit Icon" width={39} height={43} className="w-10 h-11" />
            </div>

            {/* 메인 텍스트 */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">버디가 리뷰를 작성하고 있어요!</h3>
              <p className="text-sm text-gray-600">잠시만 기다려주세요.</p>
            </div>

            {/* 로딩 애니메이션 */}
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce delay-200"></div>
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
      <div className="relative bg-white rounded-[10px] overflow-hidden">{renderStep()}</div>
    </div>
  )
}
