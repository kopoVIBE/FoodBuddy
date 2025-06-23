"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Camera, User } from "lucide-react"
import Image from "next/image"
import { useApp } from "@/contexts/app-context"

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { isDarkMode } = useApp()
  const [profileData, setProfileData] = useState({
    name: "푸드러버",
    email: "foodlover@example.com",
    profileImage: null as string | null,
  })

  if (!isOpen) return null

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData({ ...profileData, profileImage: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // 프로필 저장 로직
    alert("프로필이 저장되었습니다!")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`relative w-full max-w-md rounded-2xl overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        {/* 헤더 */}
        <div
          className={`flex items-center justify-between p-4 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>프로필 편집</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 space-y-6">
          {/* 프로필 이미지 */}
          <div className="text-center">
            <div className="relative inline-block">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${
                  isDarkMode ? "bg-gray-700" : "bg-orange-100"
                }`}
              >
                {profileData.profileImage ? (
                  <Image
                    src={profileData.profileImage || "/placeholder.svg"}
                    alt="프로필"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className={`h-12 w-12 ${isDarkMode ? "text-gray-400" : "text-orange-600"}`} />
                )}
              </div>
              <button
                onClick={() => document.getElementById("profile-image-input")?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              프로필 사진을 변경하려면 카메라 아이콘을 클릭하세요
            </p>
          </div>

          {/* 사용자 이름 */}
          <div className="space-y-2">
            <Label className={isDarkMode ? "text-white" : "text-gray-900"}>사용자 이름</Label>
            <Input
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              placeholder="사용자 이름을 입력하세요"
              className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>

          {/* 이메일 */}
          <div className="space-y-2">
            <Label className={isDarkMode ? "text-white" : "text-gray-900"}>이메일</Label>
            <Input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              placeholder="이메일을 입력하세요"
              className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div
          className={`p-4 border-t flex gap-2 ${isDarkMode ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"}`}
        >
          <Button
            variant="outline"
            className={`flex-1 ${isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""}`}
            onClick={onClose}
          >
            취소
          </Button>
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>
    </div>
  )
}
