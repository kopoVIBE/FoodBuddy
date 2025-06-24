"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import ShareModal from "@/components/share-modal";
import ReviewDetailModal from "@/components/review-detail-modal";
import ReviewEditModal from "@/components/review-edit-modal";
import RestaurantDetailModal from "@/components/restaurant-detail-modal";
import RestaurantReviewsModal from "@/components/restaurant-reviews-modal";
import { useApp } from "@/contexts/app-context";
import { useRouter } from "next/navigation";
import {
  getMyDetailedReviews,
  MyReviewResponse,
  getMyFavoriteRestaurants,
  FavoriteRestaurantInfo,
  addFavorite,
  removeFavorite,
  deleteReview,
} from "@/lib/api";

// 임시 데이터
const myReviews = [
  {
    id: 1,
    restaurantName: "비놀릭",
    location: "서울시 광진구 자양동 72",
    rating: 5,
    date: "2025-06-22",
    content:
      "오늘 방문한 비놀릭은 분위기부터 너무 좋았어요. 크림 파스타는 부드럽고 고소해서 입안에서 살살 녹았고, 해산물 토마토 파스타는 신선한 재료 덕분에 감칠맛이 일품이었습니다. 다음엔 친구랑 다시 오고 싶어요 😊",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["양식", "파스타", "저녁"],
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
    receiptImage: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 3,
    restaurantName: "가마솥 김치찌개",
    location: "서울시 강남구",
    rating: 4.5,
    date: "2024-12-15",
    content:
      "김치찌개가 정말 맛있었어요. 김치가 잘 익어서 깊은 맛이 나고, 돼지고기도 부드러웠습니다.",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["한식", "김치찌개", "점심"],
    isFavorite: false,
    receiptImage: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 4,
    restaurantName: "비놀릭",
    location: "서울시 광진구 자양동 72",
    rating: 4.8,
    date: "2024-11-15",
    content:
      "두 번째 방문인데 역시 맛있어요. 이번엔 알리오올리오를 먹었는데 마늘향이 정말 좋았습니다.",
    image: "/placeholder.svg?height=200&width=300",
    tags: ["양식", "파스타", "저녁"],
    isFavorite: false,
    receiptImage: "/placeholder.svg?height=150&width=100",
  },
];

// 하드코딩된 즐겨찾기 데이터 제거됨 - 이제 API에서 가져옴

// 스플래시 화면 컴포넌트
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3초로 변경

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] min-h-screen bg-gradient-to-b from-[#FF5722] to-[#FF7043] flex items-center justify-center relative overflow-hidden">
      {/* 메인 콘텐츠 */}
      <div className="text-center animate-in fade-in zoom-in duration-1000">
        {/* 로고 */}
        <div className="mb-8 animate-pulse">
          <Image
            src="/images/logo_splash.png"
            alt="FoodBuddy Logo"
            width={120}
            height={120}
            className="mx-auto drop-shadow-lg"
            priority
          />
        </div>

        {/* 앱 이름 */}
        <h1 className="text-4xl font-bold text-white mb-12 tracking-wide">
          FoodBuddy
        </h1>

        {/* 로딩 애니메이션 */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const {
    t,
    isDarkMode,
    nickname,
    isAuthenticated: globalIsAuthenticated,
    setUserInfo,
    logout,
  } = useApp();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"written" | "favorites">(
    "written"
  );
  const [sortOrder, setSortOrder] = useState("latest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [shareModal, setShareModal] = useState({
    isOpen: false,
    title: "",
    content: "",
  });
  const [reviewDetailModal, setReviewDetailModal] = useState<{
    isOpen: boolean;
    review: any;
  }>({ isOpen: false, review: null });
  const [restaurantDetailModal, setRestaurantDetailModal] = useState<{
    isOpen: boolean;
    restaurant: any;
  }>({ isOpen: false, restaurant: null });
  const [reviewEditModal, setReviewEditModal] = useState<{
    isOpen: boolean;
    review: any;
  }>({ isOpen: false, review: null });
  const [restaurantReviewsModal, setRestaurantReviewsModal] = useState<{
    isOpen: boolean;
    restaurantName: string;
    reviews: any[];
  }>({
    isOpen: false,
    restaurantName: "",
    reviews: [],
  });

  // 즐겨찾기 데이터 상태
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<
    FavoriteRestaurantInfo[]
  >([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const [favoriteStates, setFavoriteStates] = useState<{
    [key: string]: boolean;
  }>({});

  // 즐겨찾기 데이터 불러오기
  const fetchFavoriteRestaurants = async () => {
    try {
      setFavoritesLoading(true);
      console.log("즐겨찾기 데이터 요청 시작");
      const favorites = await getMyFavoriteRestaurants();
      console.log("받은 즐겨찾기 데이터:", favorites);

      // API 응답이 배열인지 확인
      if (Array.isArray(favorites)) {
        setFavoriteRestaurants(favorites);

        // 초기 즐겨찾기 상태 설정
        const initialStates = Object.fromEntries(
          favorites.map((fav) => [fav.restaurantId, true])
        );
        setFavoriteStates(initialStates);
      } else {
        console.error(
          "즐겨찾기 데이터가 배열이 아닙니다:",
          typeof favorites,
          favorites
        );
        setFavoriteRestaurants([]);
        setFavoriteStates({});
      }
    } catch (error) {
      console.error("즐겨찾기 데이터 불러오기 실패:", error);
      setFavoriteRestaurants([]);
      setFavoriteStates({});
    } finally {
      setFavoritesLoading(false);
    }
  };

  const toggleFavorite = async (restaurantId: string) => {
    try {
      const isCurrentlyFavorited = favoriteStates[restaurantId];

      if (isCurrentlyFavorited) {
        await removeFavorite(restaurantId);
        setFavoriteStates((prev) => ({
          ...prev,
          [restaurantId]: false,
        }));
        // 즐겨찾기 목록에서 제거
        setFavoriteRestaurants((prev) =>
          prev.filter((fav) => fav.restaurantId !== restaurantId)
        );
      } else {
        await addFavorite(restaurantId);
        setFavoriteStates((prev) => ({
          ...prev,
          [restaurantId]: true,
        }));
        // 데이터를 다시 불러와서 최신 상태로 업데이트
        fetchFavoriteRestaurants();
      }
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);
    }
  };

  // 실제 리뷰 데이터
  const [myReviews, setMyReviews] = useState<MyReviewResponse[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // 리뷰 데이터 불러오기
  const fetchMyReviews = async () => {
    try {
      setReviewsLoading(true);
      console.log("리뷰 데이터 요청 시작:", sortOrder);
      const reviews = await getMyDetailedReviews(sortOrder);
      console.log("받은 리뷰 데이터:", reviews);
      setMyReviews(reviews);
    } catch (error) {
      console.error("리뷰 데이터 불러오기 실패:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // 리뷰 데이터를 UI에서 사용할 형태로 변환
  const formattedReviews = useMemo(() => {
    console.log("formattedReviews 계산 중:", myReviews);
    const formatted = myReviews.map((review) => {
      // Base64 이미지 처리
      let imageUrl = "/placeholder.svg?height=200&width=300";
      if (review.originalImg) {
        // 이미 data URL 형식인지 확인
        if (review.originalImg.startsWith("data:image/")) {
          imageUrl = review.originalImg;
        } else {
          // Base64 데이터만 있는 경우 prefix 추가
          imageUrl = `data:image/jpeg;base64,${review.originalImg}`;
        }
      }

      // 즐겨찾기 상태 확인
      const isFavorited = favoriteStates[review.restaurantId] || false;

      return {
        id: parseInt(review.reviewId.replace(/-/g, "").substring(0, 8), 16),
        restaurantName: review.restaurantName || "알 수 없는 식당",
        location: review.restaurantAddress || "주소 없음",
        rating: Number(review.rating),
        date: new Date(review.createdAt).toISOString().split("T")[0],
        content: review.content,
        image: imageUrl,
        tags: [review.restaurantCategory || "기타"],
        isFavorite: isFavorited,
        receiptImage: imageUrl,
        restaurantId: review.restaurantId, // 즐겨찾기 기능을 위해 추가
        reviewId: review.reviewId, // 리뷰 삭제를 위해 추가
      };
    });
    console.log("변환된 리뷰 데이터:", formatted);
    return formatted;
  }, [myReviews, favoriteStates]);

  // 스플래시 화면과 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      if (typeof window === "undefined") return;

      const authToken = localStorage.getItem("accessToken");
      const hasShownSplash = sessionStorage.getItem("hasShownSplash");

      console.log("인증 상태 확인:", {
        authToken: !!authToken,
        hasShownSplash,
      });

      if (!hasShownSplash) {
        setShowSplash(true);
        setTimeout(() => {
          setShowSplash(false);
          setIsLoading(false);
          sessionStorage.setItem("hasShownSplash", "true");
          if (!authToken) {
            router.replace("/auth");
          } else {
            fetchMyReviews();
            fetchFavoriteRestaurants();
          }
        }, 3000);
      } else {
        if (!authToken) {
          setIsLoading(false);
          router.replace("/auth");
        } else {
          setIsLoading(false);
          fetchMyReviews();
          fetchFavoriteRestaurants();
        }
      }
    };

    checkAuthStatus();
  }, [router]);

  // 정렬 순서 변경 시 데이터 다시 불러오기
  useEffect(() => {
    if (!isLoading && !showSplash && globalIsAuthenticated) {
      console.log("정렬 순서 변경으로 인한 데이터 재요청:", sortOrder);
      fetchMyReviews();
    }
  }, [sortOrder]);

  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "oldest", label: "오래된순" },
    { value: "alphabetical", label: "가나다순" },
  ];

  // 정렬된 리뷰 목록
  const sortedReviews = useMemo(() => {
    console.log("sortedReviews 계산 중:", formattedReviews, "정렬:", sortOrder);
    const reviewsCopy = [...formattedReviews];

    switch (sortOrder) {
      case "latest":
        return reviewsCopy.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "oldest":
        return reviewsCopy.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "alphabetical":
        return reviewsCopy.sort((a, b) =>
          a.restaurantName.localeCompare(b.restaurantName, "ko")
        );
      default:
        return reviewsCopy;
    }
  }, [formattedReviews, sortOrder]);

  // 로딩 중인 경우 빈 화면 표시 (리디렉션 중)
  if (isLoading && !showSplash) {
    return null;
  }

  // 인증되지 않은 경우 빈 화면 (리디렉션 중)
  if (!globalIsAuthenticated && !showSplash) {
    return null;
  }

  // 스플래시 화면이 표시 중이면 스플래시만 보여줌
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // 플로팅 버튼 클릭 핸들러
  const handleFloatingButtonClick = () => {
    router.push("/write");
  };

  // 정렬 옵션 선택 핸들러
  const handleSortSelect = (value: string) => {
    setSortOrder(value);
    setShowSortMenu(false);
  };

  // 현재 선택된 정렬 옵션의 라벨 가져오기
  const getCurrentSortLabel = () => {
    return (
      sortOptions.find((option) => option.value === sortOrder)?.label ||
      "최신순"
    );
  };

  // 즐겨찾기 카드 클릭 핸들러
  const handleFavoriteCardClick = (restaurantName: string) => {
    const restaurantReviews = formattedReviews.filter(
      (review) => review.restaurantName === restaurantName
    );
    setRestaurantReviewsModal({
      isOpen: true,
      restaurantName,
      reviews: restaurantReviews,
    });
  };

  console.log("렌더링 시점 데이터:", {
    myReviews: myReviews.length,
    formattedReviews: formattedReviews.length,
    sortedReviews: sortedReviews.length,
    reviewsLoading,
    activeTab,
    favoriteRestaurants: favoriteRestaurants.length,
    favoriteRestaurantsType: typeof favoriteRestaurants,
    favoriteRestaurantsArray: Array.isArray(favoriteRestaurants),
    favoritesLoading,
  });

  return (
    <div
      className={`min-h-screen pb-20 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* 헤더 */}
      <div className={`px-4 py-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <div>
              <h1
                className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {t("hello").replace("마틸", nickname || "게스트")}
              </h1>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("goodDay")}
              </p>
            </div>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex mb-4">
            <button
              onClick={() => setActiveTab("written")}
              className={`flex-1 pb-2 text-sm font-medium border-b-2 ${
                activeTab === "written"
                  ? "text-red-500 border-red-500"
                  : `${
                      isDarkMode
                        ? "text-gray-400 border-gray-600"
                        : "text-gray-500 border-gray-300"
                    }`
              }`}
            >
              작성한 리뷰
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex-1 pb-2 text-sm font-medium border-b-2 ${
                activeTab === "favorites"
                  ? "text-red-500 border-red-500"
                  : `${
                      isDarkMode
                        ? "text-gray-400 border-gray-600"
                        : "text-gray-500 border-gray-300"
                    }`
              }`}
            >
              즐겨찾기
            </button>
          </div>

          {/* 통계 + 정렬 공통 헤더 */}
          <div className="flex justify-between items-center">
            {activeTab === "written" && (
              <>
                <p className="text-lg font-bold">
                  <span className="text-[#EB4C34]">버디</span>
                  <span className="text-[#1D1D1D]">가 남긴 맛집 리뷰 </span>
                  <span className="text-[#EB4C34] text-xl">
                    {sortedReviews.length}
                  </span>
                  <span className="text-[#1D1D1D]">개</span>
                </p>

                <div className="relative">
                  <Button
                    size="sm"
                    className={`rounded-full px-4 ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                    }`}
                    onClick={() => setShowSortMenu(!showSortMenu)}
                  >
                    {getCurrentSortLabel()}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>

                  {showSortMenu && (
                    <div
                      className={`absolute top-full right-0 mt-1 rounded-lg shadow-lg z-10 ${
                        isDarkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      } border`}
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            isDarkMode
                              ? "text-white hover:bg-gray-700"
                              : "text-gray-900"
                          }`}
                          onClick={() => handleSortSelect(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "favorites" && (
              <>
                <p className="text-lg font-bold">
                  <span className="text-[#EB4C34]">버디</span>
                  <span className="text-[#1D1D1D]">
                    가 자주 가는 단골 맛집{" "}
                  </span>
                  <span className="text-[#EB4C34] text-xl">
                    {favoriteRestaurants.length}
                  </span>
                  <span className="text-[#1D1D1D]">곳이에요!</span>
                </p>
                <div></div> {/* 정렬 버튼 자리 유지용 (필요 시 삭제 가능) */}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* 작성한 리뷰 탭 */}
        {activeTab === "written" && (
          <>
            {reviewsLoading ? (
              <div className="text-center py-8">
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  리뷰를 불러오는 중...
                </p>
              </div>
            ) : sortedReviews.length === 0 ? (
              <div className="text-center py-8">
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  아직 작성한 리뷰가 없습니다.
                </p>
                <p
                  className={`text-sm mt-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  버디와 리뷰를 생성하러 가 볼까요?
                </p>
                <Button
                  onClick={() => router.push("/write")}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white"
                >
                  첫 리뷰 작성하기
                </Button>
              </div>
            ) : (
              sortedReviews.map((review) => (
                <Card
                  key={review.id}
                  className={`relative overflow-hidden cursor-pointer transition-colors border-0 shadow-sm w-full ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                  onClick={() => setReviewDetailModal({ isOpen: true, review })}
                >
                  <CardContent className="p-3">
                    {/* 상단: 음식점 이름, 별점, 날짜 */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold text-sm ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {review.restaurantName}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-[14px] h-[14px] ${
                                  i < review.rating
                                    ? "fill-[#FFDC17] text-[#FFDC17]"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span
                            className={`text-xs ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {review.rating}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {review.date}
                      </span>
                    </div>

                    {/* 위치 정보 */}
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin
                        className={`w-3 h-3 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {review.location}
                      </span>
                    </div>

                    {/* 리뷰 내용과 이미지 */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <p
                          className={`text-sm leading-relaxed ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          {review.content}
                        </p>
                      </div>
                      {review.image && (
                        <div className="w-16 h-16 flex-shrink-0">
                          <Image
                            src={review.image}
                            alt="영수증"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}

        {/* 즐겨찾기 탭 */}
        {activeTab === "favorites" && (
          <>
            {favoritesLoading ? (
              <div className="text-center py-8">
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  즐겨찾기를 불러오는 중...
                </p>
              </div>
            ) : favoriteRestaurants.length === 0 ? (
              <div className="text-center py-12">
                <Image
                  src="/icons/heart-filled.svg"
                  alt="Heart"
                  width={48}
                  height={48}
                  className={`mx-auto mb-4 opacity-40`}
                />
                <h3
                  className={`text-lg font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  즐겨찾기가 없습니다
                </h3>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  마음에 드는 음식점을 즐겨찾기에 추가해보세요
                </p>
              </div>
            ) : (
              Array.isArray(favoriteRestaurants) &&
              favoriteRestaurants.map((restaurant) => (
                <Card
                  key={restaurant.restaurantId}
                  className="relative overflow-hidden cursor-pointer w-full  transition-colors border-10 shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                  onClick={() =>
                    handleFavoriteCardClick(restaurant.restaurantName)
                  }
                >
                  <CardContent className="p-3 min-h-[90px] relative">
                    {/* 하트 아이콘 - 오른쪽 상단 */}
                    <div
                      className="absolute top-3 right-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(restaurant.restaurantId);
                      }}
                    >
                      <Image
                        src={
                          favoriteStates[restaurant.restaurantId]
                            ? "/icons/heart-filled.svg"
                            : "/icons/heart-unfilled.svg"
                        }
                        alt="Heart"
                        width={20}
                        height={18}
                        className="w-5 h-[18px] cursor-pointe"
                      />
                    </div>

                    {/* 메인 콘텐츠 */}
                    <div className="pr-8">
                      {/* 음식점 이름과 별점 */}
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[13.2px] font-medium text-[#333333] leading-[15.6px]">
                          {restaurant.restaurantName}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Image
                            src="/icons/star-filled.svg"
                            alt="Star"
                            width={12}
                            height={12}
                            className="w-3 h-3"
                          />
                          <span className="text-[13.2px] font-medium text-[#333333] leading-[15.6px]">
                            {restaurant.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* 주소 */}
                      <div className="flex items-center gap-1 mb-2">
                        <Image
                          src="/icons/location-pin.svg"
                          alt="Location"
                          width={7}
                          height={10}
                          className="w-[7px] h-[10px]"
                        />
                        <span className="text-[9.6px] font-normal text-[#BCBCBC] leading-[10.8px]">
                          {restaurant.restaurantAddress}
                        </span>
                      </div>

                      {/* 방문 정보 */}
                      <div className="space-y-1">
                        <div className="text-[10.8px] font-normal text-[#666666] leading-[13.2px]">
                          방문 횟수 : {restaurant.visitCount}회
                        </div>
                        <div className="text-[10.8px] font-normal text-[#666666] leading-[13.2px]">
                          최근 방문 : {restaurant.lastVisit}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}
      </div>

      {/* 플로팅 버튼 */}
      <button
        onClick={handleFloatingButtonClick}
        className="fixed bottom-24 right-4 w-10 h-10 bg-[#EB4C34] rounded-full shadow-lg hover:bg-[#d63e2a] transition-colors z-50 flex items-center justify-center"
      >
        {/* 플러스 아이콘 */}
        <div className="relative">
          {/* 세로선 */}
          <div className="absolute w-[2px] h-[14px] bg-white rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          {/* 가로선 */}
          <div className="absolute w-[14px] h-[2px] bg-white rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </button>

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
          setReviewDetailModal({ isOpen: false, review: null });
          setShareModal({ isOpen: true, title, content });
        }}
        onFavoriteToggle={async (
          restaurantId: string,
          shouldBeFavorited: boolean
        ) => {
          try {
            console.log(
              `즐겨찾기 토글: ${restaurantId}, shouldBeFavorited: ${shouldBeFavorited}`
            );
            if (shouldBeFavorited) {
              // 즐겨찾기에 추가
              await addFavorite(restaurantId);
              console.log("즐겨찾기 추가 완료");
            } else {
              // 즐겨찾기에서 제거
              await removeFavorite(restaurantId);
              console.log("즐겨찾기 제거 완료");
            }
            // 즐겨찾기 목록 새로고침
            await fetchFavoriteRestaurants();
          } catch (error) {
            console.error("즐겨찾기 토글 실패:", error);
            throw error;
          }
        }}
        onDelete={async (reviewId: string) => {
          try {
            console.log("리뷰 삭제 시작:", reviewId);
            await deleteReview(reviewId);
            console.log("리뷰 삭제 완료");
            // 리뷰 목록 새로고침
            await fetchMyReviews();
            await fetchFavoriteRestaurants();
          } catch (error) {
            console.error("리뷰 삭제 실패:", error);
            throw error;
          }
        }}
        className="z-[60]"
      />

      <RestaurantDetailModal
        isOpen={restaurantDetailModal.isOpen}
        onClose={() =>
          setRestaurantDetailModal({ isOpen: false, restaurant: null })
        }
        restaurant={restaurantDetailModal.restaurant}
        className="z-[60]"
      />

      <ReviewEditModal
        isOpen={reviewEditModal.isOpen}
        onClose={() => setReviewEditModal({ isOpen: false, review: null })}
        review={reviewEditModal.review}
        onSave={(updatedReview) => {
          // 리뷰 업데이트 로직
          console.log("Updated review:", updatedReview);
          setReviewEditModal({ isOpen: false, review: null });
        }}
        className="z-[60]"
      />

      <RestaurantReviewsModal
        isOpen={restaurantReviewsModal.isOpen}
        onClose={() =>
          setRestaurantReviewsModal({
            isOpen: false,
            restaurantName: "",
            reviews: [],
          })
        }
        restaurantName={restaurantReviewsModal.restaurantName}
        reviews={restaurantReviewsModal.reviews}
        className="z-[60]"
      />
    </div>
  );
}
