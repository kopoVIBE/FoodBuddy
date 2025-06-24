"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Palette, Lock } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import NicknameEditModal from "@/components/nickname-edit-modal";
import PasswordChangeModal from "@/components/password-change-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getUserInfo, UserInfoResponse } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const {
    t,
    isDarkMode,
    language,
    nickname,
    toggleDarkMode,
    setLanguage,
    logout,
  } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [autoShare, setAutoShare] = useState(false);
  const [defaultStyle, setDefaultStyle] = useState("casual");
  const [autoOCR, setAutoOCR] = useState(true);
  const [reviewReminder, setReviewReminder] = useState(true);
  const [recommendationAlerts, setRecommendationAlerts] = useState(true);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error("사용자 정보를 가져오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    if (nickname) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [nickname]);

  return (
    <div
      className={`min-h-screen pb-20 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 사용자 정보 카드 */}
        <Card className="relative overflow-hidden cursor-pointer w-full transition-colors border-10 shadow-[0_3px_4px_rgba(0,0,0,0.25)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-[#FFF6EA] rounded-full flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="프로필"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${isDarkMode ? "text-white" : ""}`}>
                  {nickname || "게스트"}
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {loading 
                    ? "로딩 중..." 
                    : userInfo?.email 
                      ? userInfo.email
                      : nickname
                      ? "이메일 정보를 불러올 수 없습니다"
                      : "로그인이 필요합니다"
                  }
                </p>
              </div>
            </div>

            {/* 사용자 정보 수정 버튼들 */}
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => setShowNicknameModal(true)}
                className="w-full justify-start h-[40px] border-[#BCBCBC]"
              >
                <User className="w-4 h-4 mr-2" />
                닉네임 변경
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(true)}
                className="w-full justify-start h-[40px] border-[#BCBCBC]"
              >
                <Lock className="w-4 h-4 mr-2" />
                비밀번호 변경
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 앱 설정 */}
        <Card className="relative overflow-hidden cursor-pointer w-full transition-colors border-10 shadow-[0_3px_4px_rgba(0,0,0,0.25)]">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className={isDarkMode ? "text-white" : ""}>
                  다크 모드
                </Label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  어두운 테마 사용
                </p>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-[#EB4C34]"
              />
            </div>

            <Separator />

            <div>
              <Label className={isDarkMode ? "text-white" : ""}>언어</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger
                  className={`mt-1 ${
                    isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                  }`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}
                >
                  <SelectItem
                    value="ko"
                    className={isDarkMode ? "text-white hover:bg-gray-600" : ""}
                  >
                    한국어
                  </SelectItem>
                  <SelectItem
                    value="en"
                    className={isDarkMode ? "text-white hover:bg-gray-600" : ""}
                  >
                    English
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* 로그아웃 버튼 */}
            <div className="pt-2">
              <Button
                onClick={() => {
                  logout();
                  router.replace("/auth");
                }}
                className="w-full text-white font-semibold hover:opacity-90"
                style={{ backgroundColor: "#EB4C34" }}
              >
                로그아웃
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 닉네임 수정 모달 */}
      <NicknameEditModal
        isOpen={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
        nickname={nickname ?? ""}
      />

      {/* 비밀번호 변경 모달 */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
