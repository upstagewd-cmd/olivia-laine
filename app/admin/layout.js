import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/isAdmin";

export default async function AdminLayout({ children }) {
  const userId = await requireAdmin();
  if (!userId) redirect("/");

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex gap-4 border-b border-line px-4 py-3 text-sm md:px-10">
        <Link href="/admin" className="text-ink">
          Dashboard
        </Link>
        <Link href="/admin/clients/new" className="text-stone">
          + Client
        </Link>
        <Link href="/admin/projects/new" className="text-stone">
          + Project
        </Link>
        <Link href="/admin/inquiries" className="text-stone">
          Inquiries
        </Link>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
