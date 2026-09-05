import { sql } from "@/lib/db";
import Filmstrip from "@/components/Filmstrip";

export default async function HomePage() {
  const projectId = process.env.PUBLIC_PORTFOLIO_PROJECT_ID;

  if (!projectId) {
    return (
      <div className="p-8 text-stone">
        No portfolio project configured yet — see ADMIN-SETUP.md, "Connecting the public
        portfolio," for how to wire this up.
      </div>
    );
  }

  const media = await sql`
    select id, r2_key, type, caption
    from media_items where project_id = ${projectId}
    order by sort_order asc
  `;

  if (media.length === 0) {
    return <div className="p-8 text-stone">No portfolio media uploaded yet.</div>;
  }

  const items = media.map((m) => ({
    id: m.id,
    type: m.type,
    src: `${process.env.R2_PUBLIC_URL}/${m.r2_key}`,
    caption: m.caption,
  }));

  return <Filmstrip items={items} />;
}
