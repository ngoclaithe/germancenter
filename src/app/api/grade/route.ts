import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Bạn là một giảng viên tiếng Đức thân thiện và khích lệ tại Lingua German. Hãy chấm và nhận xét đoạn văn tiếng Đức sau của học viên.

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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const output = response.text();

    return NextResponse.json({ result: output });
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json({ error: "Đã xảy ra lỗi. Vui lòng thử lại." }, { status: 500 });
  }
}
