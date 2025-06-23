import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { restaurantName, location } = await request.json()

    // 실제로는 Kakao/네이버 API 호출
    // 여기서는 임시 응답 반환
    const mockRestaurantInfo = {
      name: restaurantName,
      verified: true,
      address: "서울시 강남구 테헤란로 123",
      phone: "02-1234-5678",
      category: "한식",
      rating: 4.5,
      coordinates: {
        lat: 37.5665,
        lng: 126.978,
      },
    }

    return NextResponse.json(mockRestaurantInfo)
  } catch (error) {
    return NextResponse.json({ error: "Restaurant verification failed" }, { status: 500 })
  }
}
