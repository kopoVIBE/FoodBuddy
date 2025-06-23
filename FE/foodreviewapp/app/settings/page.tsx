"use client";

import { useState } from "react";
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
import { User, Bell, Palette } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import ProfileEditModal from "@/components/profile-edit-modal";

export default function SettingsPage() {
  const { t, isDarkMode, language, toggleDarkMode, setLanguage } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [autoShare, setAutoShare] = useState(false);
  const [defaultStyle, setDefaultStyle] = useState("casual");
  const [autoOCR, setAutoOCR] = useState(true);
  const [reviewReminder, setReviewReminder] = useState(true);
  const [recommendationAlerts, setRecommendationAlerts] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div
      className={`min-h-screen pb-20 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 프로필 섹션 */}
        <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${
                isDarkMode ? "text-white" : ""
              }`}
            >
              <User className="h-5 w-5" />
              프로필
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${isDarkMode ? "text-white" : ""}`}>
                  푸드러버
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  foodlover@example.com
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfileModal(true)}
                className={
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : ""
                }
              >
                편집
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 알림 설정 */}
        <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${
                isDarkMode ? "text-white" : ""
              }`}
            >
              <Bell className="h-5 w-5" />
              알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className={isDarkMode ? "text-white" : ""}>
                  앱 알림
                </Label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  앱 내 일반 알림 설정
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <Separator className={isDarkMode ? "bg-gray-700" : ""} />

            <div className="flex items-center justify-between">
              <div>
                <Label className={isDarkMode ? "text-white" : ""}>
                  리뷰 리마인더
                </Label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  방문한 음식점 리뷰 작성 알림
                </p>
              </div>
              <Switch
                checked={reviewReminder}
                onCheckedChange={setReviewReminder}
              />
            </div>

            <Separator className={isDarkMode ? "bg-gray-700" : ""} />

            <div className="flex items-center justify-between">
              <div>
                <Label className={isDarkMode ? "text-white" : ""}>
                  추천 알림
                </Label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  맞춤 음식점 추천 알림
                </p>
              </div>
              <Switch
                checked={recommendationAlerts}
                onCheckedChange={setRecommendationAlerts}
              />
            </div>
          </CardContent>
        </Card>

        {/* 앱 설정 */}
        <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${
                isDarkMode ? "text-white" : ""
              }`}
            >
              <Palette className="h-5 w-5" />앱 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
            </div>

            <Separator className={isDarkMode ? "bg-gray-700" : ""} />

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
          </CardContent>
        </Card>
      </div>

      {/* 프로필 편집 모달 */}
      <ProfileEditModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}
