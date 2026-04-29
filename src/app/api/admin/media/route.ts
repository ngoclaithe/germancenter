import { NextRequest, NextResponse } from "next/server";
import { mkdir, readdir, writeFile, unlink } from "fs/promises";
import { existsSync } from "fs";
import { extname, join, basename } from "path";
import { verifyAdminRequest } from "@/lib/admin-auth";
import sharp from "sharp";

const UPLOAD_DIR = join(process.cwd(), "public", "images", "uploads");
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif", ".tiff"]);

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
      .filter((name) => {
        const ext = extname(name).toLowerCase();
        return ALLOWED_EXT.has(ext) || ext === ".webp";
      })
      .sort((a, b) => {
        // Sort by timestamp prefix (newest first)
        const tsA = parseInt(a.split("-")[0]) || 0;
        const tsB = parseInt(b.split("-")[0]) || 0;
        return tsB - tsA;
      })
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to WebP for performance (skip SVG — keep as-is)
    if (ext === ".svg") {
      const filename = `${Date.now()}-${originalName}`;
      const fullPath = join(UPLOAD_DIR, filename);
      await writeFile(fullPath, buffer);
      return NextResponse.json({
        success: true,
        path: `/images/uploads/${filename}`,
        converted: false,
      });
    }

    // Convert raster images to WebP using sharp
    const nameWithoutExt = basename(originalName, ext);
    const webpFilename = `${Date.now()}-${nameWithoutExt}.webp`;
    const fullPath = join(UPLOAD_DIR, webpFilename);

    const webpBuffer = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82, effort: 2 })
      .toBuffer();

    await writeFile(fullPath, webpBuffer);

    const originalSizeKB = Math.round(buffer.length / 1024);
    const webpSizeKB = Math.round(webpBuffer.length / 1024);
    const savedPercent = Math.round((1 - webpBuffer.length / buffer.length) * 100);

    return NextResponse.json({
      success: true,
      path: `/images/uploads/${webpFilename}`,
      converted: true,
      originalSize: `${originalSizeKB}KB`,
      webpSize: `${webpSizeKB}KB`,
      savedPercent: `${savedPercent}%`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Lỗi upload/convert ảnh" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename } = await req.json();
    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ error: "Thiếu tên file" }, { status: 400 });
    }

    // Prevent path traversal
    const safeName = basename(filename);
    const fullPath = join(UPLOAD_DIR, safeName);

    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: "File không tồn tại" }, { status: 404 });
    }

    await unlink(fullPath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lỗi xóa file" }, { status: 500 });
  }
}
