import Link from "next/link";
import { sql } from "@/lib/db";
import Filmstrip from "@/components/Filmstrip";

const TRACKS = {
  commercial: {
    label: "Commercial",
    envVar: "PUBLIC_PORTFOLIO_PROJECT_ID",
  },
  personal: {
    label: "Personal Styling",
    envVar: "PUBLIC_PORTFOLIO_PROJECT_ID_PERSONAL",
  },
};

function ClapperIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 9.5L4.5 5h15L21 9.5M3 9.5V19a1 1 0 001 1h16a1 1 0 001-1V9.5M3 9.5h18M7 5l1.5 4.5M13 5l1.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HangerIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 4a1.6 1.6 0 10-1.6 1.6M12 5.6v2M4 20l7.2-6.2a1.2 1.2 0 011.6 0L20 20M4 20h16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = { commercial: ClapperIcon, personal: HangerIcon };

function TrackToggle({ active }) {
  return (
    <div className="inline-flex border border-line">
      {Object.entries(TRACKS).map(([key, track]) => {
        const Icon = ICONS[key];
        const isActive = active === key;
        return (
          <Link
            key={key}
            href={`/?track=${key}`}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wide transition-colors duration-300 ${
              isActive ? "bg-gold text-ondark" : "text-stone hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" />
            {track.label}
          </Link>
        );
      })}
    </div>
  );
}

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const track = TRACKS[params?.track] ? params.track : "commercial";
  const projectId = process.env[TRACKS[track].envVar];

  const header = (
    <div className="flex-shrink-0 px-4 pb-4 pt-28 md:px-10 md:pl-[216px] md:pt-8">
      <TrackToggle active={track} />
    </div>
  );

  if (!projectId) {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col">
        {header}
        <div className="px-4 text-stone md:px-10 md:pl-[216px]">
          No {TRACKS[track].label.toLowerCase()} portfolio configured yet — see
          ADMIN-SETUP.md, "Connecting the public portfolio," for how to wire this up.
        </div>
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
      <div className="flex h-full min-h-0 flex-1 flex-col">
        {header}
        <div className="px-4 text-stone md:px-10 md:pl-[216px]">
          No {TRACKS[track].label.toLowerCase()} media uploaded yet.
        </div>
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
      {header}
      <Filmstrip items={items} autoplayVideo />
    </div>
  );
}
