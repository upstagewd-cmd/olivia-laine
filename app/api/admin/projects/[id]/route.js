import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/isAdmin";
import { sql } from "@/lib/db";
import { deleteObject } from "@/lib/r2";

export async function PATCH(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  await sql`update projects set status = ${status} where id = ${id}`;
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const { id } = await params;

  // Clean up any uploaded files in R2 before the cascade delete removes the
  // database rows — otherwise those objects would be orphaned in the bucket.
  const mediaItems = await sql`
    select r2_key from media_items where project_id = ${id} and r2_key is not null
  `;
  for (const item of mediaItems) {
    try {
      await deleteObject(item.r2_key);
    } catch (e) {
      console.error("R2 delete failed:", e);
    }
  }

  await sql`delete from projects where id = ${id}`;
  return NextResponse.json({ ok: true });
}
