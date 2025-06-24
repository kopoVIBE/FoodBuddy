"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Calendar, Clock } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import Image from "next/image";

// 임시 통계 데이터
const categoryStats = [
  { name: "한식", count: 8, color: "#EB4C34" },
  { name: "양식", count: 5, color: "#EB4C34CC" },
  { name: "일식", count: 4, color: "#EB4C3499" },
  { name: "중식", count: 2, color: "#EB4C3466" },
  { name: "카페", count: 3, color: "#EB4C3433" },
];

const monthlyStats = [
  { month: "10월", reviews: 2 },
  { month: "11월", reviews: 4 },
  { month: "12월", reviews: 6 },
  { month: "1월", reviews: 8 },
  { month: "2월", reviews: 5 },
  { month: "3월", reviews: 7 },
];

const ratingDistribution = [
  { rating: "5점", count: 8 },
  { rating: "4점", count: 12 },
  { rating: "3점", count: 3 },
  { rating: "2점", count: 1 },
  { rating: "1점", count: 0 },
];

const topRestaurants = [
  {
    id: 1,
    name: "맛있는 김치찌개",
    category: "한식",
    visitCount: 5,
    avgRating: 4.8,
    lastVisit: "2024-01-15",
  },
  {
    id: 2,
    name: "일본식 라멘",
    category: "일식",
    visitCount: 4,
    avgRating: 4.5,
    lastVisit: "2024-01-12",
  },
  {
    id: 3,
    name: "이탈리아 파스타",
    category: "양식",
    visitCount: 3,
    avgRating: 4.2,
    lastVisit: "2024-01-10",
  },
];

export default function StatisticsTab() {
  const { isDarkMode } = useApp();
  const totalReviews = 22;
  const averageRating = 4.3;
  const favoriteCategory = "한식";
  const thisMonthReviews = 7;

  // 툴팁 상태
  const [activeTooltip, setActiveTooltip] = useState<{
    x: number;
    y: number;
    data: any;
    type: string;
  } | null>(null);

  // 전체 카운트 계산
  const totalCount = categoryStats.reduce((sum, item) => sum + item.count, 0);

  // 퍼센트 계산 함수
  const getPercentage = (count: number) => {
    return ((count / totalCount) * 100).toFixed(1);
  };

  // 파이 차트 클릭 핸들러
  const onPieClick = (data: any, index: number, event: any) => {
    const rect = event.target.getBoundingClientRect();
    setActiveTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      data: data,
      type: "category",
    });

    // 3초 후 자동으로 숨김
    setTimeout(() => setActiveTooltip(null), 3000);
  };

  // 월별 차트 클릭 핸들러
  const onMonthlyClick = (data: any, event: any) => {
    const rect = event.target.getBoundingClientRect();
    setActiveTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      data: data,
      type: "monthly",
    });

    setTimeout(() => setActiveTooltip(null), 3000);
  };

  // 평점 차트 클릭 핸들러
  const onRatingClick = (data: any, event: any) => {
    const rect = event.target.getBoundingClientRect();
    setActiveTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      data: data,
      type: "rating",
    });

    setTimeout(() => setActiveTooltip(null), 3000);
  };

  // 커스텀 툴팁 렌더링
  const renderTooltip = () => {
    if (!activeTooltip) return null;

    const { x, y, data, type } = activeTooltip;

    let content = "";
    switch (type) {
      case "category":
        content = `${data.name}: ${data.count}회 (${getPercentage(
          data.count
        )}%)`;
        break;
      case "monthly":
        content = `${data.month}: ${data.reviews}개 리뷰`;
        break;
      case "rating":
        content = `${data.rating}: ${data.count}개 (${(
          (data.count / totalReviews) *
          100
        ).toFixed(1)}%)`;
        break;
    }

    return (
      <div
        className="fixed z-50 bg-white p-2 border border-gray-200 rounded shadow-lg pointer-events-none"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(-50%, -100%)",
        }}
      >
        <p className="text-sm font-medium whitespace-nowrap">{content}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4" style={{ outline: "none" }}>
      <style jsx>{`
        * :focus {
          outline: none !important;
        }
        svg * {
          outline: none !important;
        }
        .recharts-wrapper * {
          outline: none !important;
        }
      `}</style>
      {/* 헤더 섹션 */}
      <div className="relative w-full h-[72px] mb-3">
        {/* 로고 */}
        <div className="absolute left-[13px] top-[14px] w-[44px] h-[44px]">
          <Image
            src="/logo.svg"
            alt="FoodBuddy Logo"
            width={44}
            height={44}
            className="w-full h-full"
          />
        </div>

        {/* 버디와의 */}
        <div className="absolute left-[66px] top-[19px] w-[207px] h-[14px]">
          <h1 className="font-semibold text-base leading-[19px] text-[#333333]">
            버디와의
          </h1>
        </div>

        {/* 활동을 정리했어요! */}
        <div className="absolute left-[66px] top-[41px] w-[207px] h-[14px]">
          <p className="font-medium text-sm leading-4 text-[#666666]">
            활동을 정리했어요!
          </p>
        </div>
      </div>
      <Separator className={isDarkMode ? "bg-gray-700" : ""} />

      {/* 요약 통계 카드들 */}
      <div className="flex justify-center items-center gap-3">
        {/* 평균 평점 - 빨간색 배경 */}
        <div className="w-[164px] h-[71px] bg-[#EB4C34] border border-[#EB4C34] rounded-[10px] relative">
          <div className="absolute w-[62px] h-[25.82px] left-1/2 top-[12.52px] transform -translate-x-1/2">
            <div className="font-bold text-2xl leading-7 text-center text-white">
              {averageRating}
            </div>
          </div>
          <div className="absolute w-[46px] h-[15px] left-1/2 top-[43px] transform -translate-x-1/2">
            <div className="font-normal text-[11px] leading-[13px] text-center text-white">
              평균 평점
            </div>
          </div>
        </div>

        {/* 총 리뷰 수 - 흰색 배경 */}
        <div className="w-[164px] h-[71px] bg-white border border-[#EB4C34] rounded-[10px] relative">
          <div className="absolute w-[62px] h-[25.82px] left-1/2 top-[12.52px] transform -translate-x-1/2">
            <div className="font-bold text-2xl leading-7 text-center text-[#EB4C34]">
              {totalReviews}
            </div>
          </div>
          <div className="absolute w-[46px] h-[15px] left-1/2 top-[43px] transform -translate-x-1/2">
            <div className="font-normal text-[11px] leading-[13px] text-center text-[#333333]">
              총 리뷰 수
            </div>
          </div>
        </div>
      </div>

      {/* 이번 달 활동 */}
      <Card
        className={`border-0 shadow-none ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-[#EB4C34]" />
            <h3
              className={`text-sm font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              이번 달 활동
            </h3>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#EB4C34] mb-1">
              {thisMonthReviews}개
            </div>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              이번 달 작성한 리뷰
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 선호하는 음식 - 파이 차트 */}
      <Card
        className={`border-0 shadow-none ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-[#EB4C34]" />
            <h3
              className={`text-sm font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              선호하는 음식
            </h3>
          </div>

          {/* 파이 차트 */}
          <div className="h-32 mb-3 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="count"
                  animationBegin={0}
                  animationDuration={800}
                  onClick={onPieClick}
                  style={{ cursor: "pointer" }}
                >
                  {categoryStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      style={{ outline: "none" }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 범례 */}
          <div className="space-y-2">
            {categoryStats.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {category.count}회 ({getPercentage(category.count)}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 월별 리뷰 트렌드 - 라인 차트 */}
      <Card
        className={`border-0 shadow-none ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-[#EB4C34]" />
            <h3
              className={`text-sm font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              월별 리뷰 트렌드
            </h3>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyStats}
                onClick={onMonthlyClick}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 10,
                    fill: isDarkMode ? "#d1d5db" : "#6b7280",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: isDarkMode ? "#d1d5db" : "#6b7280",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={20}
                />
                <Line
                  type="monotone"
                  dataKey="reviews"
                  stroke="#EB4C34"
                  strokeWidth={2}
                  dot={{
                    fill: "#EB4C34",
                    strokeWidth: 2,
                    r: 3,
                    cursor: "pointer",
                  }}
                  activeDot={{
                    fill: "#EB4C34",
                    strokeWidth: 2,
                    r: 4,
                  }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 평점 분포 - 바 차트 */}
      <Card
        className={`border-0 shadow-none ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-[#EB4C34]" />
            <h3
              className={`text-sm font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              평점 분포
            </h3>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ratingDistribution}
                onClick={onRatingClick}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "#374151" : "#f3f4f6"}
                />
                <XAxis
                  dataKey="rating"
                  tick={{
                    fontSize: 10,
                    fill: isDarkMode ? "#d1d5db" : "#6b7280",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: isDarkMode ? "#d1d5db" : "#6b7280",
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={20}
                />
                <Bar
                  dataKey="count"
                  fill="#EB4C34"
                  radius={[2, 2, 0, 0]}
                  animationDuration={800}
                  style={{ cursor: "pointer", outline: "none" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 자주 방문한 음식점 */}
      <Card
        className={`border-0 shadow-none ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-[#EB4C34]" />
            <h3
              className={`text-sm font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              자주 방문한 음식점
            </h3>
          </div>

          <div className="space-y-3">
            {topRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="flex items-center gap-3 p-3 bg-[#EB4C3410] dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-center w-6 h-6 bg-[#EB4C34] text-white rounded-full text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-medium text-sm truncate ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {restaurant.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-[#EB4C3420] text-[#EB4C34] border-[#EB4C3440]"
                    >
                      {restaurant.category}
                    </Badge>
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {restaurant.visitCount}회 방문
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[#EB4C34] text-[#EB4C34]" />
                  <span
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {restaurant.avgRating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 클릭 시 나타나는 툴팁 */}
      {renderTooltip()}
    </div>
  );
}
