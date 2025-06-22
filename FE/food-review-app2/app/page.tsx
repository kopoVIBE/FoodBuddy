"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, MessageCircle, ChevronDown, Clock, Heart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import ShareModal from "@/components/share-modal"
import ReviewDetailModal from "@/components/review-detail-modal"
import RestaurantDetailModal from "@/components/restaurant-detail-modal"
import { useApp } from "@/contexts/app-context"

// 임시 데이터
const myReviews = [
  {
    id: 1,
    restaurantName: "비늘림",
    location: "서울시 강남구 자원동 72",
    rating: 5,
    date: "2025-06-22",
    content:
      "오늘 방문한 비늘림은 분위기부터 너무 좋았어요. 그릴 파스타는 부드럽고 고소해서 입안에서 살살 녹았고, 해산물 토마토 파스타는 신선한 재료 덕분에 감칠맛이 일품이었습니다. 다음엔 친구랑 다시 오고 싶어요 😊",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["한식", "김치찌개", "점심"],
    isFavorite: true,
    receiptImage: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 2,
    restaurantName: "이탈리아 파스타",
    location: "서울시 홍대",
    rating: 4.0,
    date: "2024-01-10",
    content:
      "크림파스타가 정말 부드럽고 맛있었어요. 면도 알덴테로 잘 삶아져 있고, 치즈의 풍미가 좋았습니다. 다음에 또 방문하고 싶네요.",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["양식", "파스타", "저녁"],
    isFavorite: false,
  },
]

const frequentRestaurants = [
  {
    id: 1,
    name: "맛있는 김치찌개",
    category: "한식",
    visitCount: 5,
    avgRating: 4.5,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "일본식 라멘",
    category: "일식",
    visitCount: 3,
    avgRating: 4.8,
    image: "/placeholder.svg?height=60&width=60",
  },
]

export default function HomePage() {
  const { t, isDarkMode } = useApp()
  const [activeTab, setActiveTab] = useState("written")
  const [sortOrder, setSortOrder] = useState("latest")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [shareModal, setShareModal] = useState({ isOpen: false, title: "", content: "" })
  const [reviewDetailModal, setReviewDetailModal] = useState({ isOpen: false, review: null })
  const [restaurantDetailModal, setRestaurantDetailModal] = useState({ isOpen: false, restaurant: null })

  const sortOptions = [
    { value: "latest", label: t("latest") },
    { value: "oldest", label: t("oldest") },
    { value: "alphabetical", label: t("alphabetical") },
  ]

  return (
    <div className={`min-h-screen pb-20 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* 헤더 */}
      <div className={`px-4 py-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>안녕하세요! 마틸님</h1>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>오늘도 맛있는 하루 되세요</p>
            </div>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex mb-4">
            <button
              onClick={() => setActiveTab("written")}
              className={`flex-1 pb-2 text-sm font-medium border-b-2 ${
                activeTab === "written"
                  ? "text-red-500 border-red-500"
                  : `${isDarkMode ? "text-gray-400 border-gray-600" : "text-gray-500 border-gray-300"}`
              }`}
            >
              작성한 리뷰
            </button>
            <button
              onClick={() => setActiveTab("draft")}
              className={`flex-1 pb-2 text-sm font-medium border-b-2 ${
                activeTab === "draft"
                  ? "text-red-500 border-red-500"
                  : `${isDarkMode ? "text-gray-400 border-gray-600" : "text-gray-500 border-gray-300"}`
              }`}
            >
              임시저장
            </button>
          </div>

          {/* 통계 및 정렬 */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-bold text-red-500">
                버디와 쓴 총 리뷰 <span className="text-xl">112</span>개
              </p>
            </div>
            <div className="relative">
              <Button
                size="sm"
                className={`rounded-full px-4 ${
                  isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                최신순
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>

              {showSortMenu && (
                <div
                  className={`absolute top-full right-0 mt-1 rounded-lg shadow-lg z-10 ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  } border`}
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortOrder(option.value)
                        setShowSortMenu(false)
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* 리뷰 목록 */}
        {myReviews.map((review) => (
          <Card
            key={review.id}
            className={`overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            }`}
            onClick={() => setReviewDetailModal({ isOpen: true, review })}
          >
            <CardContent className="p-4">
              {/* 리뷰 헤더 */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[#FF5722] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">버</span>
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {review.restaurantName}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{review.date}</span>
                  </div>
                </div>
              </div>

              {/* 위치 정보 */}
              <div className="flex items-center gap-1 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{review.location}</span>
              </div>

              {/* 리뷰 내용 */}
              <p className={`text-sm leading-relaxed mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {review.content}
              </p>

              {/* 영수증 이미지 */}
              {review.receiptImage && (
                <div className="mb-3">
                  <Image
                    src={review.receiptImage || "/placeholder.svg"}
                    alt="영수증"
                    width={100}
                    height={150}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* 좋아요 버튼 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="p-1">
                    <Heart className={`h-4 w-4 ${review.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  </Button>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>32</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* 자주 방문한 음식점 */}
        <Card className={`border-orange-200 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-orange-500" />
              <h3 className={`font-medium text-orange-700 ${isDarkMode ? "text-orange-400" : ""}`}>
                자주 방문한 음식점
              </h3>
            </div>

            <div className="space-y-3">
              {frequentRestaurants.map((restaurant, index) => (
                <div
                  key={restaurant.id}
                  className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() =>
                    setRestaurantDetailModal({
                      isOpen: true,
                      restaurant: {
                        ...restaurant,
                        address: "서울시 강남구",
                        phone: "02-1234-5678",
                        hours: "11:00-22:00",
                      },
                    })
                  }
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500">IMG</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {restaurant.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                        {restaurant.category}
                      </Badge>
                      <span className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {restaurant.visitCount}회 방문
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                    <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {restaurant.avgRating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 모달들 */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, title: "", content: "" })}
        title={shareModal.title}
        content={shareModal.content}
        className="z-[60]"
      />

      <ReviewDetailModal
        isOpen={reviewDetailModal.isOpen}
        onClose={() => setReviewDetailModal({ isOpen: false, review: null })}
        review={reviewDetailModal.review}
        onShare={(title, content) => {
          setReviewDetailModal({ isOpen: false, review: null })
          setShareModal({ isOpen: true, title, content })
        }}
        className="z-[60]"
      />

      <RestaurantDetailModal
        isOpen={restaurantDetailModal.isOpen}
        onClose={() => setRestaurantDetailModal({ isOpen: false, restaurant: null })}
        restaurant={restaurantDetailModal.restaurant}
        className="z-[60]"
      />
    </div>
  )
}
