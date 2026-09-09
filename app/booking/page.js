import BookingEmbed from "@/components/BookingEmbed";

export default function BookingPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 pb-16 pt-28 md:p-10 md:pb-16 md:pl-[216px]">
      <h1 className="flex-shrink-0 text-2xl text-ink">Book a call</h1>
      <div className="mt-6">
        <BookingEmbed />
      </div>
    </div>
  );
}
