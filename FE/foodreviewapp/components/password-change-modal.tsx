"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/lib/api";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({
  isOpen,
  onClose,
}: PasswordChangeModalProps) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasLetter && hasNumber && hasSpecial;
  };

  const handleSave = async () => {
    if (!passwordData.currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (!passwordData.newPassword) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      alert("새 비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      alert("현재 비밀번호와 새 비밀번호가 동일합니다.");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert("비밀번호가 성공적으로 변경되었습니다!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      onClose();
    } catch (error: any) {
      console.error("비밀번호 변경 실패:", error);
      alert(error.response?.data || "비밀번호 변경에 실패했습니다.");
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
          <h2 className="text-lg font-semibold text-gray-900">비밀번호 변경</h2>
          <button onClick={onClose} disabled={isLoading}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="px-4 py-6 space-y-4">
          {/* 현재 비밀번호 */}
          <div className="space-y-2">
            <Label className="text-[16px] font-semibold text-[#333]">
              현재 비밀번호
            </Label>
            <div className="relative">
              <Input
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full h-[48px] rounded-[8px] border border-[#BCBCBC] text-[14px] px-3 pr-10"
                placeholder="현재 비밀번호를 입력하세요"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    current: !showPasswords.current,
                  })
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* 새 비밀번호 */}
          <div className="space-y-2">
            <Label className="text-[16px] font-semibold text-[#333]">
              새 비밀번호
            </Label>
            <div className="relative">
              <Input
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full h-[48px] rounded-[8px] border border-[#BCBCBC] text-[14px] px-3 pr-10"
                placeholder="새 비밀번호를 입력하세요"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    new: !showPasswords.new,
                  })
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              8자 이상, 영문/숫자/특수문자 포함
            </p>
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="space-y-2">
            <Label className="text-[16px] font-semibold text-[#333]">
              새 비밀번호 확인
            </Label>
            <div className="relative">
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full h-[48px] rounded-[8px] border border-[#BCBCBC] text-[14px] px-3 pr-10"
                placeholder="새 비밀번호를 다시 입력하세요"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    confirm: !showPasswords.confirm,
                  })
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
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
            disabled={
              isLoading ||
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword
            }
            className="px-4 bg-[#EB4C34] hover:bg-[#EB4C34CC] text-white"
          >
            {isLoading ? "변경 중..." : "변경"}
          </Button>
        </div>
      </div>
    </div>
  );
} 