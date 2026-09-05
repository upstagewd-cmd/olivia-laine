import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/isAdmin";
import { sql } from "@/lib/db";

export async function POST(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const { id } = await params;
  const { direction } = await req.json(); // "up" | "down"

  const [current] = await sql`select id, project_id, sort_order from media_items where id = ${id}`;
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const neighbor =
    direction === "up"
      ? await sql`
          select id, sort_order from media_items
          where project_id = ${current.project_id} and sort_order < ${current.sort_order}
          order by sort_order desc limit 1
        `
      : await sql`
          select id, sort_order from media_items
          where project_id = ${current.project_id} and sort_order > ${current.sort_order}
          order by sort_order asc limit 1
        `;

  if (neighbor.length === 0) {
    // Already at the top/bottom — nothing to do.
    return NextResponse.json({ ok: true });
  }

  const other = neighbor[0];
  await sql`update media_items set sort_order = ${other.sort_order} where id = ${current.id}`;
  await sql`update media_items set sort_order = ${current.sort_order} where id = ${other.id}`;

  return NextResponse.json({ ok: true });
}
