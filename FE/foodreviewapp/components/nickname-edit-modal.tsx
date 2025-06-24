"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import { updateUserInfo } from "@/lib/api";

interface NicknameEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname?: string;
}

export default function NicknameEditModal({
  isOpen,
  onClose,
  nickname,
}: NicknameEditModalProps) {
  const { isDarkMode, setUserInfo } = useApp();
  const [newNickname, setNewNickname] = useState(nickname || "");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!newNickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (newNickname === nickname) {
      alert("기존 닉네임과 동일합니다.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await updateUserInfo({
        nickname: newNickname,
      });

      // 컨텍스트 업데이트 (토큰은 그대로 유지)
      const currentToken = localStorage.getItem("accessToken");
      if (currentToken) {
        setUserInfo(response.nickname, currentToken);
      }

      alert("닉네임이 성공적으로 변경되었습니다!");
      onClose();
    } catch (error: any) {
      console.error("닉네임 변경 실패:", error);
      alert(error.response?.data || "닉네임 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-[400px] bg-white rounded-[10px] flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">닉네임 변경</h2>
          <button onClick={onClose} disabled={isLoading}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="px-4 py-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-[16px] font-semibold text-[#333]">
              새로운 닉네임
            </Label>
            <Input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="w-full h-[48px] rounded-[8px] border border-[#BCBCBC] text-[14px] px-3"
              placeholder="새로운 닉네임을 입력하세요"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-4"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !newNickname.trim()}
            className="px-4 bg-[#EB4C34] hover:bg-[#EB4C34CC] text-white"
          >
            {isLoading ? "변경 중..." : "변경"}
          </Button>
        </div>
      </div>
    </div>
  );
} 