import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/isAdmin";
import { sql } from "@/lib/db";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const { projectId, r2Key, linkUrl, originalFilename, type, caption } = await req.json();

  if (type === "link" && !linkUrl) {
    return NextResponse.json({ error: "linkUrl is required for link items" }, { status: 400 });
  }
  if (type !== "link" && !r2Key) {
    return NextResponse.json({ error: "r2Key is required for upload items" }, { status: 400 });
  }

  const [{ next_sort }] = await sql`
    select coalesce(max(sort_order), -1) + 1 as next_sort
    from media_items where project_id = ${projectId}
  `;

  const [item] = await sql`
    insert into media_items (project_id, r2_key, link_url, original_filename, type, caption, sort_order)
    values (${projectId}, ${r2Key || null}, ${linkUrl || null}, ${originalFilename || null}, ${type}, ${caption}, ${next_sort})
    returning id, r2_key, link_url, original_filename, type, caption
  `;

  return NextResponse.json({ item });
}
