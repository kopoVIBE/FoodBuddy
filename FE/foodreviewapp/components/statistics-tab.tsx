"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, Calendar, Clock } from "lucide-react"
import { useApp } from "@/contexts/app-context"
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
} from "recharts"
import { useState } from "react"
import Image from "next/image"

// 임시 통계 데이터
const categoryStats = [
  { name: "한식", count: 8, color: "#ea580c" },
  { name: "양식", count: 5, color: "#f97316" },
  { name: "일식", count: 4, color: "#fb923c" },
  { name: "중식", count: 2, color: "#fdba74" },
  { name: "카페", count: 3, color: "#fed7aa" },
]

const monthlyStats = [
  { month: "10월", reviews: 2 },
  { month: "11월", reviews: 4 },
  { month: "12월", reviews: 6 },
  { month: "1월", reviews: 8 },
  { month: "2월", reviews: 5 },
  { month: "3월", reviews: 7 },
]

const ratingDistribution = [
  { rating: "5점", count: 8 },
  { rating: "4점", count: 12 },
  { rating: "3점", count: 3 },
  { rating: "2점", count: 1 },
  { rating: "1점", count: 0 },
]

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
]

export default function StatisticsTab() {
  const { isDarkMode } = useApp()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const totalReviews = 22
  const averageRating = 4.3
  const favoriteCategory = "한식"
  const thisMonthReviews = 7

  // 전체 카운트 계산
  const totalCount = categoryStats.reduce((sum, item) => sum + item.count, 0)

  // 퍼센트 계산 함수
  const getPercentage = (count: number) => {
    return ((count / totalCount) * 100).toFixed(1)
  }

  // 파이 차트 클릭 핸들러
  const onPieClick = (data: any, index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index)
  }

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.count}회 ({getPercentage(data.count)}%)
          </p>
        </div>
      )
    }
    return null
  }

  // 파이 차트 중앙에 표시할 텍스트
  const renderCenterText = () => {
    if (selectedIndex !== null) {
      const selectedData = categoryStats[selectedIndex]
      return (
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
          <tspan x="50%" dy="-0.5em" className="text-sm font-medium fill-gray-900">
            {selectedData.name}
          </tspan>
          <tspan x="50%" dy="1.2em" className="text-lg font-bold" fill={selectedData.color}>
            {getPercentage(selectedData.count)}%
          </tspan>
        </text>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* 헤더 섹션 */}
      <div className="relative w-full h-[72px] mb-6">
        {/* 로고 */}
        <div className="absolute left-[13px] top-[14px] w-[44px] h-[44px]">
          <Image src="/logo.svg" alt="FoodBuddy Logo" width={44} height={44} className="w-full h-full" />
        </div>

        {/* 버디와의 */}
        <div className="absolute left-[66px] top-[19px] w-[207px] h-[14px]">
          <h1 className="font-semibold text-base leading-[19px] text-[#333333]">버디와의</h1>
        </div>

        {/* 활동을 정리했어요! */}
        <div className="absolute left-[66px] top-[41px] w-[207px] h-[14px]">
          <p className="font-medium text-sm leading-4 text-[#666666]">활동을 정리했어요!</p>
        </div>
      </div>

      {/* 요약 통계 카드들 */}
      <div className="flex justify-center items-center gap-3">
        {/* 평균 평점 - 빨간색 배경 */}
        <div className="w-[164px] h-[71px] bg-[#EB4C34] border border-[#EB4C34] rounded-[10px] relative">
          <div className="absolute w-[62px] h-[25.82px] left-1/2 top-[12.52px] transform -translate-x-1/2">
            <div className="font-bold text-2xl leading-7 text-center text-white">{averageRating}</div>
          </div>
          <div className="absolute w-[46px] h-[15px] left-1/2 top-[43px] transform -translate-x-1/2">
            <div className="font-normal text-[11px] leading-[13px] text-center text-white">평균 평점</div>
          </div>
        </div>

        {/* 총 리뷰 수 - 흰색 배경 */}
        <div className="w-[164px] h-[71px] bg-white border border-[#EB4C34] rounded-[10px] relative">
          <div className="absolute w-[62px] h-[25.82px] left-1/2 top-[12.52px] transform -translate-x-1/2">
            <div className="font-bold text-2xl leading-7 text-center text-[#EB4C34]">{totalReviews}</div>
          </div>
          <div className="absolute w-[46px] h-[15px] left-1/2 top-[43px] transform -translate-x-1/2">
            <div className="font-normal text-[11px] leading-[13px] text-center text-[#333333]">총 리뷰 수</div>
          </div>
        </div>
      </div>

      {/* 이번 달 활동 */}
      <Card className={`border-0 shadow-none ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-orange-500" />
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>이번 달 활동</h3>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600 mb-1">{thisMonthReviews}개</div>
            <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>이번 달 작성한 리뷰</p>
          </div>
        </CardContent>
      </Card>

      {/* 선호하는 음식 - 파이 차트 */}
      <Card className={`border-0 shadow-none ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>선호하는 음식</h3>
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {renderCenterText()}
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 범례 */}
          <div className="space-y-2">
            {categoryStats.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>{category.name}</span>
                </div>
                <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {category.count}회 ({getPercentage(category.count)}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 월별 리뷰 트렌드 - 라인 차트 */}
      <Card className={`border-0 shadow-none ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-orange-500" />
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>월별 리뷰 트렌드</h3>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyStats}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: isDarkMode ? "#d1d5db" : "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Line
                  type="monotone"
                  dataKey="reviews"
                  stroke="#ea580c"
                  strokeWidth={2}
                  dot={{ fill: "#ea580c", strokeWidth: 2, r: 3 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 평점 분포 - 바 차트 */}
      <Card className={`border-0 shadow-none ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-orange-500" />
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>평점 분포</h3>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution}>
                <XAxis
                  dataKey="rating"
                  tick={{ fontSize: 10, fill: isDarkMode ? "#d1d5db" : "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Bar dataKey="count" fill="#ea580c" radius={[2, 2, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 자주 방문한 음식점 */}
      <Card className={`border-0 shadow-none ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-orange-500" />
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>자주 방문한 음식점</h3>
          </div>

          <div className="space-y-3">
            {topRestaurants.map((restaurant, index) => (
              <div key={restaurant.id} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {restaurant.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                      {restaurant.category}
                    </Badge>
                    <span className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {restaurant.visitCount}회 방문
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                  <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {restaurant.avgRating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
