"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InquiryReply({ inquiryId, repliedAt }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const router = useRouter();

  const send = async () => {
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error();
      setMessage("");
      setOpen(false);
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
    }
  };

  if (!open) {
    return (
      <div className="mt-2 flex items-center gap-3">
        <button onClick={() => setOpen(true)} className="text-xs text-gold underline">
          Reply
        </button>
        {repliedAt && (
          <span className="text-xs text-stone">
            Replied {new Date(repliedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="Your reply…"
        className="w-full border border-line bg-transparent p-2 text-sm text-ink transition-colors duration-200 focus:border-gold"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={send}
          disabled={status === "sending"}
          className="border border-gold px-3 py-1.5 text-xs text-gold disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send reply"}
        </button>
        <button onClick={() => setOpen(false)} className="text-xs text-stone">
          Cancel
        </button>
        {status === "error" && <span className="text-xs text-red-700">Failed — try again</span>}
      </div>
    </div>
  );
}
