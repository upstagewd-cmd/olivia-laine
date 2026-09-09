import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-8 p-8 pt-28 md:p-12 md:pl-[216px]">
      <div>
        <p className="text-lg text-ink">Let's talk about your production.</p>
        <a href="mailto:hello@olivialainestylist.com" className="mt-2 inline-block text-gold underline">
          hello@olivialainestylist.com
        </a>
      </div>
      <ContactForm />
    </div>
  );
}
