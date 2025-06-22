"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Star, MapPin } from "lucide-react"
import { useApp } from "@/contexts/app-context"

declare global {
  interface Window {
    kakao: any
  }
}

const restaurants = [
  {
    id: 1,
    name: "마늘",
    rating: 5,
    address: "서울시 강남구 자원동 72",
    date: "2025-06-22",
    lat: 37.5665,
    lng: 126.978,
  },
  {
    id: 2,
    name: "마늘",
    rating: 5,
    address: "서울시 강남구 자원동 72",
    date: "2025-06-22",
    lat: 37.5675,
    lng: 126.979,
  },
  {
    id: 3,
    name: "마늘",
    rating: 5,
    address: "서울시 강남구 자원동 72",
    date: "2025-06-22",
    lat: 37.5685,
    lng: 126.98,
  },
  {
    id: 4,
    name: "마늘",
    rating: 5,
    address: "서울시 강남구 자원동 72",
    date: "2025-06-22",
    lat: 37.5695,
    lng: 126.981,
  },
]

export default function MapPage() {
  const { t, isDarkMode } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [map, setMap] = useState<any>(null)
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Kakao Map API 스크립트 로드
    const script = document.createElement("script")
    script.async = true
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAP_API_KEY&autoload=false`
    document.head.appendChild(script)

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapContainer.current) {
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          }

          const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options)
          setMap(kakaoMap)

          // 마커 추가
          restaurants.forEach((restaurant) => {
            const markerPosition = new window.kakao.maps.LatLng(restaurant.lat, restaurant.lng)
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
            })
            marker.setMap(kakaoMap)

            // 인포윈도우 추가
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px;font-size:12px;">${restaurant.name}</div>`,
            })

            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.open(kakaoMap, marker)
            })
          })
        }
      })
    }

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div className={`min-h-screen pb-20 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* 검색 헤더 */}
      <div className={`p-4 shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="찾고있는 음식을 입력해주세요."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 rounded-full border-0 ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50"}`}
            />
          </div>
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="max-w-md mx-auto">
        <div ref={mapContainer} className="h-80 w-full" style={{ background: "#f0f0f0" }} />

        {/* 음식점 목록 - 두 번째 이미지 디자인 적용 */}
        <div className="px-4 py-4 space-y-2">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`font-medium text-lg mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < restaurant.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {restaurant.address}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{restaurant.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 리뷰 만들기 버튼 */}
        <div className="fixed bottom-24 right-4">
          <Button className="px-4 py-2 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white shadow-lg">
            리뷰 만들기
          </Button>
        </div>
      </div>
    </div>
  )
}
