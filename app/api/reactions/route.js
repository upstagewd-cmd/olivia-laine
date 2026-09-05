import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { mediaItemId, rating, comment } = await req.json();

  const [client] = await sql`
    select id from clients where clerk_user_id = ${userId}
  `;
  if (!client) {
    return NextResponse.json({ error: "No client record" }, { status: 404 });
  }

  await sql`
    insert into reactions (media_item_id, client_id, rating, comment)
    values (${mediaItemId}, ${client.id}, ${rating}, ${comment})
    on conflict (media_item_id, client_id)
    do update set rating = excluded.rating, comment = excluded.comment, updated_at = now()
  `;

  return NextResponse.json({ ok: true });
}
