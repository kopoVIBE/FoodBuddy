"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Star, Search, Calendar, MapPin, Share2, Trash2 } from "lucide-react"
import Image from "next/image"
import ReviewDetailModal from "@/components/review-detail-modal"
import RestaurantDetailModal from "@/components/restaurant-detail-modal"
import ShareModal from "@/components/share-modal"
import StatisticsTab from "@/components/statistics-tab"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("전체")
  const [shareModal, setShareModal] = useState({ isOpen: false, title: "", content: "" })
  const [reviewDetailModal, setReviewDetailModal] = useState({ isOpen: false, review: null })
  const [restaurantDetailModal, setRestaurantDetailModal] = useState({ isOpen: false, restaurant: null })

  const toggleFavorite = (id: number) => {
    // 실제로는 상태 업데이트 로직 구현
    console.log("Toggle favorite for review:", id)
  }

  const deleteReview = (id: number) => {
    // 실제로는 삭제 로직 구현
    if (confirm("정말 삭제하시겠습니까?")) {
      console.log("Delete review:", id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-center">저장소</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="statistics">통계</TabsTrigger>
            <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
            <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
          </TabsList>

          {/* 통계 탭 */}
          <TabsContent value="statistics" className="space-y-4">
            <StatisticsTab />
          </TabsContent>

          {/* 내 리뷰 탭 */}
          <TabsContent value="reviews" className="space-y-4">
            {/* 검색 및 필터 */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="리뷰 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button size="icon" variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  {["전체", "한식", "양식", "일식", "즐겨찾기"].map((filter) => (
                    <Button
                      key={filter}
                      variant={selectedFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter(filter)}
                      className="whitespace-nowrap"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 리뷰 목록 */}
            <div className="space-y-3">
              {savedReviews.map((review) => (
                <Card
                  key={review.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setReviewDetailModal({ isOpen: true, review })}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3 mb-3">
                      <Image
                        src={review.image || "/placeholder.svg"}
                        alt={review.restaurantName}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-sm">{review.restaurantName}</h3>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(review.id)
                              }}
                              className="p-1"
                            >
                              <Heart
                                className={`h-4 w-4 ${review.isFavorite ? "fill-orange-500 text-orange-500" : ""}`}
                              />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteReview(review.id)
                              }}
                              className="p-1"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                            <span className="text-xs font-medium">{review.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{review.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <Calendar className="h-3 w-3" />
                          {review.date}
                          {review.isPublic && (
                            <Badge variant="secondary" className="text-xs ml-2">
                              공개
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{review.content}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {review.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShareModal({ isOpen: true, title: review.restaurantName, content: review.content })
                      }}
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      공유하기
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 즐겨찾기 탭 */}
          <TabsContent value="favorites" className="space-y-4">
            <div className="space-y-3">
              {favoriteRestaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
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
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs text-gray-500">이미지</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-sm">{restaurant.name}</h3>
                          <Button size="sm" variant="ghost" className="p-1">
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{restaurant.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {restaurant.category}
                          </Badge>
                        </div>

                        <div className="text-xs text-gray-600 space-y-1">
                          <p>방문 횟수: {restaurant.visitCount}회</p>
                          <p>최근 방문: {restaurant.lastVisit}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        리뷰 작성
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        정보 보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {favoriteRestaurants.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">즐겨찾기가 없습니다</h3>
                <p className="text-gray-600">마음에 드는 음식점을 즐겨찾기에 추가해보세요</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
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
