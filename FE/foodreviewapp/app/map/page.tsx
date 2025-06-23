"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, Star, MapPin } from "lucide-react"
import { useApp } from "@/contexts/app-context"

declare global {
  interface Window {
    kakao: any
  }
}

// 방문했던 음식점 데이터 (현재 위치 중심으로)
const visitedRestaurants = [
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
    name: "비놀릭",
    rating: 5,
    address: "서울시 광진구 자양동 72",
    date: "2025-06-20",
    lat: 37.5675,
    lng: 126.979,
  },
  {
    id: 3,
    name: "김치찌개집",
    rating: 4,
    address: "서울시 강남구 테헤란로 123",
    date: "2025-06-18",
    lat: 37.5685,
    lng: 126.98,
  },
  {
    id: 4,
    name: "파스타하우스",
    rating: 5,
    address: "서울시 홍대입구",
    date: "2025-06-15",
    lat: 37.5695,
    lng: 126.981,
  },
  {
    id: 5,
    name: "일본식 라멘",
    rating: 4,
    address: "서울시 강남구 역삼동",
    date: "2025-06-12",
    lat: 37.5655,
    lng: 126.977,
  },
  {
    id: 6,
    name: "중국집",
    rating: 3,
    address: "서울시 서초구",
    date: "2025-06-10",
    lat: 37.5645,
    lng: 126.975,
  },
]

export default function MapPage() {
  const { t, isDarkMode } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [map, setMap] = useState<any>(null)
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.5665, lng: 126.978 })
  const mapContainer = useRef<HTMLDivElement>(null)

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("위치 정보를 가져올 수 없습니다:", error)
          // 기본값 사용 (강남역 근처)
        },
      )
    }
  }, [])

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
            center: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
            level: 4, // 조금 더 넓은 범위로 설정
          }

          const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options)
          setMap(kakaoMap)

          // 현재 위치 마커 (파란색 원)
          const currentMarkerPosition = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng)

          // 현재 위치 마커 이미지 생성
          const currentMarkerImageSrc =
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="#007AFF" stroke="white" strokeWidth="2"/>
            </svg>
          `)
          const currentMarkerImageSize = new window.kakao.maps.Size(20, 20)
          const currentMarkerImage = new window.kakao.maps.MarkerImage(currentMarkerImageSrc, currentMarkerImageSize)

          const currentMarker = new window.kakao.maps.Marker({
            position: currentMarkerPosition,
            image: currentMarkerImage,
          })
          currentMarker.setMap(kakaoMap)

          // 방문했던 음식점 마커들 (빨간색 별 모양, 둥글게)
          visitedRestaurants.forEach((restaurant) => {
            const markerPosition = new window.kakao.maps.LatLng(restaurant.lat, restaurant.lng)

            // 커스텀 마커 이미지 생성 (둥근 빨간색 별)
            const markerImageSrc =
              "data:image/svg+xml;base64," +
              btoa(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#FF4444" opacity="0.9"/>
                <path d="M16 6l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z" fill="white"/>
              </svg>
            `)
            const markerImageSize = new window.kakao.maps.Size(32, 32)
            const markerImageOption = { offset: new window.kakao.maps.Point(16, 16) }
            const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, markerImageSize, markerImageOption)

            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              image: markerImage,
            })
            marker.setMap(kakaoMap)

            // 인포윈도우 추가
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `
                <div style="padding:8px;font-size:12px;text-align:center;min-width:80px;">
                  <div style="font-weight:bold;margin-bottom:2px;">${restaurant.name}</div>
                  <div style="color:#666;font-size:10px;">${restaurant.date}</div>
                </div>
              `,
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
  }, [currentLocation])

  return (
    <div className="min-h-screen pb-20 bg-white">
      {/* 지도 영역 */}
      <div className="relative">
        {/* 지도 */}
        <div
          ref={mapContainer}
          className="h-96 w-full rounded-b-[10px] overflow-hidden"
          style={{ background: "#f0f0f0" }}
        />

        {/* 검색바 오버레이 */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="찾고있는 음식을 입력해주세요."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border border-gray-200 rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* 범례 */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>현재 위치</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <Star className="w-2 h-2 fill-white text-white" />
              </div>
              <span>방문한 음식점</span>
            </div>
          </div>
        </div>
      </div>

      {/* 음식점 목록 */}
      <div className="px-4 py-4 space-y-3">
        {visitedRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white border-0">
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-1 text-gray-900">{restaurant.name}</h3>
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
                  <span className="text-sm text-gray-600">{restaurant.address}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{restaurant.date}</p>
              </div>
            </div>
            {/* 구분선 */}
            <div className="border-b border-gray-100"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
