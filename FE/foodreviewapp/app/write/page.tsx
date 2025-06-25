"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Download, Star } from "lucide-react";
import Image from "next/image";
import ReviewModal from "@/components/review-modal";
import { useApp } from "@/contexts/app-context";
import { useRouter } from "next/navigation";
import {
  processOCR as apiProcessOCR,
  OCRResult,
  generateReview,
  ReviewGenerationRequest,
  saveCompleteReview,
  CompleteReviewRequest,
} from "@/lib/api";

const toneOptions = [
  { id: "friendly", labelKey: "friendlyTone" },
  { id: "professional", labelKey: "professionalTone" },
  { id: "simple", labelKey: "simpleTone" },
  { id: "emotional", labelKey: "emotionalTone" },
];

const reviewTemplates = {
  friendly:
    "김치찌개 진짜 맛있어요! 김치가 잘 익어서 깊은 맛이 나고, 돼지고기도 부드러웠어요. 밑반찬도 깔끔하고 맛있었습니다. 가격도 합리적이고 다음에 또 올 것 같아요! 추천합니다 👍",
  professional:
    "이곳의 김치찌개는 정말 훌륭했습니다. 잘 익은 김치로 만든 국물은 깊고 진한 맛을 자랑하며, 돼지고기도 부드럽고 맛있었습니다. 정갈하게 나온 밑반찬들과 함께 즐기니 더욱 만족스러운 식사였습니다.",
  simple: "김치찌개 맛있음. 국물 진하고 고기 부드러움. 재방문 의사 있음.",
  emotional:
    "따뜻한 김치찌개 한 그릇이 마음까지 따뜻하게 해주네요. 어머니가 끓여주시던 그 맛이 생각나는, 정말 정성스럽게 만든 음식이었습니다. 💕",
};

export default function WritePage() {
  const { t, isDarkMode, setNavigationDisabled } = useApp();
  const router = useRouter();
  const [selectedTone, setSelectedTone] = useState("");
  const [additionalWords, setAdditionalWords] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [generatedReview, setGeneratedReview] = useState("");
  const [showGeneratedReview, setShowGeneratedReview] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [rating, setRating] = useState(0);
  const [restaurantCategory, setRestaurantCategory] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OCR API 호출 함수 (Spring Boot 백엔드)
  const processOCR = async (file: File) => {
    setIsProcessingOCR(true);
    try {
      const result = await apiProcessOCR(file);
      setOcrResult(result);
      
      // OCR 처리 완료 후 자동으로 다음 단계로 이동
      setTimeout(() => {
        setModalStep(1); // 정보 확인 단계로 이동
      }, 1000); // 1초 후 자동 이동
    } catch (error: any) {
      console.error("=== OCR 처리 중 오류 ===");
      console.error("Error:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("========================");

      let errorMessage = t("ocrError");
      if (error.response?.status === 403) {
        errorMessage = t("serverAccessDenied");
      } else if (error.response?.status === 500) {
        errorMessage = t("serverInternalError");
      }

      alert(errorMessage + t("tryAgain"));
      setShowModal(false); // 오류 발생 시 모달 닫기
      setNavigationDisabled(false); // 오류 발생 시 네비게이션 활성화
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const resizeImage = (
    file: File,
    maxWidth: number = 800,
    quality: number = 0.7
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new window.Image();

      img.onload = () => {
        // 비율 유지하면서 크기 조정
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // 이미지 그리기
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Base64로 변환 (JPEG, 품질 70%)
        const resizedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(resizedBase64);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 크기 조정
      const resizedImage = await resizeImage(file);
      setUploadedImage(resizedImage);

      // OCR 처리 시작 전에 분석 모달 표시 및 네비게이션 비활성화
      setNavigationDisabled(true);
      setShowModal(true);
      setModalStep(5); // 영수증 분석 중 모달
      setOcrCompleted(false);

      // OCR 처리 시작 (원본 파일 사용)
      await processOCR(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleToneSelect = (toneId: string) => {
    setSelectedTone(toneId);
  };

  const handleNext = async () => {
    if (!uploadedImage) {
      alert(t("pleaseUploadReceipt"));
      return;
    }
    if (!ocrCompleted) {
      alert(t("pleaseCompleteOcr"));
      return;
    }
    if (!selectedTone) {
      alert(t("pleaseSelectTone"));
      return;
    }
    if (!rating) {
      alert(t("pleaseSelectRating"));
      return;
    }

    // 바로 리뷰 생성으로 이동
    await generateReviewContent();
  };

  const generateReviewContent = async () => {
    if (!ocrResult) {
      alert(t("noReceiptInfo"));
      return;
    }

    setNavigationDisabled(true); // 리뷰 생성 중 네비게이션 비활성화
    setShowModal(true);
    setModalStep(4);

    try {
      const reviewRequest: ReviewGenerationRequest = {
        restaurantName: ocrResult.restaurantName,
        menuItems: ocrResult.items,
        tone: selectedTone,
        rating: rating,
        additionalKeywords: additionalWords.trim() || undefined,
      };

      const response = await generateReview(reviewRequest);

      // 리뷰와 카테고리 저장
      setGeneratedReview(response.review);
      setRestaurantCategory(response.category);

      setTimeout(() => {
        setShowModal(false);
        setShowGeneratedReview(true);
        setNavigationDisabled(false); // 리뷰 생성 완료 후 네비게이션 활성화
      }, 3000);
    } catch (error: any) {
      console.error("리뷰 생성 중 오류:", error);

      // 오류 발생 시 기존 템플릿 사용
      setTimeout(() => {
        setShowModal(false);
        const template =
          reviewTemplates[selectedTone as keyof typeof reviewTemplates];
        let finalReview = template;

        // 추가 단어가 있으면 리뷰에 포함
        if (additionalWords.trim()) {
          finalReview += ` ${additionalWords.trim()}`;
        }

        setGeneratedReview(finalReview);
        setShowGeneratedReview(true);
        setNavigationDisabled(false); // 오류 처리 후에도 네비게이션 활성화

        // 사용자에게 알림
        alert(t("aiReviewFailed"));
      }, 3000);
    }
  };

  const handleModalComplete = () => {
    setOcrCompleted(true);
    setShowModal(false);
    setNavigationDisabled(false); // OCR 완료 후 네비게이션 활성화
  };

  const handleRatingFromModal = (modalRating: number) => {
    setRating(modalRating);
  };

  const copyToClipboard = async () => {
    try {
      // 최신 Clipboard API 사용 (HTTPS 환경에서만 작동)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedReview);
        alert(t("reviewCopied"));
      } else {
        // Fallback 방법: 임시 텍스트 영역 생성 후 복사
        const textArea = document.createElement('textarea');
        textArea.value = generatedReview;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          alert(t("reviewCopied"));
        } catch (err) {
          console.error('Fallback 복사 실패:', err);
          // 최후의 수단: 텍스트 선택 상태로 두기
          textArea.style.position = 'static';
          textArea.style.left = '0';
          textArea.style.top = '0';
          alert(t("copyNotSupported"));
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('클립보드 복사 오류:', error);
      alert(t("copyError"));
    }
  };

  const saveReview = async () => {
    if (!ocrResult || !selectedTone || !generatedReview) {
      alert(t("reviewSaveFailed"));
      return;
    }

    try {
      const ocrMenuItems = ocrResult.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: 1,
      }));

      const base64Data = uploadedImage ? uploadedImage.split(",")[1] : "";

      const reviewData: CompleteReviewRequest = {
        // OCR 정보
        ocrRestaurantName: ocrResult.restaurantName,
        ocrAddress: ocrResult.address || "",
        originalImg: base64Data,
        receiptDate: new Date().toISOString().split("T")[0],
        ocrMenuItems: ocrMenuItems,

        // 식당 정보
        restaurantName: ocrResult.restaurantName,
        restaurantCategory: restaurantCategory || "기타",
        restaurantAddress: ocrResult.address || "",
        locationId: "SEOUL",

        // 리뷰 정보
        styleId: selectedTone,
        reviewContent: generatedReview,
        rating: rating,
      };

      // API 호출
      const response = await saveCompleteReview(reviewData);

      if (response.success) {
        alert(t("reviewSaveSuccess"));
        
        // 홈 화면으로 이동
        router.push('/');
      } else {
        alert(t("reviewSaveFailed") + ": " + response.message);
      }
    } catch (error: any) {
      console.error("리뷰 저장 중 오류:", error);

      let errorMessage = "리뷰 저장 중 오류가 발생했습니다.";
      if (error.response?.status === 401) {
        errorMessage = t("loginRequired");
      } else if (error.response?.status === 400) {
        errorMessage = "잘못된 요청입니다. 입력 정보를 확인해주세요.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      alert(errorMessage);
    }
  };

  return (
    <div className={`min-h-screen pb-20 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 영수증 업로드 */}
        <Card className={`border-2 border-dashed ${isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"}`}>
          <CardContent className="p-8 text-center">
            {uploadedImage ? (
              <div 
                className="space-y-4 cursor-pointer"
                onClick={handleUploadClick}
              >
                <Image
                  src={uploadedImage || "/placeholder.svg"}
                  alt="업로드된 영수증"
                  width={200}
                  height={150}
                  className="mx-auto rounded-lg"
                />
                <div className="text-center">
                  {isProcessingOCR ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-[#FF5722] rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-[#FF5722] rounded-full animate-bounce delay-100"></div>
                        <div className="w-1 h-1 bg-[#FF5722] rounded-full animate-bounce delay-200"></div>
                      </div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {t("analyzingReceipt")}
                      </p>
                    </div>
                  ) : ocrResult ? (
                    <div className="space-y-1">
                      <p className="text-sm text-green-600">{t("receiptAnalysisComplete")}</p>
                      <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {t("clickToReupload")}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {t("receiptUploaded")}
                      </p>
                      <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {t("clickToReupload")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="space-y-4 cursor-pointer"
                onClick={handleUploadClick}
              >
                <div>
                  <h3 className={`font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {t("receiptUploadTitle")}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {t("receiptUploadDesc")}
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* 말투 선택 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="FoodBuddy"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {t("selectTone")}
            </h3>
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
                    : `${isDarkMode ? "bg-gray-800 text-[#FF5722] border-[#FF5722]" : "bg-white text-[#FF5722] border border-[#FF5722]"}`
                } ${!ocrCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
                variant={selectedTone === option.id ? "default" : "outline"}
              >
                {t(option.labelKey)}
              </Button>
            ))}
          </div>

          {/* 추가 단어/문장 입력 */}
          <div className="space-y-2">
            <label className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
              {t("additionalWordsLabel")}
            </label>
            <Input
              value={additionalWords}
              onChange={(e) => setAdditionalWords(e.target.value)}
              disabled={!ocrCompleted}
              placeholder={t("additionalWordsPlaceholder")}
              className={`w-full ${
                !ocrCompleted ? "opacity-50 cursor-not-allowed" : ""
              } ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""}`}
            />
          </div>

          {/* 다음 단계 버튼 */}
          <Button
            onClick={handleNext}
            disabled={
              !uploadedImage || !selectedTone || !ocrCompleted || !rating
            }
            className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("nextStep")}
          </Button>
        </div>

        {/* 생성된 리뷰 */}
        {showGeneratedReview && (
          <div className="space-y-4">
            <h3 className={`font-medium flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              ✨ {t("generatedReview")} ({t("rating")}: {rating}{t("ratingUnit")})
            </h3>

            {/* 수정 가능한 회색 텍스트 영역 */}
            <div className="relative">
              <div className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg p-4`}>
                <Textarea
                  value={generatedReview}
                  onChange={(e) => setGeneratedReview(e.target.value)}
                  rows={6}
                  className={`w-full bg-transparent border-0 text-sm leading-relaxed resize-none p-0 focus:ring-0 focus:outline-none ${
                    isDarkMode ? "text-gray-200 placeholder-gray-400" : "text-gray-800"
                  }`}
                  placeholder={t("reviewPlaceholder")}
                />

                {/* 복사 아이콘 */}
                <button
                  onClick={copyToClipboard}
                  className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${
                    isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                  }`}
                >
                  <Image
                    src="/icons/copy.svg"
                    alt={t("copy")}
                    width={13}
                    height={14}
                    className="w-3.5 h-3.5"
                  />
                </button>
              </div>
            </div>

            <Button
              onClick={saveReview}
              className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white"
            >
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
        ocrResult={ocrResult}
        isProcessingOCR={isProcessingOCR}
        onComplete={handleModalComplete}
        onRatingChange={handleRatingFromModal}
      />
    </div>
  );
}
