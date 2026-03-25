import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "submissions.json");

function ensureDataFile() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, "[]", "utf-8");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, goal, level } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    ensureDataFile();

    const data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
    const newEntry = {
      id: Date.now(),
      name,
      phone,
      goal: goal || "",
      level: level || "",
      createdAt: new Date().toISOString(),
    };

    data.push(newEntry);
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ success: true, id: newEntry.id });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
