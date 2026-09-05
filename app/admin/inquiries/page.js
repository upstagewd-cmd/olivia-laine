import { sql } from "@/lib/db";

export default async function InquiriesPage() {
  const inquiries = await sql`
    select id, name, email, message, created_at
    from inquiries order by created_at desc
  `;

  return (
    <div className="p-4 md:p-10">
      <h1 className="text-2xl text-ink">Inquiries</h1>
      <div className="mt-6 flex flex-col gap-6">
        {inquiries.map((i) => (
          <div key={i.id} className="border-b border-line pb-4">
            <div className="flex items-baseline justify-between">
              <div className="text-sm font-medium text-ink">
                {i.name} <span className="text-stone">— {i.email}</span>
              </div>
              <div className="text-xs text-stone">
                {new Date(i.created_at).toLocaleDateString()}
              </div>
            </div>
            <p className="mt-2 text-sm text-ink">{i.message}</p>
          </div>
        ))}
        {inquiries.length === 0 && (
          <div className="text-sm text-stone">No inquiries yet.</div>
        )}
      </div>
    </div>
  );
}
