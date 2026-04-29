import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODELS = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-2.0-flash-lite"];
const MAX_RETRIES = 2;

const PROMPT_TEMPLATE = (text: string) => `Bạn là một giảng viên tiếng Đức thân thiện và khích lệ tại Lingua German. Hãy chấm và nhận xét đoạn văn tiếng Đức sau của học viên.

QUY TẮC QUAN TRỌNG:
- Hãy KHÍCH LỆ và TÍCH CỰC. Luôn khen ngợi những điểm tốt trước.
- Điểm tối thiểu là 6/10 cho bất kỳ bài viết nào, vì học viên đã dám viết bằng tiếng Đức.
- Nhận xét NGẮN GỌN, mỗi mục tối đa 3-4 dòng. Không liệt kê quá nhiều lỗi.
- Chỉ nêu 2-3 lỗi chính cần sửa, kèm cách sửa cụ thể.
- Kết thúc bằng lời động viên tích cực.

Phản hồi bằng tiếng Việt với format:
1. **Điểm tổng**: X/10
2. **Điểm tốt**: Khen ngợi những gì học viên làm tốt
3. **Cần cải thiện**: Nêu 2-3 lỗi chính kèm cách sửa ngắn gọn
4. **Lời khuyên**: 1-2 gợi ý cải thiện và lời động viên

Đoạn văn của học viên:
"""
${text}
"""`;

async function callGemini(apiKey: string, text: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of MODELS) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[Grade] Trying model=${modelName}, attempt=${attempt + 1}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(PROMPT_TEMPLATE(text));
        const output = result.response.text();
        console.log(`[Grade] Success with model=${modelName}`);
        return output;
      } catch (err: unknown) {
        const error = err as Error & { status?: number };
        console.error(`[Grade] Failed model=${modelName}, attempt=${attempt + 1}, status=${error?.status}, msg=${error?.message?.substring(0, 100)}`);

        // If 503 (overloaded) or 429 (rate limit), retry after delay
        if (error?.status === 503 || error?.status === 429) {
          if (attempt < MAX_RETRIES) {
            const delay = (attempt + 1) * 1500; // 1.5s, 3s
            console.log(`[Grade] Retrying in ${delay}ms...`);
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }
          // Exhausted retries for this model, try next model
          console.log(`[Grade] Exhausted retries for ${modelName}, trying next model...`);
          break;
        }

        // For other errors (400, 401, etc.), don't retry
        throw err;
      }
    }
  }

  throw new Error("Tất cả model đang quá tải. Vui lòng thử lại sau.");
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length < 10) {
      return NextResponse.json({ error: "Văn bản quá ngắn, vui lòng nhập ít nhất 10 ký tự." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key chưa được cấu hình." }, { status: 500 });
    }

    const output = await callGemini(apiKey, text);
    return NextResponse.json({ result: output });
  } catch (err: unknown) {
    const error = err as Error & { status?: number };
    console.error("[Grade] Final error:", error?.message);

    // User-friendly messages based on error type
    if (error?.status === 503 || error?.status === 429) {
      return NextResponse.json({
        error: "Hệ thống AI đang quá tải. Vui lòng thử lại sau 30 giây.",
      }, { status: 503 });
    }

    return NextResponse.json({ error: "Đã xảy ra lỗi. Vui lòng thử lại." }, { status: 500 });
  }
}
