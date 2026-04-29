import { NextRequest, NextResponse } from "next/server";
import { mkdir, readdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { extname, join } from "path";
import { verifyAdminRequest } from "@/lib/admin-auth";

const UPLOAD_DIR = join(process.cwd(), "public", "images", "uploads");
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
      return NextResponse.json({ files: [] });
    }

    const files = await readdir(UPLOAD_DIR, { withFileTypes: true });
    const imageFiles = files
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => ALLOWED_EXT.has(extname(name).toLowerCase()))
      .map((name) => `/images/uploads/${name}`);

    return NextResponse.json({ files: imageFiles });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Không có file upload" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File quá lớn (tối đa 10MB)" }, { status: 400 });
    }

    const originalName = sanitizeName(file.name);
    const ext = extname(originalName).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: "Định dạng ảnh không hỗ trợ" }, { status: 400 });
    }

    const filename = `${Date.now()}-${originalName}`;
    const fullPath = join(UPLOAD_DIR, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(fullPath, Buffer.from(bytes));

    return NextResponse.json({
      success: true,
      path: `/images/uploads/${filename}`,
    });
  } catch {
    return NextResponse.json({ error: "Lỗi upload ảnh" }, { status: 500 });
  }
}
