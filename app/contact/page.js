import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-8 p-8 md:p-12">
      <div>
        <p className="text-lg text-ink">Let's talk about your production.</p>
        <a href="mailto:hello@olivialaine.com" className="mt-2 inline-block text-gold underline">
          hello@olivialaine.com
        </a>
      </div>
      <ContactForm />
    </div>
  );
}
