import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";
import type { SiteContent } from "@/types/site-content";

export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const nextContent = body?.content as SiteContent | undefined;

    if (!nextContent || !nextContent.hero || !nextContent.about || !Array.isArray(nextContent.sections)) {
      return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
    }

    const contentToSave: SiteContent = {
      ...nextContent,
      updatedAt: new Date().toISOString(),
      sections: [...nextContent.sections].sort((a, b) => a.order - b.order),
    };

    await saveSiteContent(contentToSave);
    return NextResponse.json({ success: true, content: contentToSave });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
