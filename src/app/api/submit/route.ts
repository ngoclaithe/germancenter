import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DATA_DIR = process.cwd() + "/data";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, goal, level } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const submission = await prisma.submission.create({
      data: {
        name,
        phone,
        email: email || "",
        goal: goal || "",
        level: level || "",
      },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
