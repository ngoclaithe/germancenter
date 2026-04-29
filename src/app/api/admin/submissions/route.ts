import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { verifyAdminRequest } from "@/lib/admin-auth";

const DATA_FILE = join(process.cwd(), "data", "submissions.json");

export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!existsSync(DATA_FILE)) {
      return NextResponse.json({ submissions: [] });
    }

    const data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
    return NextResponse.json({ submissions: data });
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
    if (!existsSync(DATA_FILE)) {
      return NextResponse.json({ error: "No data" }, { status: 404 });
    }

    const data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
    const filtered = data.filter((s: { id: number }) => s.id !== id);
    writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
