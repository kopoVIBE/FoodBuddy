"use client"

import { useState } from "react"
import ReviewDetailModal from "@/components/review-detail-modal"
import RestaurantDetailModal from "@/components/restaurant-detail-modal"
import ShareModal from "@/components/share-modal"
import StatisticsTab from "@/components/statistics-tab"
import { useApp } from "@/contexts/app-context"

// 임시 데이터
const savedReviews = [
  {
    id: 1,
    restaurantName: "맛있는 김치찌개",
    location: "서울시 강남구",
    rating: 4.5,
    date: "2024-01-15",
    content: "정말 맛있는 김치찌개집이었습니다. 김치가 잘 익어서 깊은 맛이 나고, 돼지고기도 부드러웠어요.",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["한식", "김치찌개", "점심"],
    isFavorite: true,
    isPublic: true,
  },
  {
    id: 2,
    restaurantName: "이탈리아 파스타",
    location: "서울시 홍대",
    rating: 4.0,
    date: "2024-01-10",
    content: "크림파스타가 정말 부드럽고 맛있었어요. 면도 알덴테로 잘 삶아져 있고, 치즈의 풍미가 좋았습니다.",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["양식", "파스타", "저녁"],
    isFavorite: false,
    isPublic: false,
  },
]

const favoriteRestaurants = [
  {
    id: 1,
    name: "맛있는 김치찌개",
    category: "한식",
    rating: 4.5,
    visitCount: 3,
    lastVisit: "2024-01-15",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "일본식 라멘",
    category: "일식",
    rating: 4.7,
    visitCount: 2,
    lastVisit: "2024-01-08",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function StoragePage() {
  const { isDarkMode } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("전체")
  const [shareModal, setShareModal] = useState({ isOpen: false, title: "", content: "" })
  const [reviewDetailModal, setReviewDetailModal] = useState({ isOpen: false, review: null })
  const [restaurantDetailModal, setRestaurantDetailModal] = useState({ isOpen: false, restaurant: null })

  const toggleFavorite = (id: number) => {
    console.log("Toggle favorite for review:", id)
  }

  const deleteReview = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      console.log("Delete review:", id)
    }
  }

  return (
    <div className={`min-h-screen pb-20 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-4">
          <StatisticsTab />
        </div>
      </div>

      {/* 모달들 */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, title: "", content: "" })}
        title={shareModal.title}
        content={shareModal.content}
      />

      <ReviewDetailModal
        isOpen={reviewDetailModal.isOpen}
        onClose={() => setReviewDetailModal({ isOpen: false, review: null })}
        review={reviewDetailModal.review}
        onShare={(title, content) => {
          setReviewDetailModal({ isOpen: false, review: null })
          setShareModal({ isOpen: true, title, content })
        }}
      />

      <RestaurantDetailModal
        isOpen={restaurantDetailModal.isOpen}
        onClose={() => setRestaurantDetailModal({ isOpen: false, restaurant: null })}
        restaurant={restaurantDetailModal.restaurant}
      />
    </div>
  )
}
