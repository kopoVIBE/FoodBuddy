"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Palette, FileText, Shield, HelpCircle, LogOut } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [autoShare, setAutoShare] = useState(false)
  const [defaultStyle, setDefaultStyle] = useState("casual")
  const [autoOCR, setAutoOCR] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-center">설정</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 프로필 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
                <h3 className="font-medium">푸드러버</h3>
                <p className="text-sm text-gray-600">foodlover@example.com</p>
              </div>
              <Button variant="outline" size="sm">
                편집
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <Label htmlFor="nickname">닉네임</Label>
                <Input id="nickname" defaultValue="푸드러버" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="bio">소개</Label>
                <Input id="bio" placeholder="자신을 소개해주세요" className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 리뷰 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              리뷰 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>자동 OCR 처리</Label>
                <p className="text-sm text-gray-600">영수증 업로드 시 자동으로 텍스트 추출</p>
              </div>
              <Switch checked={autoOCR} onCheckedChange={setAutoOCR} />
            </div>

            <Separator />

            <div>
              <Label>기본 리뷰 스타일</Label>
              <Select value={defaultStyle} onValueChange={setDefaultStyle}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">캐주얼</SelectItem>
                  <SelectItem value="formal">정중한</SelectItem>
                  <SelectItem value="trendy">트렌디</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>자동 공유</Label>
                <p className="text-sm text-gray-600">리뷰 작성 완료 시 자동으로 공유 옵션 표시</p>
              </div>
              <Switch checked={autoShare} onCheckedChange={setAutoShare} />
            </div>
          </CardContent>
        </Card>

        {/* 알림 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>푸시 알림</Label>
                <p className="text-sm text-gray-600">새로운 기능 및 업데이트 알림</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>리뷰 리마인더</Label>
                <p className="text-sm text-gray-600">방문한 음식점 리뷰 작성 알림</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>추천 알림</Label>
                <p className="text-sm text-gray-600">맞춤 음식점 추천 알림</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* 앱 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />앱 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>테마</Label>
              <Select defaultValue="system">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">라이트</SelectItem>
                  <SelectItem value="dark">다크</SelectItem>
                  <SelectItem value="system">시스템 설정</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <Label>언어</Label>
              <Select defaultValue="ko">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 기타 설정 */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-3" />
              개인정보 처리방침
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-3" />
              도움말 및 지원
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
              <LogOut className="h-4 w-4 mr-3" />
              로그아웃
            </Button>
          </CardContent>
        </Card>

        {/* 앱 정보 */}
        <div className="text-center text-sm text-gray-500">
          <p>FoodBuddy v1.0.0</p>
          <p>© 2024 FoodBuddy. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
