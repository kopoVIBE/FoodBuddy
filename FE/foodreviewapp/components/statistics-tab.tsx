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
import { useState, useEffect } from "react";
import Image from "next/image";
import { getUserStatistics, UserStatisticsResponse } from "@/lib/api";

// 색상 정의
const BASE_COLOR = "#EB4C34";
const OPACITY_LEVELS = ["FF", "CC", "99", "66", "33"]; // 100%, 80%, 60%, 40%, 20%

export default function StatisticsTab() {
  const { isDarkMode } = useApp();
  const [statistics, setStatistics] = useState<UserStatisticsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<{
    x: number;
    y: number;
    data: any;
    type: string;
  } | null>(null);

  // 데이터 로드
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const data = await getUserStatistics();
        setStatistics(data);
      } catch (error) {
        console.error("통계 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistics();
  }, []);

  if (isLoading || !statistics) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-[#EB4C34] rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-sm text-gray-600">통계를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 카테고리 데이터 변환
  const categoryData = Object.entries(statistics.categoryDistribution)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count) // 비중이 높은 순으로 정렬
    .map((item, index) => ({
      ...item,
      color: `${BASE_COLOR}${
        OPACITY_LEVELS[index] || OPACITY_LEVELS[OPACITY_LEVELS.length - 1]
      }`,
    }));

  // 월별 데이터 변환 (최근 5개월)
  const monthlyData = Object.entries(statistics.monthlyReviewCount)
    .map(([yearMonth, count]) => {
      const [year, month] = yearMonth.split("-");
      return {
        month: `${parseInt(month)}월`,
        reviews: count,
        yearMonth, // 정렬용
      };
    })
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth))
    .slice(-5);

  // 평점 분포 데이터 변환
  const ratingData = Object.entries(statistics.ratingDistribution)
    .map(([rating, count]) => ({
      rating: `${rating}점`,
      count,
    }))
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));

  // 전체 카운트 계산
  const totalCount = categoryData.reduce((sum, item) => sum + item.count, 0);

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

    setTimeout(() => setActiveTooltip(null), 3000);
  };

  // 월별 차트 클릭 핸들러
  const onMonthlyClick = (data: any) => {
    if (!data || !data.activePayload || !data.activePayload[0]) return;

    const clickedData = data.activePayload[0].payload;
    const element = document.querySelector(".recharts-wrapper");
    if (!element) return;

    const rect = element.getBoundingClientRect();

    setActiveTooltip({
      x: data.chartX,
      y: rect.top,
      data: clickedData,
      type: "monthly",
    });

    setTimeout(() => setActiveTooltip(null), 3000);
  };

  // 평점 차트 클릭 핸들러
  const onRatingClick = (data: any) => {
    if (!data || !data.activePayload || !data.activePayload[0]) return;

    const clickedData = data.activePayload[0].payload;
    const element = document.querySelector(".recharts-wrapper");
    if (!element) return;

    const rect = element.getBoundingClientRect();

    setActiveTooltip({
      x: data.chartX,
      y: rect.top,
      data: clickedData,
      type: "rating",
    });

    setTimeout(() => setActiveTooltip(null), 3000);
  };

  // 커스텀 툴팁 렌더링
  const renderTooltip = () => {
    if (!activeTooltip || !activeTooltip.data) return null;

    const { x, y, data, type } = activeTooltip;

    let content = "";
    switch (type) {
      case "monthly":
        content = `${data.month}: ${data.reviews}개 리뷰`;
        break;
      case "rating":
        content = `${data.rating}점: ${data.count}개 (${(
          (data.count / statistics.totalReviewCount) *
          100
        ).toFixed(1)}%)`;
        break;
      case "category":
        content = `${data.name}: ${data.count}회 (${getPercentage(
          data.count
        )}%)`;
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

  // 파이 차트 렌더링 함수
  const renderPieChart = () => {
    return (
      <div className="h-32 mb-3 relative">
        <ResponsiveContainer width="100%" height="100%">
          {totalCount === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                아직 리뷰를 작성하지 않았어요!
              </p>
            </div>
          ) : (
            <PieChart>
              <Pie
                data={categoryData}
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
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{ outline: "none" }}
                  />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  // 라인 차트 렌더링 함수
  const renderLineChart = () => {
    return (
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          {monthlyData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                아직 리뷰를 작성하지 않았어요!
              </p>
            </div>
          ) : (
            <LineChart
              data={monthlyData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              onClick={onMonthlyClick}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#374151" : "#f3f4f6"}
              />
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
                  cursor: "pointer",
                }}
                animationDuration={1000}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  // 바 차트 렌더링 함수
  const renderBarChart = () => {
    return (
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          {ratingData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                아직 리뷰를 작성하지 않았어요!
              </p>
            </div>
          ) : (
            <BarChart
              data={ratingData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              onClick={onRatingClick}
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
                cursor="pointer"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
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
        <div className="absolute left-[13px] top-[14px] w-[44px] h-[44px]">
          <Image
            src="/logo.svg"
            alt="FoodBuddy Logo"
            width={44}
            height={44}
            className="w-full h-full"
          />
        </div>

        <div className="absolute left-[66px] top-[19px] w-[207px] h-[14px]">
          <h1
            className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            버디와의
          </h1>
        </div>

        <div className="absolute left-[66px] top-[41px] w-[207px] h-[14px]">
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            활동을 정리했어요!
          </p>
        </div>
      </div>
      <Separator className={isDarkMode ? "bg-gray-700" : ""} />

      {/* 요약 통계 카드들 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 평균 평점 */}
        <div className="w-[164px] h-[71px] bg-[#EB4C34] border border-[#EB4C34] rounded-[10px] relative">
          <div className="absolute w-[62px] h-[25.82px] left-1/2 top-[12.52px] transform -translate-x-1/2">
            <div className="font-bold text-2xl leading-7 text-center text-white">
              {statistics.avgRating.toFixed(1)}
            </div>
          </div>
          <div className="absolute w-[80px] h-[15px] left-1/2 top-[43px] transform -translate-x-1/2">
            <div className="font-normal text-[11px] leading-[13px] text-center text-white">
              평균 평점
            </div>
          </div>
        </div>

        {/* 총 리뷰 수 */}
        <div className="w-[164px] h-[71px] bg-[#EB4C34] border border-[#EB4C34] rounded-[10px] relative">
          <div className="absolute w-[62px] h-[25.82px] left-1/2 top-[12.52px] transform -translate-x-1/2">
            <div className="font-bold text-2xl leading-7 text-center text-white">
              {statistics.totalReviewCount}
            </div>
          </div>
          <div className="absolute w-[80px] h-[15px] left-1/2 top-[43px] transform -translate-x-1/2">
            <div className="font-normal text-[11px] leading-[13px] text-center text-white">
              총 리뷰 수
            </div>
          </div>
        </div>
      </div>

      {/* 이번 달 활동 */}
      <Card className="relative overflow-hidden cursor-pointer w-full transition-colors border-10 shadow-[0_3px_4px_rgba(0,0,0,0.25)]">
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
              {statistics.thisMonthReviewCount}개
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
      <Card className="relative overflow-hidden cursor-pointer w-full transition-colors border-10 shadow-[0_3px_4px_rgba(0,0,0,0.25)]">
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
          {renderPieChart()}
          {totalCount > 0 && (
            <div className="space-y-2">
              {categoryData.map((category, index) => (
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
          )}
        </CardContent>
      </Card>

      {/* 월별 리뷰 트렌드 - 라인 차트 */}
      <Card className="relative overflow-hidden cursor-pointer w-full transition-colors border-10 shadow-[0_3px_4px_rgba(0,0,0,0.25)]">
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
          {renderLineChart()}
        </CardContent>
      </Card>

      {/* 평점 분포 - 바 차트 */}
      <Card className="relative overflow-hidden cursor-pointer w-full transition-colors border-10 shadow-[0_3px_4px_rgba(0,0,0,0.25)]">
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
          {renderBarChart()}
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
              버디의 랭킹
            </h3>
          </div>

          <div className="space-y-3">
            {statistics.topVisitedRestaurants.length === 0 ? (
              <div className="text-center py-4">
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  아직 방문한 음식점이 없어요!
                </p>
              </div>
            ) : (
              statistics.topVisitedRestaurants.map((restaurant, index) => (
                <div
                  key={restaurant.name}
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
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#FFDC17] text-[#FFDC17]" />
                        <span className="text-xs text-gray-600">
                          {restaurant.rating.toFixed(1)}
                        </span>
                      </div>
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {restaurant.visitCount}회 방문
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* 클릭 시 나타나는 툴팁 */}
      {renderTooltip()}
    </div>
  );
}
