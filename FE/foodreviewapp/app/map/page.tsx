"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Star, MapPin } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import { 
  getAllRestaurants, 
  getVisitedRestaurants, 
  getMyFavoriteRestaurants,
  getCoordinatesFromAddress,
  getMyReviews,
  RestaurantResponse,
  FavoriteRestaurantInfo,
  MyReviewResponse
} from "@/lib/api";

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVA_SCRIPT_KEY;

// 지도에 표시할 레스토랑 인터페이스
interface MapRestaurant {
  restaurantId: string;
  name: string;
  category: string;
  address: string;
  lat?: number;
  lng?: number;
  status: 'favorite' | 'visited' | 'normal'; // 즐겨찾기/방문/일반
  rating?: number;
  visitCount?: number;
  lastVisit?: string;
}

export default function MapPage() {
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
  });
  const [restaurants, setRestaurants] = useState<MapRestaurant[]>([]);
  const [visibleList, setVisibleList] = useState<MapRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);

  // 레스토랑 데이터 불러오기
  const fetchRestaurantData = async () => {
    try {
      setIsLoading(true);
      console.log("레스토랑 데이터 요청 시작");

      // 병렬로 데이터 요청
      const [allRestaurants, visitedRestaurants, favoriteRestaurants, myReviews] = await Promise.all([
        getAllRestaurants(),
        getVisitedRestaurants(),
        getMyFavoriteRestaurants(),
        getMyReviews()
      ]);

      console.log("받은 데이터:", { allRestaurants, visitedRestaurants, favoriteRestaurants, myReviews });

      // 방문한 레스토랑 ID 목록
      const visitedIds = new Set(visitedRestaurants.map(r => r.restaurantId));
      // 즐겨찾기 레스토랑 ID 목록
      const favoriteIds = new Set(favoriteRestaurants.map(r => r.restaurantId));

      // 레스토랑별 리뷰 통계 계산 
      const reviewStats = new Map<string, {rating: number, visitCount: number, lastVisit: string}>();
      
      // 리뷰 데이터 그룹화 및 통계 계산
      const reviewsByRestaurant = myReviews.reduce((acc, review) => {
        if (!acc[review.restaurantId]) {
          acc[review.restaurantId] = [];
        }
        acc[review.restaurantId].push(review);
        return acc;
      }, {} as Record<string, MyReviewResponse[]>);

      // 각 레스토랑별 통계 계산
      Object.entries(reviewsByRestaurant).forEach(([restaurantId, reviews]) => {
        const ratings = reviews.map(r => r.rating);
        const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        const visitCount = reviews.length;
        const lastVisit = reviews
          .map(r => new Date(r.createdAt))
          .sort((a, b) => b.getTime() - a.getTime())[0]
          .toLocaleDateString();
        
        reviewStats.set(restaurantId, {
          rating: avgRating,
          visitCount,
          lastVisit
        });
      });

              // 모든 레스토랑에 좌표와 상태 정보 추가
        const restaurantPromises = allRestaurants.map(async (restaurant): Promise<MapRestaurant> => {
          // 주소를 좌표로 변환
          const coordinates = await getCoordinatesFromAddress(restaurant.address);
          
          // 상태 결정
          let status: 'favorite' | 'visited' | 'normal' = 'normal';
          if (favoriteIds.has(restaurant.restaurantId)) {
            status = 'favorite';
          } else if (visitedIds.has(restaurant.restaurantId)) {
            status = 'visited';
          }

          // 통계 정보 가져오기 - 즐겨찾기 정보 우선, 없으면 리뷰 통계 사용
          const favoriteInfo = favoriteRestaurants.find(f => f.restaurantId === restaurant.restaurantId);
          const reviewStat = reviewStats.get(restaurant.restaurantId);
          
          // 즐겨찾기 정보가 있으면 우선 사용, 없으면 리뷰 통계 사용
          const rating = favoriteInfo?.rating || reviewStat?.rating;
          const visitCount = favoriteInfo?.visitCount || reviewStat?.visitCount;
          const lastVisit = favoriteInfo?.lastVisit || reviewStat?.lastVisit;

          return {
            restaurantId: restaurant.restaurantId,
            name: restaurant.name,
            category: restaurant.category,
            address: restaurant.address,
            lat: coordinates?.lat,
            lng: coordinates?.lng,
            status,
            rating,
            visitCount,
            lastVisit
          };
        });

      const restaurantsWithCoords = await Promise.all(restaurantPromises);
      console.log("좌표 변환 완료:", restaurantsWithCoords);

      setRestaurants(restaurantsWithCoords);
      setVisibleList(restaurantsWithCoords);
    } catch (error) {
      console.error("레스토랑 데이터 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCurrentLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => console.log("위치 정보를 불러오지 못해 기본 좌표 사용")
      );
    }
    
    // 레스토랑 데이터 불러오기
    fetchRestaurantData();
  }, []);

  // 마커 색상 및 아이콘 가져오기
  const getMarkerIcon = (status: 'favorite' | 'visited' | 'normal') => {
    let color = '#CCCCCC'; // 기본 회색
    let innerIcon = ''; // 내부 아이콘

    switch (status) {
      case 'favorite':
        color = '#FF4444'; // 빨간색
        innerIcon = '<path d="M16 6l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z" fill="white"/>'; // 별 모양
        break;
      case 'visited':
        color = '#4444FF'; // 파란색
        innerIcon = '<circle cx="16" cy="16" r="6" fill="white"/>'; // 내부 원형
        break;
      case 'normal':
        color = '#CCCCCC'; // 회색
        innerIcon = '<circle cx="16" cy="16" r="4" fill="white"/>'; // 작은 내부 원형
        break;
    }

    return new window.kakao.maps.MarkerImage(
      "data:image/svg+xml;base64," +
        btoa(`<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="${color}" opacity="0.9"/>
        ${innerIcon}
        </svg>`),
      new window.kakao.maps.Size(32, 32),
      { offset: new window.kakao.maps.Point(16, 16) }
    );
  };

  useEffect(() => {
    if (isLoading || restaurants.length === 0) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KAKAO_JS_KEY}`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapContainer.current) return;

        const kakaoMap = new window.kakao.maps.Map(mapContainer.current, {
          center: new window.kakao.maps.LatLng(
            currentLocation.lat,
            currentLocation.lng
          ),
          level: 4,
        });
        setMap(kakaoMap);

        // 현재 위치 마커
        new window.kakao.maps.Marker({
          map: kakaoMap,
          position: new window.kakao.maps.LatLng(
            currentLocation.lat,
            currentLocation.lng
          ),
          image: new window.kakao.maps.MarkerImage(
            "data:image/svg+xml;base64," +
              btoa('<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="#007AFF" stroke="white" stroke-width="2"/></svg>'),
            new window.kakao.maps.Size(20, 20)
          ),
        });

        // 레스토랑 마커들
        restaurants.forEach((restaurant) => {
          if (!restaurant.lat || !restaurant.lng) return;

          const marker = new window.kakao.maps.Marker({
            map: kakaoMap,
            position: new window.kakao.maps.LatLng(restaurant.lat, restaurant.lng),
            image: getMarkerIcon(restaurant.status),
          });

          const infoContent = `
            <div style="padding:8px;text-align:center;font-size:12px;min-width:120px">
              <b>${restaurant.name}</b><br/>
              <span style="color:#666;font-size:11px">${restaurant.category}</span><br/>
              ${restaurant.status === 'favorite' ? `<span style="color:#ff4444;font-size:10px">즐겨찾기</span>` : ''}
              ${restaurant.status === 'visited' ? `<span style="color:#4444ff;font-size:10px">방문함</span>` : ''}
            </div>
          `;

          const info = new window.kakao.maps.InfoWindow({
            content: infoContent,
          });

          window.kakao.maps.event.addListener(marker, "click", () =>
            info.open(kakaoMap, marker)
          );
        });

        const updateVisible = () => {
          const bounds = kakaoMap.getBounds();
          const list = restaurants.filter((r) => {
            if (!r.lat || !r.lng) return false;
            return bounds.contain(new window.kakao.maps.LatLng(r.lat, r.lng));
          });
          setVisibleList(list);
        };

        updateVisible();
        window.kakao.maps.event.addListener(kakaoMap, "idle", updateVisible);
      });
    };

    return () => {
      document.head.contains(script) && document.head.removeChild(script);
    };
  }, [currentLocation, restaurants, isLoading]);

  const filteredList = visibleList.filter(
    (r) =>
      r.name.includes(searchQuery.trim()) ||
      r.address.includes(searchQuery.trim())
  );

  return (
    <div className="min-h-screen pb-20 bg-white">
      <div className="relative">
        <div
          ref={mapContainer}
          className="h-96 w-full rounded-b-[10px] overflow-hidden bg-gray-100"
        />

        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="음식점 이름·주소 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-200"
            />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-sm text-xs flex gap-3">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-blue-500" />
            현재 위치
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
              <Star className="w-2 h-2 fill-white text-white" />
            </span>
            즐겨찾기
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-blue-600" />
            방문함
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-gray-400" />
            일반
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {isLoading && (
          <p className="text-sm text-gray-500 text-center py-4">
            음식점 정보를 불러오는 중...
          </p>
        )}
        {!isLoading && filteredList.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            현재 지도 범위에 음식점이 없습니다.
          </p>
        )}
        {!isLoading && filteredList.map((restaurant) => (
          <div key={restaurant.restaurantId} className="border-b border-gray-100 py-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-lg text-gray-900">{restaurant.name}</h3>
                  {restaurant.status === 'favorite' && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      즐겨찾기
                    </span>
                  )}
                  {restaurant.status === 'visited' && (
                    <span className="text-blue-600 text-sm flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-current" />
                      방문함
                    </span>
                  )}
                </div>
                
                {restaurant.rating && (
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < restaurant.rating!
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      {restaurant.rating?.toFixed(1)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {restaurant.address}
                </div>
                
                <p className="text-sm text-gray-500 mt-1">{restaurant.category}</p>
                
                {(restaurant.status === 'favorite' || restaurant.status === 'visited') && restaurant.visitCount && (
                  <p className="text-xs text-gray-400 mt-1">
                    방문 횟수: {restaurant.visitCount}회
                    {restaurant.lastVisit && ` · 최근 방문: ${restaurant.lastVisit}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
