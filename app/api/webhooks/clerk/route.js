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
    console.error("Clerk webhook signature verification failed:", e?.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (event.type === "user.created") {
    const user = event.data;
    const addresses = user.email_addresses || [];
    const primary = addresses.find((a) => a.id === user.primary_email_address_id);
    const email = (primary?.email_address || addresses[0]?.email_address || "").toLowerCase();

    if (email) {
      try {
        const result = await sql`
          update clients
          set clerk_user_id = ${user.id}
          where clerk_user_id is null
            and lower(email) = ${email}
          returning id
        `;
        console.log(`Clerk webhook: user.created for ${email}, linked ${result.length} client record(s)`);
      } catch (e) {
        console.error(`Clerk webhook DB update failed for ${email}: ${e?.message}`);
      }
    } else {
      console.error("Clerk webhook: user.created event had no email address");
    }
  }

  return NextResponse.json({ ok: true });
}
