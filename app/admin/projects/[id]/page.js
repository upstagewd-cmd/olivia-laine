import { sql } from "@/lib/db";
import Uploader from "@/components/Uploader";
import MediaManager from "@/components/MediaManager";
import ProjectActions from "@/components/ProjectActions";

export default async function AdminProjectPage({ params }) {
  const { id } = await params;

  const [project] = await sql`select id, title, status, client_id from projects where id = ${id}`;
  const media = await sql`
    select id, r2_key, link_url, original_filename, type, caption
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
    src: m.r2_key ? `${process.env.R2_PUBLIC_URL}/${m.r2_key}` : undefined,
    linkUrl: m.link_url,
    originalFilename: m.original_filename,
  }));

  return (
    <div className="p-4 md:p-10">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl text-ink">{project.title}</h1>
        <ProjectActions projectId={project.id} status={project.status} clientId={project.client_id} />
      </div>

      <div className="mt-6 max-w-md">
        <Uploader projectId={project.id} />
      </div>

      <MediaManager media={items} />
    </div>
  );
}
