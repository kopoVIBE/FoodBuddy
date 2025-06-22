"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, Scan, Wand2, Copy, Share2, Download, Star, MapPin } from "lucide-react"
import Image from "next/image"

export default function WritePage() {
  const [step, setStep] = useState(1)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [ocrResult, setOcrResult] = useState("")
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "",
    location: "",
    verified: false,
  })
  const [reviewStyle, setReviewStyle] = useState("")
  const [generatedReview, setGeneratedReview] = useState("")
  const [rating, setRating] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setStep(2)
        // 실제로는 여기서 OCR API 호출
        setTimeout(() => {
          setOcrResult("맛있는 김치찌개\n서울시 강남구 테헤란로 123\n김치찌개 8,000원\n공기밥 1,000원\n총액: 9,000원")
          setStep(3)
        }, 2000)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // 실제로는 카메라 모달을 열고 촬영 기능 구현
      alert("카메라 기능은 실제 환경에서 구현됩니다.")
    } catch (error) {
      alert("카메라 접근 권한이 필요합니다.")
    }
  }

  const handleRestaurantVerification = () => {
    // 실제로는 Kakao/네이버 API 호출
    setTimeout(() => {
      setRestaurantInfo({
        name: "맛있는 김치찌개",
        location: "서울시 강남구 테헤란로 123",
        verified: true,
      })
      setStep(4)
    }, 1500)
  }

  const handleReviewGeneration = () => {
    // 실제로는 OpenAI API 호출
    setTimeout(() => {
      const reviews = {
        casual:
          "김치찌개 진짜 맛있었어요! 김치가 잘 익어서 깊은 맛이 나고, 국물도 시원하고 얼큰해서 좋았습니다. 밑반찬도 깔끔하게 나와서 만족스러웠어요. 가격도 합리적이고 다음에 또 올 것 같아요!",
        formal:
          "이곳의 김치찌개는 정말 훌륭했습니다. 잘 익은 김치로 만든 국물은 깊고 진한 맛을 자랑하며, 돼지고기도 부드럽고 맛있었습니다. 정갈하게 나온 밑반찬들과 함께 즐기니 더욱 만족스러운 식사였습니다.",
        trendy:
          "여기 김찌 진짜 레전드... 🔥 국물 맛이 미쳤고 고기도 완전 부드러워요! 사진 찍기도 예쁘고 인스타 올리기 딱 좋은 곳이에요 ✨ 강추합니다!",
      }
      setGeneratedReview(reviews[reviewStyle as keyof typeof reviews] || reviews.casual)
      setStep(5)
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReview)
    alert("리뷰가 클립보드에 복사되었습니다!")
  }

  const shareReview = () => {
    if (navigator.share) {
      navigator.share({
        title: `${restaurantInfo.name} 리뷰`,
        text: generatedReview,
      })
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-center">리뷰 작성</h1>
          <div className="flex justify-center mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`w-2 h-2 rounded-full mx-1 ${i <= step ? "bg-orange-500" : "bg-gray-300"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Step 1: 이미지 업로드 */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                영수증 사진 업로드
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">영수증 사진을 업로드하거나 촬영하세요</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    갤러리에서 선택
                  </Button>
                  <Button onClick={handleCameraCapture} variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    카메라로 촬영
                  </Button>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </CardContent>
          </Card>
        )}

        {/* Step 2: OCR 처리 중 */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5 animate-pulse" />
                영수증 분석 중...
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedImage && (
                <Image
                  src={uploadedImage || "/placeholder.svg"}
                  alt="업로드된 영수증"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">텍스트를 추출하고 있습니다...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: OCR 결과 및 음식점 검증 */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                추출된 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm font-medium">OCR 결과</Label>
                <pre className="text-sm mt-2 whitespace-pre-wrap">{ocrResult}</pre>
              </div>
              <Button
                onClick={handleRestaurantVerification}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <MapPin className="h-4 w-4 mr-2" />
                음식점 정보 확인
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: 리뷰 스타일 선택 */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                리뷰 스타일 선택
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {restaurantInfo.verified && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">음식점 확인됨</span>
                  </div>
                  <p className="text-sm text-green-700">{restaurantInfo.name}</p>
                  <p className="text-xs text-green-600">{restaurantInfo.location}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">평점</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="p-1">
                      <Star
                        className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">리뷰 스타일</Label>
                <Select value={reviewStyle} onValueChange={setReviewStyle}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="스타일을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">캐주얼</SelectItem>
                    <SelectItem value="formal">정중한</SelectItem>
                    <SelectItem value="trendy">트렌디</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleReviewGeneration}
                disabled={!reviewStyle || rating === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI 리뷰 생성
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 5: 생성된 리뷰 */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                생성된 리뷰
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{restaurantInfo.name}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-blue-800">{generatedReview}</p>
              </div>

              <Textarea
                value={generatedReview}
                onChange={(e) => setGeneratedReview(e.target.value)}
                rows={6}
                placeholder="리뷰를 수정할 수 있습니다..."
              />

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={copyToClipboard} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  복사
                </Button>
                <Button onClick={shareReview} variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  공유
                </Button>
              </div>

              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                리뷰 저장
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
