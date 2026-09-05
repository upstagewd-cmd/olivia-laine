import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/isAdmin";

async function createClient(formData) {
  "use server";
  const admin = await requireAdmin();
  if (!admin) throw new Error("Not authorized");

  const name = formData.get("name");
  const email = formData.get("email");
  const clerkUserId = formData.get("clerkUserId");

  await sql`
    insert into clients (clerk_user_id, name, email)
    values (${clerkUserId}, ${name}, ${email})
  `;

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
        </label>
        <label className="flex flex-col gap-1 text-sm text-stone">
          Clerk User ID
          <input
            name="clerkUserId"
            required
            placeholder="user_..."
            className="border border-line bg-transparent p-2 text-ink"
          />
          <span className="text-xs text-stone">
            From the Clerk dashboard, after they've signed up (or you've invited them and they've
            accepted). Users → click their name → copy the User ID at the top.
          </span>
        </label>
        <button type="submit" className="mt-2 w-fit border border-gold px-4 py-2 text-sm text-gold">
          Create client
        </button>
      </form>
    </div>
  );
}
