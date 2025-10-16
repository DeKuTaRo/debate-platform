import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { topic, position, userMessage, conversationHistory } = await req.json()

    const oppositePosition = position === "support" ? "oppose" : "support"
    const positionText = oppositePosition === "support" ? "ủng hộ" : "phản đối"

    const systemPrompt = `Bạn là một chuyên gia tranh biện thông minh và lịch sự. Bạn đang tham gia một cuộc tranh luận về chủ đề: "${topic}".

Vai trò của bạn:
- Bạn đang ở vị trí ${positionText} chủ đề này
- Đưa ra các lập luận logic, có căn cứ và thuyết phục
- Phản biện một cách tôn trọng và xây dựng
- Sử dụng ví dụ thực tế và dữ liệu khi có thể
- Trả lời bằng tiếng Việt
- Giữ câu trả lời ngắn gọn (2-4 đoạn văn)
- Không lặp lại những gì đã nói trước đó

Hãy tranh luận một cách chuyên nghiệp và thuyết phục.`

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: userMessage },
    ]

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages,
      temperature: 0.8,
      maxTokens: 500,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error("[v0] AI debate error:", error)
    return Response.json({ error: "Đã xảy ra lỗi khi xử lý yêu cầu" }, { status: 500 })
  }
}
