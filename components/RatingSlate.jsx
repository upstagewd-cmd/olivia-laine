"use client";

import { useState } from "react";
import { motion } from "motion/react";

export default function RatingSlate({ mediaItemId, initialRating, initialComment }) {
  const [rating, setRating] = useState(initialRating || null);
  const [comment, setComment] = useState(initialComment || "");
  const [saving, setSaving] = useState(false);

  const save = async (nextRating, nextComment) => {
    setSaving(true);
    try {
      await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaItemId, rating: nextRating, comment: nextComment }),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 px-0.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <motion.button
            key={n}
            whileTap={{ scale: 0.88 }}
            onClick={() => {
              setRating(n);
              save(n, comment);
            }}
            className={`h-11 w-11 border text-sm transition-colors duration-200 md:h-7 md:w-7 md:text-xs ${
              rating === n ? "border-gold bg-gold text-ondark" : "border-line text-stone"
            }`}
          >
            {n}
          </motion.button>
        ))}
      </div>
      <textarea
        placeholder="Note for her"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onBlur={() => save(rating, comment)}
        rows={2}
        className="mt-2 w-full border border-line bg-transparent p-2 text-xs text-ink transition-colors duration-200 focus:border-gold"
      />
      {saving && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 text-[11px] text-stone"
        >
          Saving…
        </motion.div>
      )}
    </div>
  );
}
