import { sql } from "@/lib/db";
import Uploader from "@/components/Uploader";
import MediaManager from "@/components/MediaManager";
import ProjectActions from "@/components/ProjectActions";

export default async function AdminProjectPage({ params }) {
  const { id } = await params;

  const [project] = await sql`select id, title, status, client_id from projects where id = ${id}`;
  const media = await sql`
    select m.id, m.r2_key, m.link_url, m.original_filename, m.type, m.caption,
           r.rating, r.comment
    from media_items m
    left join reactions r
      on r.media_item_id = m.id and r.client_id = ${project?.client_id}
    where m.project_id = ${id}
    order by m.sort_order asc
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
    rating: m.rating,
    comment: m.comment,
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
