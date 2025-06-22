"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Navigation, Phone, Clock } from "lucide-react"

// 임시 음식점 데이터
const restaurants = [
  {
    id: 1,
    name: "맛있는 김치찌개",
    category: "한식",
    rating: 4.5,
    reviewCount: 128,
    distance: "0.2km",
    address: "서울시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    hours: "11:00 - 22:00",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "이탈리아 파스타",
    category: "양식",
    rating: 4.2,
    reviewCount: 89,
    distance: "0.5km",
    address: "서울시 강남구 강남대로 456",
    phone: "02-2345-6789",
    hours: "12:00 - 23:00",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "일본식 라멘",
    category: "일식",
    rating: 4.7,
    reviewCount: 203,
    distance: "0.8km",
    address: "서울시 강남구 논현로 789",
    phone: "02-3456-7890",
    hours: "11:30 - 21:30",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants)

  const categories = ["전체", "한식", "양식", "일식", "중식", "카페"]

  const handleSearch = () => {
    const filtered = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || restaurant.category.includes(searchQuery),
    )
    setFilteredRestaurants(filtered)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    if (category === "전체") {
      setFilteredRestaurants(restaurants)
    } else {
      const filtered = restaurants.filter((restaurant) => restaurant.category === category)
      setFilteredRestaurants(filtered)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-center mb-4">음식점 찾기</h1>

          {/* 검색바 */}
          <div className="flex gap-2">
            <Input
              placeholder="음식점 이름이나 음식 종류를 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* 지도 영역 (실제로는 Kakao Map API 등을 사용) */}
        <Card className="mb-4">
          <CardContent className="p-0">
            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">지도가 여기에 표시됩니다</p>
                <p className="text-xs text-gray-500">Kakao Map API 연동 필요</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* 음식점 목록 */}
        <div className="space-y-3">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-500">이미지</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">{restaurant.name}</h3>
                      <Badge variant="secondary" className="text-xs ml-2">
                        {restaurant.distance}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                        <span className="text-xs font-medium">{restaurant.rating}</span>
                        <span className="text-xs text-gray-500">({restaurant.reviewCount})</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {restaurant.category}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600 truncate">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{restaurant.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Navigation className="h-3 w-3 mr-1" />
                    길찾기
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    전화
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600">다른 키워드로 검색해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
