"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

function MediaRow({ item, isFirst, isLast }) {
  const router = useRouter();
  const [caption, setCaption] = useState(item.caption || "");
  const [savingCaption, setSavingCaption] = useState(false);
  const [busy, setBusy] = useState(false);

  const saveCaption = async () => {
    if (caption === (item.caption || "")) return;
    setSavingCaption(true);
    try {
      await fetch(`/api/admin/media/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      });
      router.refresh();
    } finally {
      setSavingCaption(false);
    }
  };

  const move = async (direction) => {
    setBusy(true);
    try {
      await fetch(`/api/admin/media/${item.id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this media item? This can't be undone.")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: busy ? 0.5 : 1 }}
      className="border-b border-line py-3"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden bg-line text-center text-[10px] text-stone">
          {item.type === "video" && <video src={item.src} className="h-full w-full object-cover" muted />}
          {item.type === "image" && <img src={item.src} alt="" className="h-full w-full object-cover" />}
          {item.type === "file" && <span>FILE</span>}
          {item.type === "link" && <span>LINK</span>}
        </div>

        <div className="w-16 flex-shrink-0 text-[10px] uppercase tracking-wide text-stone">
          {item.type}
        </div>

        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={saveCaption}
          placeholder="Caption"
          className="flex-1 border border-line bg-transparent p-2 text-sm text-ink transition-colors duration-200 focus:border-gold"
        />
        {savingCaption && <span className="text-xs text-stone">Saving…</span>}

        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            onClick={() => move("up")}
            disabled={isFirst || busy}
            className="h-8 w-8 border border-line text-stone disabled:opacity-30"
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            onClick={() => move("down")}
            disabled={isLast || busy}
            className="h-8 w-8 border border-line text-stone disabled:opacity-30"
            aria-label="Move down"
          >
            ↓
          </button>
          <button
            onClick={remove}
            disabled={busy}
            className="ml-2 h-8 w-8 border border-line text-red-700 disabled:opacity-30"
            aria-label="Delete"
          >
            ×
          </button>
        </div>
      </div>

      {(item.rating || item.comment) && (
        <div className="ml-20 mt-2 flex items-start gap-3 border-l-2 border-gold pl-3 text-sm">
          {item.rating && (
            <span className="flex-shrink-0 whitespace-nowrap text-gold">
              {item.rating}/5
            </span>
          )}
          {item.comment && <span className="italic text-stone">"{item.comment}"</span>}
        </div>
      )}
    </motion.div>
  );
}

export default function MediaManager({ media }) {
  return (
    <div className="mt-8 flex flex-col">
      {media.map((item, i) => (
        <MediaRow
          key={item.id}
          item={item}
          isFirst={i === 0}
          isLast={i === media.length - 1}
        />
      ))}
      {media.length === 0 && <div className="text-sm text-stone">No media uploaded yet.</div>}
    </div>
  );
}
