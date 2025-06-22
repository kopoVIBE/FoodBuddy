"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Calendar, Share2, Heart, TrendingUp, Award, Clock } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import ShareModal from "@/components/share-modal"
import ReviewDetailModal from "@/components/review-detail-modal"
import RestaurantDetailModal from "@/components/restaurant-detail-modal"
import Link from "next/link"

// 임시 데이터
const myReviews = [
  {
    id: 1,
    restaurantName: "맛있는 김치찌개",
    location: "서울시 강남구",
    rating: 4.5,
    date: "2024-01-15",
    content:
      "정말 맛있는 김치찌개집이었습니다. 김치가 잘 익어서 깊은 맛이 나고, 돼지고기도 부드러웠어요. 밑반찬도 정갈하게 나와서 만족스러웠습니다.",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["한식", "김치찌개", "점심"],
    isFavorite: true,
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
  {
    id: 3,
    restaurantName: "일본식 라멘",
    location: "서울시 신촌",
    rating: 4.8,
    date: "2024-01-08",
    content: "진짜 맛있는 라멘집! 국물이 진하고 면발도 쫄깃해요.",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["일식", "라멘", "저녁"],
    isFavorite: true,
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
  {
    id: 3,
    name: "이탈리아 파스타",
    category: "양식",
    visitCount: 2,
    avgRating: 4.0,
    image: "/placeholder.svg?height=60&width=60",
  },
]

const stats = {
  totalReviews: myReviews.length,
  averageRating: (myReviews.reduce((sum, review) => sum + review.rating, 0) / myReviews.length).toFixed(1),
  favoriteCount: myReviews.filter((review) => review.isFavorite).length,
  thisMonthReviews: 2,
}

export default function HomePage() {
  const [shareModal, setShareModal] = useState({ isOpen: false, title: "", content: "" })
  const [reviewDetailModal, setReviewDetailModal] = useState({ isOpen: false, review: null })
  const [restaurantDetailModal, setRestaurantDetailModal] = useState({ isOpen: false, restaurant: null })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg relative overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full" />
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full" />
        </div>

        <div className="max-w-md mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center justify-center mb-3">
            <Image src="/images/foodbuddy-logo.png" alt="FoodBuddy" width={120} height={60} className="h-12 w-auto" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-1">안녕하세요! 👋</h2>
            <p className="text-orange-100 text-sm">오늘도 맛있는 하루 되세요</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 통계 카드들 */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.totalReviews}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Star className="h-3 w-3" />총 리뷰
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.averageRating}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Award className="h-3 w-3" />
                평균 평점
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.favoriteCount}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Heart className="h-3 w-3" />
                즐겨찾기
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{stats.thisMonthReviews}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" />
                이번 달
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 자주 방문한 음식점 */}
        <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              자주 방문한 음식점
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {frequentRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
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
                  <h4 className="font-medium text-sm text-gray-900 truncate">{restaurant.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                      {restaurant.category}
                    </Badge>
                    <span className="text-xs text-gray-600">{restaurant.visitCount}회 방문</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                  <span className="text-sm font-medium text-gray-700">{restaurant.avgRating}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 최근 리뷰 */}
        <Card className="border-orange-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
              <Star className="h-5 w-5" />
              최근 리뷰
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myReviews.slice(0, 2).map((review) => (
              <div
                key={review.id}
                className="border border-orange-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setReviewDetailModal({ isOpen: true, review })}
              >
                <div className="relative">
                  <Image
                    src={review.image || "/placeholder.svg"}
                    alt={review.restaurantName}
                    width={400}
                    height={150}
                    className="w-full h-32 object-cover"
                  />
                  <Button size="sm" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                    <Heart className={`h-4 w-4 ${review.isFavorite ? "fill-orange-500 text-orange-500" : ""}`} />
                  </Button>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{review.restaurantName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-sm text-gray-600">{review.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                      <span className="font-medium text-gray-700">{review.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{review.content}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {review.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {review.date}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShareModal({ isOpen: true, title: review.restaurantName, content: review.content })
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      공유
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 더보기 버튼 */}
        {myReviews.length > 2 && (
          <Link href="/storage">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">내 리뷰 더보기</Button>
          </Link>
        )}

        {/* 빈 상태 */}
        {myReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-orange-300 mb-4">
              <Star className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">첫 번째 리뷰를 작성해보세요!</h3>
            <p className="text-gray-600 mb-6">맛있는 음식점을 발견하면 AI가 도와드릴게요</p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">리뷰 작성하기</Button>
          </div>
        )}
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
