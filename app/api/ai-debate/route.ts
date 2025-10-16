// app/api/ai-debate/route.ts
import { NextResponse } from "next/server";

type Message = { role: "user" | "assistant"; content: string };

function toGeminiRole(role: Message["role"]): "user" | "model" {
  return role === "assistant" ? "model" : "user";
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Thiếu biến môi trường GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      topic,
      position, // "support" | "oppose"
      userMessage,
      conversationHistory,
    }: {
      topic: string;
      position: "support" | "oppose";
      userMessage: string;
      conversationHistory: Message[];
    } = body;

    // 1) Lịch sử hội thoại (map sang role 'user' | 'model' và parts[])
    const history = (conversationHistory || []).map((m) => ({
      role: toGeminiRole(m.role),
      parts: [{ text: m.content }],
    }));

    // 2) Thêm lượt người dùng hiện tại vào cuối contents
    const latestUserTurn = {
      role: "user",
      parts: [{ text: userMessage }],
    };

    // 3) Ràng buộc “đóng vai đối lập”
    const opposite = position === "support" ? "phản đối" : "ủng hộ";

    // 4) Gọi REST API generateContent
    // Docs: generateContent (v1beta) + contents[] multi-turn
    // https://ai.google.dev/api  +  https://cloud.google.com/vertex-ai/.../generateContent
    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Hướng dẫn hệ thống (v1beta hỗ trợ) để luôn tranh biện "đối lập"
          system_instruction: {
            parts: [
              {
                text:
                  `Bạn là một chuyên gia tranh biện. ` +
                  `Nhiệm vụ: luôn ${opposite} quan điểm của người dùng về chủ đề: "${topic}". ` +
                  `Giữ thái độ lịch sự, đưa luận điểm chặt chẽ, phản biện có dẫn chứng, kết thúc bằng gợi ý câu hỏi mở.`,
              },
            ],
          },
          contents: [...history, latestUserTurn],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json(
        { error: `Gemini API error: ${resp.status} ${err}` },
        { status: 502 }
      );
    }

    const data = await resp.json();

    // Chuẩn hoá text trả về
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p?.text)
        .join("") ??
      data?.candidates?.[0]?.output_text ??
      "Xin lỗi, tôi chưa có câu trả lời phù hợp.";

      console.log("Gemini Raw Response:", text);
      return NextResponse.json({ response: text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
