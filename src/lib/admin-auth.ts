import { NextRequest } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "gc_secret_key_2026";

export function verifyAdminRequest(req: NextRequest): boolean {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 3) return false;
    const secret = parts.slice(2).join(":");
    return secret === ADMIN_SECRET;
  } catch {
    return false;
  }
}
