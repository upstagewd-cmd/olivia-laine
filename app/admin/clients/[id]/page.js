import Link from "next/link";
import { sql } from "@/lib/db";

export default async function AdminClientPage({ params }) {
  const { id } = await params;

  const [client] = await sql`
    select id, name, email, company, clerk_user_id, created_at
    from clients where id = ${id}
  `;

  if (!client) {
    return <div className="p-4 text-stone md:p-10">Client not found.</div>;
  }

  const projects = await sql`
    select p.id, p.title, p.status, p.created_at,
      (select count(*) from media_items m where m.project_id = p.id) as media_count
    from projects p
    where p.client_id = ${id}
    order by p.created_at desc
  `;

  return (
    <div className="p-4 md:p-10">
      <h1 className="text-2xl text-ink">{client.name}</h1>
      <div className="mt-2 flex flex-col gap-1 text-sm text-stone">
        <div>{client.email}</div>
        {client.company && <div>{client.company}</div>}
        {client.clerk_user_id ? (
          <div className="mt-2 text-xs">Clerk user ID: {client.clerk_user_id}</div>
        ) : (
          <div className="mt-2 text-xs text-gold">
            Invite sent — waiting for them to sign up
          </div>
        )}
        <div className="text-xs">Added {new Date(client.created_at).toLocaleDateString()}</div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wide text-stone">Projects</div>
          <Link href="/admin/projects/new" className="text-xs text-gold underline">
            + New project
          </Link>
        </div>
        <div className="mt-3 flex flex-col">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/admin/projects/${p.id}`}
              className="flex items-center justify-between border-b border-line py-3 text-sm"
            >
              <span className="text-ink">{p.title}</span>
              <span className="text-xs text-stone">
                {p.status} · {p.media_count} item{p.media_count === "1" ? "" : "s"}
              </span>
            </Link>
          ))}
          {projects.length === 0 && (
            <div className="py-3 text-sm text-stone">No projects yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
