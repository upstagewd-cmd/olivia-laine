import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/isAdmin";

async function createClient(formData) {
  "use server";
  const admin = await requireAdmin();
  if (!admin) throw new Error("Not authorized");

  const name = formData.get("name");
  const email = formData.get("email");

  await sql`
    insert into clients (name, email)
    values (${name}, ${email})
  `;

  // Best-effort — if this fails (e.g. they already have an account, or an
  // invite already exists), the client record is still created and you can
  // invite them manually from the Clerk dashboard instead.
  try {
    const client = await clerkClient();
    await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.SITE_URL}/portal`,
    });
  } catch (e) {
    console.error("Clerk invitation failed:", e);
  }

  redirect("/admin");
}

export default function NewClientPage() {
  return (
    <div className="p-4 md:p-10">
      <h1 className="text-2xl text-ink">New client</h1>
      <form action={createClient} className="mt-6 flex max-w-md flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-stone">
          Name
          <input
            name="name"
            required
            className="border border-line bg-transparent p-2 text-ink"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-stone">
          Email
          <input
            type="email"
            name="email"
            required
            className="border border-line bg-transparent p-2 text-ink"
          />
          <span className="text-xs text-stone">
            An invite email goes out automatically. Once they accept and sign up, their account
            links to this client record on its own — no manual Clerk ID lookup needed.
          </span>
        </label>
        <button type="submit" className="mt-2 w-fit border border-gold px-4 py-2 text-sm text-gold">
          Create client &amp; send invite
        </button>
      </form>
    </div>
  );
}
