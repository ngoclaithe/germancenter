import { NextRequest, NextResponse } from "next/server";

// Simple admin credentials — update via env vars
const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "germancenter2026";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "gc_secret_key_2026";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Simple token: base64(username:timestamp:secret)
      const token = Buffer.from(`${username}:${Date.now()}:${ADMIN_SECRET}`).toString("base64");
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ success: false, error: "Sai tên đăng nhập hoặc mật khẩu" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 });
  }
}
