"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, Award, Calendar } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

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

export default function StatisticsTab() {
  const totalReviews = 22
  const averageRating = 4.3
  const favoriteCategory = "한식"
  const thisMonthReviews = 7

  return (
    <div className="space-y-4">
      {/* 요약 통계 */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">{averageRating}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
              평균 평점
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">{totalReviews}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Award className="h-3 w-3" />총 리뷰 수
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 선호 업종 */}
      <Card className="border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
            <TrendingUp className="h-5 w-5" />
            선호 업종
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">가장 선호하는 업종</span>
              <Badge className="bg-orange-100 text-orange-700">{favoriteCategory}</Badge>
            </div>
          </div>

          {/* 업종별 차트 */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="count"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 범례 */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categoryStats.map((category) => (
              <div key={category.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-xs text-gray-600">
                  {category.name} ({category.count})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 월별 활동 */}
      <Card className="border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
            <Calendar className="h-5 w-5" />
            월별 리뷰 활동
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              이번 달 <span className="font-semibold text-orange-600">{thisMonthReviews}개</span>의 리뷰를 작성했어요!
            </p>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="reviews"
                  stroke="#ea580c"
                  strokeWidth={3}
                  dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 평점 분포 */}
      <Card className="border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
            <Star className="h-5 w-5" />
            평점 분포
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Bar dataKey="count" fill="#ea580c" radius={[4, 4, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
