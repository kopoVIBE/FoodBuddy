"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Upload, Copy, Share2, Star, Download } from "lucide-react"
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
    "여기 김치 진짜 레전드... 🔥 국물 맛이 미쳤고 고기도 완전 부드러워요! 사진 찍기도 예쁘고 인스타 올리기 딱 좋은 곳이에요 ✨ 강추합니다!",
  professional:
    "이곳의 김치찌개는 정말 훌륭했습니다. 잘 익은 김치로 만든 국물은 깊고 진한 맛을 자랑하며, 돼지고기도 부드럽고 맛있었습니다. 정갈하게 나온 밑반찬들과 함께 즐기니 더욱 만족스러운 식사였습니다.",
  simple: "김치찌개 맛있음. 국물 진하고 고기 부드러움. 재방문 의사 있음.",
  emotional:
    "따뜻한 김치찌개 한 그릇이 마음까지 따뜻하게 해주네요. 어머니가 끓여주시던 그 맛이 생각나는, 정말 정성스럽게 만든 음식이었습니다. 💕",
}

export default function WritePage() {
  const { t, isDarkMode } = useApp()
  const [selectedTone, setSelectedTone] = useState("friendly")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalStep, setModalStep] = useState(1)
  const [reviewText, setReviewText] = useState("")
  const [generatedReview, setGeneratedReview] = useState("")
  const [showGeneratedReview, setShowGeneratedReview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setShowModal(true)
        setModalStep(1)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleToneSelect = (toneId: string) => {
    // 영수증이 업로드되지 않은 경우 경고
    if (!uploadedImage) {
      alert("먼저 영수증을 업로드해주세요!")
      return
    }

    setSelectedTone(toneId)
    // 말투에 맞는 리뷰 생성
    const template = reviewTemplates[toneId as keyof typeof reviewTemplates]
    setGeneratedReview(template)
    setShowGeneratedReview(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReview)
    alert("리뷰가 클립보드에 복사되었습니다!")
  }

  const shareReview = () => {
    if (navigator.share) {
      navigator.share({
        title: "맛있는 김치찌개 리뷰",
        text: generatedReview,
      })
    } else {
      copyToClipboard()
    }
  }

  const saveReview = () => {
    // 리뷰 저장 로직
    alert("리뷰가 저장되었습니다!")
  }

  return (
    <div className={`min-h-screen pb-20 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* 헤더 - 단계 표시 제거 */}
      <div
        className={`shadow-sm border-b sticky top-0 z-10 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
      >
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className={`text-xl font-bold text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {t("reviewWriting")}
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 영수증 업로드 */}
        <Card
          className={`border-2 border-dashed ${
            isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
          }`}
        >
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
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>영수증이 업로드되었습니다</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={`w-16 h-16 rounded-lg mx-auto flex items-center justify-center ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className={`font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {t("receiptUpload")} ⬆
                  </h3>
                  <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    카메라로 영수증을 촬영하거나 갤러리에서 선택해주세요.
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white"
                    >
                      갤러리에서 선택
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full ${
                        isDarkMode
                          ? "border-white text-white hover:bg-gray-700 hover:text-white"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      카메라로 촬영
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </CardContent>
        </Card>

        {/* 말투 선택 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="FoodBuddy" width={24} height={24} className="w-6 h-6" />
            <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{t("selectTone")}</h3>
          </div>

          <div className="space-y-2">
            {toneOptions.map((option) => (
              <Button
                key={option.id}
                onClick={() => handleToneSelect(option.id)}
                className={`w-full justify-start ${
                  selectedTone === option.id
                    ? "bg-[#FF5722] hover:bg-[#E64A19] text-white"
                    : `${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-600" : "bg-white text-[#FF5722] border-[#FF5722]"} border`
                }`}
                variant={selectedTone === option.id ? "default" : "outline"}
              >
                {t(option.labelKey)}
              </Button>
            ))}
          </div>
        </div>

        {/* 생성된 리뷰 */}
        {showGeneratedReview && (
          <div className="space-y-4">
            <h3 className={`font-medium flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              ✨ {t("generatedReview")}
            </h3>

            <Card className={`${isDarkMode ? "bg-yellow-900/20 border-yellow-700" : "bg-yellow-50 border-yellow-200"}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>맛있는 김치찌개</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                  {generatedReview}
                </p>
              </CardContent>
            </Card>

            <Textarea
              value={generatedReview}
              onChange={(e) => setGeneratedReview(e.target.value)}
              rows={6}
              className={`resize-none ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : ""}`}
              placeholder="리뷰를 수정할 수 있습니다..."
            />

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className={isDarkMode ? "border-gray-600 text-white hover:bg-gray-700" : ""}
              >
                <Copy className="h-4 w-4 mr-2" />
                {t("copy")}
              </Button>
              <Button
                onClick={shareReview}
                variant="outline"
                className={isDarkMode ? "border-gray-600 text-white hover:bg-gray-700" : ""}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {t("share")}
              </Button>
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
      />
    </div>
  )
}
