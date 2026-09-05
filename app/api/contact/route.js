import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await sql`
    insert into inquiries (name, email, message)
    values (${name}, ${email}, ${message})
  `;

  // Don't fail the whole request if the email fails — the inquiry is
  // already saved and visible in /admin/inquiries either way.
  try {
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
  } catch (e) {
    console.error("Resend email failed:", e);
  }

  return NextResponse.json({ ok: true });
}
