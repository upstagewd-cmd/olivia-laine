import BookingEmbed from "@/components/BookingEmbed";

export default async function BookingPage({ searchParams }) {
  const params = await searchParams;
  // Falls back to the default link automatically if a separate personal
  // styling calendar hasn't been set up yet — nothing breaks either way.
  const calLink =
    params?.track === "personal"
      ? process.env.NEXT_PUBLIC_CAL_LINK_PERSONAL || process.env.NEXT_PUBLIC_CAL_LINK
      : process.env.NEXT_PUBLIC_CAL_LINK;

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 pb-16 pt-28 md:p-10 md:pb-16 md:pl-[216px]">
      <h1 className="flex-shrink-0 text-2xl text-ink">Book a call</h1>
      <div className="mt-6">
        <BookingEmbed calLink={calLink} />
      </div>
    </div>
  );
}
