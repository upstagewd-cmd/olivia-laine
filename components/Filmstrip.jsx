"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import RatingSlate from "./RatingSlate";

function FilmstripItem({ item, withRating }) {
  return (
    <motion.div
      className="relative w-[84vw] flex-none snap-start md:w-[320px]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative overflow-hidden">
        {item.type === "video" ? (
          <video
            src={item.src}
            controls
            className="block h-[460px] w-full object-cover bg-[#2b2822] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <img
            src={item.src}
            alt={item.name || item.caption || ""}
            className="block h-[460px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}

        {(item.name || item.caption) && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4 text-[13px] text-ondark opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100">
            {item.name ? (
              <>
                <span className="font-medium">{item.name}</span>
                <span className="text-stone">
                  {" "}
                  — {item.role}, {item.client}
                </span>
              </>
            ) : (
              <span className="italic text-stone">{item.caption}</span>
            )}
          </div>
        )}
      </div>
      {withRating && (
        <RatingSlate
          mediaItemId={item.id}
          initialRating={item.rating}
          initialComment={item.comment}
        />
      )}
    </motion.div>
  );
}

export default function Filmstrip({ items, withRating = false }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <div className="relative flex-1">
      <div
        ref={ref}
        className="flex h-full snap-x snap-mandatory gap-4 overflow-x-auto p-4 md:gap-4 md:p-10"
      >
        {items.map((item) => (
          <div className="group" key={item.id}>
            <FilmstripItem item={item} withRating={withRating} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-black/55 text-ondark transition-transform hover:scale-110 md:block"
      >
        ›
      </button>
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-black/55 text-ondark transition-transform hover:scale-110 md:block"
      >
        ‹
      </button>
    </div>
  );
}
