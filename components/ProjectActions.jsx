"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectActions({ projectId, status, clientId }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggleArchive = async () => {
    setBusy(true);
    try {
      await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status === "active" ? "archived" : "active" }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this project and all its media? This can't be undone.")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/projects/${projectId}`, { method: "DELETE" });
      router.push(clientId ? `/admin/clients/${clientId}` : "/admin");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-3 text-xs">
      <button
        onClick={toggleArchive}
        disabled={busy}
        className="border border-line px-3 py-1.5 text-stone disabled:opacity-50"
      >
        {status === "active" ? "Archive project" : "Reactivate project"}
      </button>
      <button
        onClick={remove}
        disabled={busy}
        className="border border-line px-3 py-1.5 text-red-700 disabled:opacity-50"
      >
        Delete project
      </button>
    </div>
  );
}
