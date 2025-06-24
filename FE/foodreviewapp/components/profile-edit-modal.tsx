"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { X } from "lucide-react";
import { useApp } from "@/contexts/app-context";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname?: string;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  nickname,
}: ProfileEditModalProps) {
  const { isDarkMode } = useApp();
  const [profileData, setProfileData] = useState({
    name: nickname || "", // null, undefined, 빈 문자열 모두 처리
    password: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (profileData.password !== profileData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("프로필이 저장되었습니다!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-[400px] max-h-[80vh] bg-white rounded-[10px] flex flex-col overflow-hidden">
        {/* X 닫기 버튼만 남김 */}
        <div className="flex justify-end px-3 py-2">
          <button onClick={onClose}>
            <X className="w-4 h-4 text-[#333]" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="px-4 py-4 space-y-4 overflow-y-auto flex-1">
          {/* 프로필 이미지 */}
          <div className="flex justify-center">
            <div className="w-[100px] h-[100px] bg-[#FFF6EA] rounded-full flex items-center justify-center">
              <Image src="/logo.svg" alt="프로필" width={52} height={52} />
            </div>
          </div>

          {/* 사용자 이름 */}
          <div className="space-y-1">
            <Label className="text-[16px] font-semibold text-[#333]">
              사용자 이름
            </Label>
            <Input
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              className="w-full h-[48px] rounded-[8px] border border-[#BCBCBC] text-[14px] px-3"
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* 비밀번호 */}
          <div className="space-y-1">
            <Label className="text-[16px] font-semibold text-[#333]">
              비밀번호
            </Label>
            <Input
              type="password"
              value={profileData.password}
              onChange={(e) =>
                setProfileData({ ...profileData, password: e.target.value })
              }
              className="w-full h-[48px] rounded-[8px] border border-[#BCBCBC] text-[14px] px-3"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {/* 비밀번호 재확인 */}
          <div className="space-y-1">
            <Label className="text-[16px] font-semibold text-[#333]">
              비밀번호 재확인
            </Label>
            <Input
              type="password"
              value={profileData.confirmPassword}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full h-[48px] rounded-[8px] border border-[#BCBCBC] text-[14px] px-3"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-between px-4 py-3 border-t border-gray-200">
          <Button
            className="w-[160px] h-[48px] text-[16px] font-bold bg-[#EB4C34] text-white rounded-[8px] hover:bg-[#EB4C34CC]"
            onClick={handleSave}
          >
            저장
          </Button>
          <Button
            variant="outline"
            className="w-[160px] h-[48px] text-[16px] font-bold border-[#EB4C34] text-[#EB4C34] rounded-[8px]"
            onClick={onClose}
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}
