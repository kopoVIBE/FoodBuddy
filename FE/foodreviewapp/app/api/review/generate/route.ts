import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { restaurantName, style, rating, menuItems } = await request.json()

    // 실제로는 OpenAI API 호출
    // 여기서는 스타일별 임시 응답 반환
    const reviewTemplates = {
      casual: `${restaurantName}에서 식사했는데 정말 맛있었어요! 특히 ${menuItems?.[0]?.name || "메인 메뉴"}가 인상적이었습니다. 가격도 합리적이고 분위기도 좋아서 다음에 또 올 것 같아요! 추천합니다 👍`,

      formal: `${restaurantName}에서의 식사 경험을 공유합니다. ${menuItems?.[0]?.name || "주문한 음식"}의 맛과 품질이 매우 훌륭했으며, 서비스도 친절하고 전문적이었습니다. 전반적으로 만족스러운 식사였으며, 재방문 의사가 있습니다.`,

      trendy: `${restaurantName} 완전 맛집 인정! 🔥 ${menuItems?.[0]?.name || "메뉴"} 진짜 레전드고 사진도 예쁘게 나와서 인스타 올리기 딱 좋아요 ✨ 친구들한테도 추천했어요! #맛집 #${restaurantName.replace(/\s/g, "")}`,
    }

    const generatedReview = reviewTemplates[style as keyof typeof reviewTemplates] || reviewTemplates.casual

    return NextResponse.json({ review: generatedReview })
  } catch (error) {
    return NextResponse.json({ error: "Review generation failed" }, { status: 500 })
  }
}
