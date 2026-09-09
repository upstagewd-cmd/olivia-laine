import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import Filmstrip from "@/components/Filmstrip";

export default async function PortalPage() {
  const { userId } = await auth();

  // Look up (or lazily create) the client record tied to this Clerk user.
  const [client] = await sql`
    select id, name from clients where clerk_user_id = ${userId}
  `;

  if (!client) {
    return (
      <div className="p-8 pt-28 text-stone md:pl-[216px] md:pt-8">
        No project is linked to this account yet — she'll set that up on her end.
      </div>
    );
  }

  const projects = await sql`
    select id, title from projects
    where client_id = ${client.id} and status = 'active'
    order by created_at desc
  `;

  if (projects.length === 0) {
    return <div className="p-8 pt-28 text-stone md:pl-[216px] md:pt-8">No active projects right now.</div>;
  }

  const project = projects[0];

  const mediaWithReactions = await sql`
    select m.id, m.r2_key, m.link_url, m.original_filename, m.type, m.caption,
           r.rating, r.comment
    from media_items m
    left join reactions r
      on r.media_item_id = m.id and r.client_id = ${client.id}
    where m.project_id = ${project.id}
    order by m.sort_order asc
  `;

  const items = mediaWithReactions.map((m) => ({
    id: m.id,
    type: m.type,
    src: m.r2_key ? `${process.env.R2_PUBLIC_URL}/${m.r2_key}` : undefined,
    linkUrl: m.link_url,
    originalFilename: m.original_filename,
    caption: m.caption,
    rating: m.rating,
    comment: m.comment,
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-4 pt-28 md:px-10 md:pl-[216px] md:pt-8">
        <div className="text-xs text-stone">{project.title}</div>
        <h1 className="mt-1 text-2xl text-ink">New drops for your review</h1>
      </div>
      <Filmstrip items={items} withRating />
    </div>
  );
}
