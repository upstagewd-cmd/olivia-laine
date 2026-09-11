import Link from "next/link";

const CONTENT = {
  commercial: {
    eyebrow: "How it works",
    heading: "Consultation. Fitting. On set.",
    subhead: "A straightforward process built for production schedules — no surprises on shoot day.",
    steps: [
      {
        title: "Consultation",
        description:
          "We start with a call — your vision, the shoot's tone, timeline, and wardrobe needs. Nothing gets pulled until we're aligned on the look.",
      },
      {
        title: "Fitting & Prep",
        description:
          "Wardrobe gets sourced and fitted ahead of shoot day, with adjustments made in advance — not scrambled together on set.",
      },
      {
        title: "On Set",
        description:
          "I'm there for continuity, quick changes, and making sure everything holds up under a 4K lens through a full shoot day.",
      },
    ],
    ctaText: "Working on a production and need wardrobe you won't have to think twice about?",
    ctaButton: "Book a call",
  },
  personal: {
    // Placeholder copy — swap for her real voice/process once confirmed.
    eyebrow: "How it works",
    heading: "Consultation. Curation. Confidence.",
    subhead: "A personal styling process built around how you actually live and dress.",
    steps: [
      {
        title: "Style Consultation",
        description:
          "We talk through your lifestyle, goals, and what's not working in your closet right now — no judgment, just a clear starting point.",
      },
      {
        title: "Closet Edit & Curation",
        description:
          "I edit what you have and source what's missing, building a wardrobe that actually works together instead of a pile of one-off pieces.",
      },
      {
        title: "Styling Session",
        description:
          "We put it all together in person — fits, combinations, and a plan you can keep using long after we're done.",
      },
    ],
    ctaText: "Ready for a closet that actually works for you?",
    ctaButton: "Book a consultation",
  },
};

export default async function HowItWorksPage({ searchParams }) {
  const params = await searchParams;
  const track = CONTENT[params?.track] ? params.track : "commercial";
  const c = CONTENT[track];
  const bookingHref = track === "personal" ? "/booking?track=personal" : "/booking";

  return (
    <div className="h-full overflow-y-auto pb-24 pt-28 md:pl-[216px] md:pt-8">
      <div className="max-w-3xl px-6 md:px-10">
        <div className="text-xs text-stone">{c.eyebrow}</div>
        <h1 className="mt-2 text-3xl italic text-ink md:text-4xl">{c.heading}</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">{c.subhead}</p>

        <div className="mt-16 flex flex-col gap-12">
          {c.steps.map((step, i) => (
            <div key={step.title} className="flex gap-6">
              <div className="font-serif text-3xl text-gold">{i + 1}</div>
              <div>
                <h2 className="text-xl text-ink">{step.title}</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-stone">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-10">
          <p className="max-w-md text-sm leading-relaxed text-stone">{c.ctaText}</p>
          <Link
            href={bookingHref}
            className="mt-4 inline-block border border-gold px-4 py-2 text-sm text-gold"
          >
            {c.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
