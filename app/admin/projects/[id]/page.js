import { sql } from "@/lib/db";
import Uploader from "@/components/Uploader";
import MediaManager from "@/components/MediaManager";

export default async function AdminProjectPage({ params }) {
  const { id } = await params;

  const [project] = await sql`select id, title from projects where id = ${id}`;
  const media = await sql`
    select id, r2_key, type, caption
    from media_items where project_id = ${id}
    order by sort_order asc
  `;

  if (!project) {
    return <div className="p-4 text-stone md:p-10">Project not found.</div>;
  }

  const items = media.map((m) => ({
    id: m.id,
    type: m.type,
    caption: m.caption,
    src: `${process.env.R2_PUBLIC_URL}/${m.r2_key}`,
  }));

  return (
    <div className="p-4 md:p-10">
      <h1 className="text-2xl text-ink">{project.title}</h1>

      <div className="mt-6 max-w-md">
        <Uploader projectId={project.id} />
      </div>

      <MediaManager media={items} />
    </div>
  );
}
