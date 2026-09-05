import BookingEmbed from "@/components/BookingEmbed";

export default function BookingPage() {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-10">
      <h1 className="text-2xl text-ink">Book a call</h1>
      <div className="mt-6 flex-1">
        <BookingEmbed />
      </div>
    </div>
  );
}
