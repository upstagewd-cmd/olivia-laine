import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/isAdmin";

async function createProject(formData) {
  "use server";
  const admin = await requireAdmin();
  if (!admin) throw new Error("Not authorized");

  const clientId = formData.get("clientId");
  const title = formData.get("title");

  const [project] = await sql`
    insert into projects (client_id, title)
    values (${clientId}, ${title})
    returning id
  `;

  redirect(`/admin/projects/${project.id}`);
}

export default async function NewProjectPage() {
  const clients = await sql`select id, name from clients order by created_at desc`;

  return (
    <div className="p-4 md:p-10">
      <h1 className="text-2xl text-ink">New project</h1>
      {clients.length === 0 ? (
        <p className="mt-4 text-stone">Add a client first.</p>
      ) : (
        <form action={createProject} className="mt-6 flex max-w-md flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-stone">
            Client
            <select name="clientId" required className="border border-line bg-transparent p-2 text-ink">
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-stone">
            Project title
            <input
              name="title"
              required
              placeholder="e.g. Automotive spot — casting reference"
              className="border border-line bg-transparent p-2 text-ink"
            />
          </label>
          <button type="submit" className="mt-2 w-fit border border-gold px-4 py-2 text-sm text-gold">
            Create project
          </button>
        </form>
      )}
    </div>
  );
}
