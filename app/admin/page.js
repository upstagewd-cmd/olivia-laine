import Link from "next/link";
import { sql } from "@/lib/db";

export default async function AdminDashboard() {
  const rows = await sql`
    select
      c.id as client_id, c.name as client_name, c.clerk_user_id,
      p.id as project_id, p.title as project_title,
      (select count(*) from media_items m where m.project_id = p.id) as media_count
    from clients c
    left join projects p on p.client_id = c.id
    order by c.created_at desc, p.created_at desc
  `;

  const byClient = {};
  for (const row of rows) {
    if (!byClient[row.client_id]) {
      byClient[row.client_id] = {
        name: row.client_name,
        pending: !row.clerk_user_id,
        projects: [],
      };
    }
    if (row.project_id) {
      byClient[row.client_id].projects.push({
        id: row.project_id,
        title: row.project_title,
        mediaCount: row.media_count,
      });
    }
  }

  return (
    <div className="p-4 md:p-10">
      <h1 className="text-2xl text-ink">Clients &amp; projects</h1>
      <div className="mt-6 flex flex-col gap-8">
        {Object.entries(byClient).map(([clientId, client]) => (
          <div key={clientId}>
            <Link href={`/admin/clients/${clientId}`} className="font-medium text-ink underline">
              {client.name}
            </Link>
            {client.pending && (
              <span className="ml-2 text-xs text-gold">Invite pending</span>
            )}
            <div className="mt-2 flex flex-col gap-1">
              {client.projects.length === 0 && (
                <div className="text-sm text-stone">No projects yet.</div>
              )}
              {client.projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/projects/${p.id}`}
                  className="text-sm text-gold underline"
                >
                  {p.title} ({p.mediaCount} item{p.mediaCount === "1" ? "" : "s"})
                </Link>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(byClient).length === 0 && (
          <div className="text-stone">
            No clients yet — start with{" "}
            <Link href="/admin/clients/new" className="text-gold underline">
              + Client
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
}
