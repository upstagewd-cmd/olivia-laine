import { sql } from "@/lib/db";
import Filmstrip from "@/components/Filmstrip";

const TRACKS = {
  commercial: { label: "Commercial", envVar: "PUBLIC_PORTFOLIO_PROJECT_ID" },
  personal: { label: "Personal Styling", envVar: "PUBLIC_PORTFOLIO_PROJECT_ID_PERSONAL" },
};

export default async function WorkPage({ searchParams }) {
  const params = await searchParams;
  const track = TRACKS[params?.track] ? params.track : "commercial";
  const projectId = process.env[TRACKS[track].envVar];

  if (!projectId) {
    return (
      <div className="p-8 pt-28 text-stone md:pl-[216px] md:pt-8">
        No {TRACKS[track].label.toLowerCase()} portfolio configured yet — see
        ADMIN-SETUP.md, "Connecting the public portfolio," for how to wire this up.
      </div>
    );
  }

  const media = await sql`
    select id, r2_key, link_url, original_filename, type, caption
    from media_items where project_id = ${projectId}
    order by sort_order asc
  `;

  if (media.length === 0) {
    return (
      <div className="p-8 pt-28 text-stone md:pl-[216px] md:pt-8">
        No {TRACKS[track].label.toLowerCase()} media uploaded yet.
      </div>
    );
  }

  const items = media.map((m) => ({
    id: m.id,
    type: m.type,
    src: m.r2_key ? `${process.env.R2_PUBLIC_URL}/${m.r2_key}` : undefined,
    linkUrl: m.link_url,
    originalFilename: m.original_filename,
    caption: m.caption,
  }));

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex-shrink-0 pt-28 md:pt-0" />
      <Filmstrip items={items} autoplayVideo />
    </div>
  );
}
