import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/isAdmin";
import { presignUpload } from "@/lib/r2";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const { projectId, filename, contentType } = await req.json();
  const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const key = `${projectId}/${Date.now()}-${safeName}`;

  const url = await presignUpload(key, contentType);

  return NextResponse.json({ url, key });
}
