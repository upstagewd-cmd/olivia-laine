import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id"),
    "svix-timestamp": req.headers.get("svix-timestamp"),
    "svix-signature": req.headers.get("svix-signature"),
  };

  let event;
  try {
    event = new Webhook(secret).verify(payload, headers);
  } catch (e) {
    console.error("Clerk webhook signature verification failed:", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (event.type === "user.created") {
    const user = event.data;
    const emails = (user.email_addresses || []).map((e) => e.email_address.toLowerCase());

    if (emails.length > 0) {
      // Match against any client we've already created (by email) that's
      // still waiting for its Clerk account to be linked.
      await sql`
        update clients
        set clerk_user_id = ${user.id}
        where clerk_user_id is null
          and lower(email) = any(${emails})
      `;
    }
  }

  return NextResponse.json({ ok: true });
}
