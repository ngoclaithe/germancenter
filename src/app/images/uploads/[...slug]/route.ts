import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const filePath = join(process.cwd(), "public", "images", "uploads", ...slug);

  if (!existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    
    const filename = slug[slug.length - 1] || "";
    let contentType = "image/webp";
    if (filename.endsWith(".svg")) contentType = "image/svg+xml";
    else if (filename.endsWith(".png")) contentType = "image/png";
    else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) contentType = "image/jpeg";
    else if (filename.endsWith(".gif")) contentType = "image/gif";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Error reading file", { status: 500 });
  }
}
