import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Verifies Clerk's webhook signature directly via the Web Crypto API instead
// of the `svix` package — that package appears to crash outright in this
// Workers runtime (an uncaught, uncatchable error with no message), rather
// than something we could handle with a try/catch. Web Crypto is natively
// supported here with no compatibility concerns, and Clerk's signing scheme
// (via Svix) is a straightforward HMAC-SHA256 check we can do ourselves.
async function verifySignature(payload, svixId, svixTimestamp, svixSignature, secret) {
  if (!svixId || !svixTimestamp || !svixSignature) return false;

  const secretBytes = Uint8Array.from(atob(secret.replace(/^whsec_/, "")), (c) => c.charCodeAt(0));
  const signedContent = `${svixId}.${svixTimestamp}.${payload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedContent));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));

  // The header can contain multiple space-separated "v1,<signature>" values.
  const provided = svixSignature.split(" ").map((s) => s.split(",")[1]);
  return provided.includes(expected);
}

export async function POST(req) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const payload = await req.text();
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  let valid = false;
  try {
    valid = await verifySignature(payload, svixId, svixTimestamp, svixSignature, secret);
  } catch (e) {
    console.error(`Clerk webhook signature check threw: ${e?.message}`);
    return NextResponse.json({ error: "Signature check failed" }, { status: 401 });
  }

  if (!valid) {
    console.error("Clerk webhook signature invalid");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch (e) {
    console.error(`Clerk webhook: could not parse payload: ${e?.message}`);
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
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
