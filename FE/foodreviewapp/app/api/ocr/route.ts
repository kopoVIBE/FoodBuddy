import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // 실제로는 OCR API (Google Vision, AWS Textract 등) 호출
    // 여기서는 임시 응답 반환
    const mockOcrResult = {
      text: "맛있는 김치찌개\n서울시 강남구 테헤란로 123\n김치찌개 8,000원\n공기밥 1,000원\n총액: 9,000원",
      restaurantName: "맛있는 김치찌개",
      items: [
        { name: "김치찌개", price: 8000 },
        { name: "공기밥", price: 1000 },
      ],
      total: 9000,
    }

    return NextResponse.json(mockOcrResult)
  } catch (error) {
    return NextResponse.json({ error: "OCR processing failed" }, { status: 500 })
  }
}
