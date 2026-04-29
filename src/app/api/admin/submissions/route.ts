import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ submissions });
  } catch {
    return NextResponse.json({ submissions: [] });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await prisma.submission.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, contacted, note } = await req.json();
    if (!id) return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });

    const data: Record<string, unknown> = {};
    if (typeof contacted === "boolean") data.contacted = contacted;
    if (typeof note === "string") data.note = note;

    const submission = await prisma.submission.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json({ success: true, submission });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
