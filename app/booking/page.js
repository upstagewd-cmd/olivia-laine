import BookingEmbed from "@/components/BookingEmbed";

export default function BookingPage() {
  return (
    <div className="flex flex-1 flex-col p-4 pt-20 md:p-10 md:pl-[216px]">
      <h1 className="text-2xl text-ink">Book a call</h1>
      <div className="mt-6 flex-1">
        <BookingEmbed />
      </div>
    </div>
  );
}
