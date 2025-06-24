"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface OCRResult {
  text: string;
  restaurantName: string;
  items: Array<{ name: string; price: number }>;
  total: number;
  address?: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: number;
  onStepChange: (step: number) => void;
  uploadedImage: string | null;
  ocrResult?: OCRResult | null;
  isProcessingOCR?: boolean;
  onComplete?: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  step,
  onStepChange,
  uploadedImage,
  ocrResult,
  isProcessingOCR,
  onComplete,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);

  // 구조화된 데이터 상태 관리
  const [editableData, setEditableData] = useState({
    restaurantName: "",
    address: "",
    items: [] as Array<{ name: string; price: number }>,
    total: 0,
  });

  // OCR 결과가 변경될 때마다 편집 가능한 데이터 업데이트
  useEffect(() => {
    if (ocrResult) {
      setEditableData({
        restaurantName: ocrResult.restaurantName || "",
        address: ocrResult.address || "",
        items: ocrResult.items || [],
        total: ocrResult.total || 0,
      });
    }
  }, [ocrResult]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      onStepChange(step + 1);
    }
  };

  // "네" 선택 시 바로 별점 단계(3단계)로 이동
  const handleYes = () => {
    onStepChange(3);
  };

  // "아니요" 선택 시 수정 단계(2단계)로 이동
  const handleNo = () => {
    onStepChange(2);
  };

  // 수정완료 버튼 클릭 시
  const handleEditComplete = () => {
    onStepChange(3);
  };

  // 별점 완료 시
  const handleRatingComplete = () => {
    onComplete?.();
  };

  // 메뉴 항목 추가
  const addMenuItem = () => {
    setEditableData({
      ...editableData,
      items: [...editableData.items, { name: "", price: 0 }],
    });
  };

  // 메뉴 항목 삭제
  const removeMenuItem = (index: number) => {
    const newItems = editableData.items.filter((_, i) => i !== index);
    setEditableData({
      ...editableData,
      items: newItems,
    });
  };

  // 메뉴 항목 수정
  const updateMenuItem = (
    index: number,
    field: "name" | "price",
    value: string | number
  ) => {
    const newItems = [...editableData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditableData({
      ...editableData,
      items: newItems,
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        if (isProcessingOCR) {
          return (
            <div className="relative w-[370px] h-[250px] flex flex-col items-center justify-center">
              <h3 className="text-base font-semibold text-[#333333] mb-4">
                영수증을 분석하고 있어요...
              </h3>

              {/* 로딩 애니메이션 */}
              <div className="flex justify-center space-x-1 mb-4">
                <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce delay-200"></div>
              </div>

              <p className="text-sm text-gray-600 text-center">
                잠시만 기다려주세요
              </p>
            </div>
          );
        }

        return (
          <div className="relative w-[400px] h-[300px] p-4">
            <h3 className="text-center text-base font-semibold text-[#333333] mb-4">
              정보와 일치한가요?
            </h3>

            <div className="bg-[#EFEFEF] rounded-[10px] p-4 mb-4 space-y-3 max-h-[180px] overflow-y-auto">
              {/* 상호명 */}
              <div>
                <span className="text-xs font-medium text-gray-600">
                  상호명
                </span>
                <div className="text-sm font-medium text-[#333333]">
                  {editableData.restaurantName || "정보 없음"}
                </div>
              </div>

              {/* 주소 */}
              <div>
                <span className="text-xs font-medium text-gray-600">주소</span>
                <div className="text-sm font-medium text-[#333333]">
                  {editableData.address || "정보 없음"}
                </div>
              </div>

              {/* 메뉴 */}
              <div>
                <span className="text-xs font-medium text-gray-600">메뉴</span>
                <div className="space-y-1">
                  {editableData.items.length > 0 ? (
                    editableData.items.map((item, index) => (
                      <div
                        key={index}
                        className="text-sm font-medium text-[#333333] flex justify-between"
                      >
                        <span>{item.name}</span>
                        <span>{item.price.toLocaleString()}원</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">메뉴 정보 없음</div>
                  )}
                </div>
              </div>

              {/* 총액 */}
              <div className="border-t pt-2">
                <div className="text-sm font-bold text-[#333333] flex justify-between">
                  <span>총액</span>
                  <span>{editableData.total.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
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
        );

      case 2:
        return (
          <div className="relative w-[450px] h-[600px] p-4 flex flex-col">
            <h3 className="text-center text-base font-semibold text-[#333333] mb-4">
              정보를 수정해주세요
            </h3>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {/* 상호명 수정 */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  상호명
                </label>
                <Input
                  value={editableData.restaurantName}
                  onChange={(e) =>
                    setEditableData({
                      ...editableData,
                      restaurantName: e.target.value,
                    })
                  }
                  className="text-sm"
                  placeholder="상호명을 입력하세요"
                />
              </div>

              {/* 주소 수정 */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  주소
                </label>
                <Input
                  value={editableData.address}
                  onChange={(e) =>
                    setEditableData({
                      ...editableData,
                      address: e.target.value,
                    })
                  }
                  className="text-sm"
                  placeholder="주소를 입력하세요"
                />
              </div>

              {/* 메뉴 수정 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-gray-600">
                    메뉴
                  </label>
                  <Button
                    onClick={addMenuItem}
                    className="text-xs px-2 py-1 h-auto bg-[#EB4C34] hover:bg-[#d63e2a]"
                  >
                    추가
                  </Button>
                </div>
                <div className="space-y-3">
                  {editableData.items.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500 block mb-1">
                            메뉴명
                          </label>
                          <Input
                            value={item.name}
                            onChange={(e) =>
                              updateMenuItem(index, "name", e.target.value)
                            }
                            className="text-sm"
                            placeholder="메뉴명"
                          />
                        </div>
                        <div className="w-28">
                          <label className="text-xs text-gray-500 block mb-1">
                            금액
                          </label>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              updateMenuItem(
                                index,
                                "price",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="text-sm"
                            placeholder="가격"
                          />
                        </div>
                        <Button
                          onClick={() => removeMenuItem(index)}
                          variant="outline"
                          className="text-xs px-2 py-1 h-8 border-red-300 text-red-500 hover:bg-red-50"
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 총액 수정 */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  총액
                </label>
                <Input
                  type="number"
                  value={editableData.total}
                  onChange={(e) =>
                    setEditableData({
                      ...editableData,
                      total: parseInt(e.target.value) || 0,
                    })
                  }
                  className="text-sm"
                  placeholder="총액을 입력하세요"
                />
              </div>
            </div>

            <Button
              onClick={handleEditComplete}
              className="w-full h-[37px] bg-[#EB4C34] hover:bg-[#d63e2a] text-white rounded-[10px] font-bold text-sm mt-4 shrink-0"
            >
              수정완료
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="relative w-[370px] h-[250px]">
            <h3 className="absolute left-1/2 transform -translate-x-1/2 top-[43px] text-base font-semibold text-[#333333] leading-[19px] text-center">
              {editableData.restaurantName || "식당"}의 별점을 남겨주세요.
            </h3>

            <div className="absolute left-1/2 transform -translate-x-1/2 top-[95px] flex gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
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
        );

      case 4:
        return (
          <div className="relative w-[370px] h-[250px] flex flex-col items-center justify-center">
            {/* 아이콘 영역 - 로고와 편집 아이콘 함께 */}
            <div className="flex justify-center items-center gap-3 mb-4">
              <Image
                src="/logo.svg"
                alt="FoodBuddy Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <Image
                src="/images/edit-icon.svg"
                alt="Edit Icon"
                width={39}
                height={43}
                className="w-10 h-11"
              />
            </div>

            {/* 메인 텍스트 */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                버디가 리뷰를 작성하고 있어요!
              </h3>
              <p className="text-sm text-gray-600">잠시만 기다려주세요.</p>
            </div>

            {/* 로딩 애니메이션 */}
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-[10px] overflow-hidden">
        {renderStep()}
      </div>
    </div>
  );
}
