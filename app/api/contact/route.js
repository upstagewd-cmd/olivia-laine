import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { Resend } from "resend";

// Lazy for the same reason as lib/db.js's sql client: creating this at
// module load time makes it run during Next.js's build-time page-data
// collection too, where Cloudflare's runtime secrets aren't yet available.
let _resend;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function POST(req) {
  const { name, email, message, track } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await sql`
    insert into inquiries (name, email, message, track)
    values (${name}, ${email}, ${message}, ${track || null})
  `;

  // Don't fail the whole request if the email fails — the inquiry is
  // already saved and visible in /admin/inquiries either way.
  try {
    const trackLabel = track === "personal" ? " (Personal Styling)" : "";
    await getResend().emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name}${trackLabel}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
  } catch (e) {
    console.error("Resend email failed:", e);
  }

  return NextResponse.json({ ok: true });
}
