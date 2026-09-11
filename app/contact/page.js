import ContactForm from "@/components/ContactForm";

const CONTENT = {
  commercial: {
    intro: "Let's talk about your production.",
  },
  personal: {
    // Placeholder copy — swap for her real voice once confirmed.
    intro: "Let's talk about your personal style.",
  },
};

export default async function ContactPage({ searchParams }) {
  const params = await searchParams;
  const track = CONTENT[params?.track] ? params.track : "commercial";
  const c = CONTENT[track];

  return (
    <div className="flex flex-1 flex-col justify-center gap-8 p-8 pt-28 md:p-12 md:pl-[216px]">
      <div>
        <p className="text-lg text-ink">{c.intro}</p>
        <a href="mailto:hello@olivialainestylist.com" className="mt-2 inline-block text-gold underline">
          hello@olivialainestylist.com
        </a>
      </div>
      <ContactForm track={track} />
    </div>
  );
}
