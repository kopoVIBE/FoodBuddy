"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Star, Save } from "lucide-react"
import Image from "next/image"
import { useApp } from "@/contexts/app-context"

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
  receiptImage?: string
}

interface ReviewEditModalProps {
  isOpen: boolean
  onClose: () => void
  review: Review | null
  onSave: (updatedReview: Review) => void
  className?: string
}

export default function ReviewEditModal({ isOpen, onClose, review, onSave, className = "" }: ReviewEditModalProps) {
  const { isDarkMode } = useApp()
  const [editedReview, setEditedReview] = useState<Review | null>(null)

  useEffect(() => {
    if (review) {
      setEditedReview({ ...review })
    }
  }, [review])

  if (!isOpen || !editedReview) return null

  const handleRatingChange = (newRating: number) => {
    setEditedReview({ ...editedReview, rating: newRating })
  }

  const handleSave = () => {
    if (editedReview) {
      onSave(editedReview)
    }
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${className}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`relative w-full max-w-md rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* 헤더 */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>리뷰 수정</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-4 space-y-4">
          {/* 음식점 이름 */}
          <div className="space-y-2">
            <Label className={isDarkMode ? "text-white" : "text-gray-900"}>음식점 이름</Label>
            <Input
              value={editedReview.restaurantName}
              onChange={(e) => setEditedReview({ ...editedReview, restaurantName: e.target.value })}
              className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>

          {/* 위치 */}
          <div className="space-y-2">
            <Label className={isDarkMode ? "text-white" : "text-gray-900"}>위치</Label>
            <Input
              value={editedReview.location}
              onChange={(e) => setEditedReview({ ...editedReview, location: e.target.value })}
              className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>

          {/* 평점 */}
          <div className="space-y-2">
            <Label className={isDarkMode ? "text-white" : "text-gray-900"}>평점</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => handleRatingChange(star)} className="p-1">
                  <Star
                    className={`w-6 h-6 ${
                      star <= editedReview.rating ? "fill-orange-400 text-orange-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div className="space-y-2">
            <Label className={isDarkMode ? "text-white" : "text-gray-900"}>리뷰 내용</Label>
            <Textarea
              value={editedReview.content}
              onChange={(e) => setEditedReview({ ...editedReview, content: e.target.value })}
              rows={6}
              className={`resize-none ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
              placeholder="리뷰 내용을 입력하세요..."
            />
          </div>

          {/* 영수증 이미지 */}
          {editedReview.receiptImage && (
            <div className="space-y-2">
              <Label className={isDarkMode ? "text-white" : "text-gray-900"}>영수증 이미지</Label>
              <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={editedReview.receiptImage || "/placeholder.svg"}
                  alt="영수증"
                  width={96}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* 태그 */}
          <div className="space-y-2">
            <Label className={isDarkMode ? "text-white" : "text-gray-900"}>태그</Label>
            <Input
              value={editedReview.tags.join(", ")}
              onChange={(e) =>
                setEditedReview({
                  ...editedReview,
                  tags: e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
              placeholder="태그를 쉼표로 구분하여 입력하세요"
              className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div
          className={`p-4 border-t flex gap-2 ${
            isDarkMode ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
          }`}
        >
          <Button
            variant="outline"
            className={`flex-1 ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}`}
            onClick={onClose}
          >
            취소
          </Button>
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            저장
          </Button>
        </div>
      </div>
    </div>
  )
}
