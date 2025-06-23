"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"
import Image from "next/image"
import ReviewModal from "@/components/review-modal"
import { useApp } from "@/contexts/app-context"

const toneOptions = [
  { id: "friendly", labelKey: "friendlyTone" },
  { id: "professional", labelKey: "professionalTone" },
  { id: "simple", labelKey: "simpleTone" },
  { id: "emotional", labelKey: "emotionalTone" },
]

const reviewTemplates = {
  friendly:
    "김치찌개 진짜 맛있어요! 김치가 잘 익어서 깊은 맛이 나고, 돼지고기도 부드러웠어요. 밑반찬도 깔끔하고 맛있었습니다. 가격도 합리적이고 다음에 또 올 것 같아요! 추천합니다 👍",
  professional:
    "이곳의 김치찌개는 정말 훌륭했습니다. 잘 익은 김치로 만든 국물은 깊고 진한 맛을 자랑하며, 돼지고기도 부드럽고 맛있었습니다. 정갈하게 나온 밑반찬들과 함께 즐기니 더욱 만족스러운 식사였습니다.",
  simple: "김치찌개 맛있음. 국물 진하고 고기 부드러움. 재방문 의사 있음.",
  emotional:
    "따뜻한 김치찌개 한 그릇이 마음까지 따뜻하게 해주네요. 어머니가 끓여주시던 그 맛이 생각나는, 정말 정성스럽게 만든 음식이었습니다. 💕",
}

export default function WritePage() {
  const { t, isDarkMode } = useApp()
  const [selectedTone, setSelectedTone] = useState("")
  const [additionalWords, setAdditionalWords] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalStep, setModalStep] = useState(1)
  const [reviewText, setReviewText] = useState("")
  const [generatedReview, setGeneratedReview] = useState("")
  const [showGeneratedReview, setShowGeneratedReview] = useState(false)
  const [ocrCompleted, setOcrCompleted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        // 이미지 업로드 후 바로 OCR 확인 모달 표시
        setShowModal(true)
        setModalStep(1)
        setOcrCompleted(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleToneSelect = (toneId: string) => {
    setSelectedTone(toneId)
  }

  const handleNext = () => {
    if (!uploadedImage) {
      alert("먼저 영수증을 업로드해주세요!")
      return
    }
    if (!ocrCompleted) {
      alert("영수증 정보 확인을 완료해주세요!")
      return
    }
    if (!selectedTone) {
      alert("말투를 선택해주세요!")
      return
    }

    // 리뷰 작성 모달 표시
    setShowModal(true)
    setModalStep(4) // 바로 작성 단계로

    // 3초 후 모달 닫고 리뷰 생성
    setTimeout(() => {
      setShowModal(false)
      const template = reviewTemplates[selectedTone as keyof typeof reviewTemplates]
      let finalReview = template

      // 추가 단어가 있으면 리뷰에 포함
      if (additionalWords.trim()) {
        finalReview += ` ${additionalWords.trim()}`
      }

      setGeneratedReview(finalReview)
      setShowGeneratedReview(true)
    }, 3000)
  }

  const handleModalComplete = () => {
    setOcrCompleted(true)
    setShowModal(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReview)
    alert("리뷰가 클립보드에 복사되었습니다!")
  }

  const saveReview = () => {
    // 리뷰 저장 로직
    alert("리뷰가 저장되었습니다!")
  }

  return (
    <div className="min-h-screen pb-20 bg-white">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 영수증 업로드 */}
        <Card className="border-2 border-dashed border-gray-300 bg-white">
          <CardContent className="p-8 text-center">
            {uploadedImage ? (
              <div className="space-y-4">
                <Image
                  src={uploadedImage || "/placeholder.svg"}
                  alt="업로드된 영수증"
                  width={200}
                  height={150}
                  className="mx-auto rounded-lg"
                />
                <p className="text-sm text-gray-600">영수증이 업로드되었습니다 {ocrCompleted && "✓"}</p>
              </div>
            ) : (
              <div className="space-y-4 cursor-pointer" onClick={handleUploadClick}>
                <div>
                  <h3 className="font-medium mb-2 text-gray-900">영수증 업로드 ⬆</h3>
                  <p className="text-sm text-gray-600">카메라로 영수증을 촬영하거나 갤러리에서 선택해주세요.</p>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </CardContent>
        </Card>

        {/* 말투 선택 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="FoodBuddy" width={24} height={24} className="w-6 h-6" />
            <h3 className="font-medium text-gray-900">{t("selectTone")}</h3>
          </div>

          <div className="space-y-2">
            {toneOptions.map((option) => (
              <Button
                key={option.id}
                onClick={() => handleToneSelect(option.id)}
                disabled={!ocrCompleted}
                className={`w-full justify-start ${
                  selectedTone === option.id
                    ? "bg-[#FF5722] hover:bg-[#E64A19] text-white"
                    : "bg-white text-[#FF5722] border border-[#FF5722]"
                } ${!ocrCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
                variant={selectedTone === option.id ? "default" : "outline"}
              >
                {t(option.labelKey)}
              </Button>
            ))}
          </div>

          {/* 추가 단어/문장 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">넣고 싶은 단어나 문장이 있나요? (선택사항)</label>
            <Input
              value={additionalWords}
              onChange={(e) => setAdditionalWords(e.target.value)}
              disabled={!ocrCompleted}
              placeholder="예: 맛있어요, 친절해요, 분위기 좋아요..."
              className={`w-full ${!ocrCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>

          {/* 다음 단계 버튼 */}
          <Button
            onClick={handleNext}
            disabled={!uploadedImage || !selectedTone || !ocrCompleted}
            className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음 단계
          </Button>
        </div>

        {/* 생성된 리뷰 */}
        {showGeneratedReview && (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-gray-900">✨ {t("generatedReview")}</h3>

            {/* 수정 가능한 회색 텍스트 영역 */}
            <div className="relative">
              <div className="bg-gray-100 rounded-lg p-4">
                <Textarea
                  value={generatedReview}
                  onChange={(e) => setGeneratedReview(e.target.value)}
                  rows={6}
                  className="w-full bg-transparent border-0 text-sm leading-relaxed text-gray-800 resize-none p-0 focus:ring-0 focus:outline-none"
                  placeholder="리뷰를 수정할 수 있습니다..."
                />

                {/* 복사 아이콘 */}
                <button
                  onClick={copyToClipboard}
                  className="absolute bottom-3 right-3 p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Image src="/icons/copy.svg" alt="복사" width={13} height={14} className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <Button onClick={saveReview} className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white">
              <Download className="h-4 w-4 mr-2" />
              {t("saveReview")}
            </Button>
          </div>
        )}
      </div>

      {/* 리뷰 모달 */}
      <ReviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        step={modalStep}
        onStepChange={setModalStep}
        uploadedImage={uploadedImage}
        onComplete={handleModalComplete}
      />
    </div>
  )
}
