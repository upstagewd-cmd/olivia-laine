import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/isAdmin";
import { sql } from "@/lib/db";
import { deleteObject } from "@/lib/r2";

export async function PATCH(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const { id } = await params;
  const { caption } = await req.json();

  await sql`update media_items set caption = ${caption} where id = ${id}`;
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const { id } = await params;

  const [item] = await sql`select r2_key from media_items where id = ${id}`;
  if (item) {
    try {
      await deleteObject(item.r2_key);
    } catch (e) {
      // Don't block the DB deletion if R2 cleanup fails — better to have an
      // orphaned file than a media item stuck in the database.
      console.error("R2 delete failed:", e);
    }
  }

  await sql`delete from media_items where id = ${id}`;
  return NextResponse.json({ ok: true });
}
