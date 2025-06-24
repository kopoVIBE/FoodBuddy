"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, Star, MapPin } from "lucide-react";
import { useApp } from "@/contexts/app-context";

declare global {
  interface Window {
    kakao: any;
  }
}

// 🔑 하드코딩된 API 키
const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVA_SCRIPT_KEY;

const visitedRestaurants = [
  {
    id: 1,
    name: "마aba늘",
    rating: 5,
    address: "서울 강남 자원동 72",
    date: "2025-06-22",
    lat: 37.5665,
    lng: 126.978,
  },
  {
    id: 2,
    name: "비놀릭",
    rating: 5,
    address: "서울 광진 자양동 72",
    date: "2025-06-20",
    lat: 37.5675,
    lng: 126.979,
  },
  {
    id: 3,
    name: "김치찌개집",
    rating: 4,
    address: "서울 강남 테헤란로 123",
    date: "2025-06-18",
    lat: 37.5685,
    lng: 126.98,
  },
  {
    id: 4,
    name: "파스타하우스",
    rating: 5,
    address: "서울 마포 홍대입구",
    date: "2025-06-15",
    lat: 37.5695,
    lng: 126.981,
  },
  {
    id: 5,
    name: "일본식 라멘",
    rating: 4,
    address: "서울 강남 역삼동",
    date: "2025-06-12",
    lat: 37.5655,
    lng: 126.977,
  },
  {
    id: 6,
    name: "중국집",
    rating: 3,
    address: "서울 서초",
    date: "2025-06-10",
    lat: 37.5645,
    lng: 126.975,
  },
  {
    id: 7,
    name: "타코플레이스",
    rating: 4,
    address: "서울 용산 후암동",
    date: "2025-06-09",
    lat: 37.553,
    lng: 126.971,
  },
  {
    id: 8,
    name: "버거킹즈",
    rating: 3,
    address: "서울 송파 잠실",
    date: "2025-06-07",
    lat: 37.5115,
    lng: 127.098,
  },
  {
    id: 9,
    name: "베이글샵",
    rating: 5,
    address: "서울 종로 인사동",
    date: "2025-06-05",
    lat: 37.5743,
    lng: 126.9849,
  },
  {
    id: 10,
    name: "케이크숍",
    rating: 4,
    address: "서울 은평 응암동",
    date: "2025-06-03",
    lat: 37.602,
    lng: 126.927,
  },
];

export default function MapPage() {
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.5665,
    lng: 126.978,
  });
  const [visibleList, setVisibleList] = useState(visitedRestaurants);
  const mapContainer = useRef<HTMLDivElement>(null);

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
  }, []);

  useEffect(() => {
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

        new window.kakao.maps.Marker({
          map: kakaoMap,
          position: new window.kakao.maps.LatLng(
            currentLocation.lat,
            currentLocation.lng
          ),
          image: new window.kakao.maps.MarkerImage(
            "data:image/svg+xml;base64," +
              btoa(`<svg width="20" height="20" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="#007AFF"
            stroke="white" stroke-width="2"/></svg>`),
            new window.kakao.maps.Size(20, 20)
          ),
        });

        visitedRestaurants.forEach((r) => {
          const marker = new window.kakao.maps.Marker({
            map: kakaoMap,
            position: new window.kakao.maps.LatLng(r.lat, r.lng),
            image: new window.kakao.maps.MarkerImage(
              "data:image/svg+xml;base64," +
                btoa(`<svg width="32" height="32" viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#FF4444"
              opacity="0.9"/><path d="M16 6l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z"
              fill="white"/></svg>`),
              new window.kakao.maps.Size(32, 32),
              { offset: new window.kakao.maps.Point(16, 16) }
            ),
          });

          const info = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:8px;text-align:center;font-size:12px">
                        <b>${r.name}</b><br/><span style="color:#666;font-size:11px">${r.date}</span>
                      </div>`,
          });
          window.kakao.maps.event.addListener(marker, "click", () =>
            info.open(kakaoMap, marker)
          );
        });

        const updateVisible = () => {
          const bounds = kakaoMap.getBounds();
          const list = visitedRestaurants.filter((r) =>
            bounds.contain(new window.kakao.maps.LatLng(r.lat, r.lng))
          );
          setVisibleList(list);
        };

        updateVisible();
        window.kakao.maps.event.addListener(kakaoMap, "idle", updateVisible);
      });
    };

    return () => {
      document.head.contains(script) && document.head.removeChild(script);
    };
  }, [currentLocation]);

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
            방문한 음식점
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {filteredList.length === 0 && (
          <p className="text-sm text-gray-500">
            현재 지도 범위에 음식점이 없습니다.
          </p>
        )}
        {filteredList.map((r) => (
          <div key={r.id} className="border-b border-gray-100 py-3">
            <h3 className="font-medium text-lg text-gray-900">{r.name}</h3>
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < r.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              {r.address}
            </div>
            <p className="text-sm text-gray-500 mt-1">{r.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
