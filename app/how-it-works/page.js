import Link from "next/link";

const steps = [
  {
    number: "1",
    title: "Consultation",
    description:
      "We start with a call — your vision, the shoot's tone, timeline, and wardrobe needs. Nothing gets pulled until we're aligned on the look.",
  },
  {
    number: "2",
    title: "Fitting & Prep",
    description:
      "Wardrobe gets sourced and fitted ahead of shoot day, with adjustments made in advance — not scrambled together on set.",
  },
  {
    number: "3",
    title: "On Set",
    description:
      "I'm there for continuity, quick changes, and making sure everything holds up under a 4K lens through a full shoot day.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="h-full overflow-y-auto pb-24 pt-20 md:pl-[216px] md:pt-8">
      <div className="max-w-3xl px-6 md:px-10">
        <div className="text-xs text-stone">How it works</div>
        <h1 className="mt-2 text-3xl italic text-ink md:text-4xl">
          Consultation. Fitting. On set.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">
          A straightforward process built for production schedules — no surprises on shoot day.
        </p>

        <div className="mt-16 flex flex-col gap-12">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-6">
              <div className="font-serif text-3xl text-gold">{step.number}</div>
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
          <p className="max-w-md text-sm leading-relaxed text-stone">
            Working on a production and need wardrobe you won't have to think twice about?
          </p>
          <Link
            href="/booking"
            className="mt-4 inline-block border border-gold px-4 py-2 text-sm text-gold"
          >
            Book a call
          </Link>
        </div>
      </div>
    </div>
  );
}
