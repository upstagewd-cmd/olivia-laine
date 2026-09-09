import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/isAdmin";
import { sql } from "@/lib/db";
import { Resend } from "resend";

// Lazy for the same reason as the contact form's route — module-load-time
// construction would run during Next.js's build-time page data collection.
let _resend;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function POST(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const { id } = await params;
  const { message } = await req.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const [inquiry] = await sql`select name, email from inquiries where id = ${id}`;
  if (!inquiry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await getResend().emails.send({
    from: process.env.CONTACT_FROM_EMAIL,
    to: inquiry.email,
    replyTo: process.env.CONTACT_TO_EMAIL,
    subject: "Re: your inquiry",
    text: message,
  });

  await sql`update inquiries set replied_at = now() where id = ${id}`;

  return NextResponse.json({ ok: true });
}
