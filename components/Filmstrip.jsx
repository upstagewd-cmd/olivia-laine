"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import RatingSlate from "./RatingSlate";

function FileCard({ item }) {
  const filename = item.originalFilename || item.src?.split("/").pop() || "File";
  return (
    <a
      href={item.src}
      target="_blank"
      rel="noreferrer"
      className="flex h-full w-full flex-col items-center justify-center gap-3 bg-line/60 p-6 text-center transition-colors duration-300 hover:bg-line"
    >
      <div className="border border-stone px-3 py-1 text-[10px] uppercase tracking-widest text-stone">
        File
      </div>
      <div className="max-w-[80%] break-words text-sm text-ink">{filename}</div>
      <div className="text-xs text-gold underline">Open / Download</div>
    </a>
  );
}

function LinkCard({ item }) {
  let hostname = item.linkUrl;
  try {
    hostname = new URL(item.linkUrl).hostname.replace("www.", "");
  } catch {
    // leave hostname as the raw string if it's not a fully valid URL
  }
  return (
    <a
      href={item.linkUrl}
      target="_blank"
      rel="noreferrer"
      className="flex h-full w-full flex-col items-center justify-center gap-3 bg-line/60 p-6 text-center transition-colors duration-300 hover:bg-line"
    >
      <div className="border border-stone px-3 py-1 text-[10px] uppercase tracking-widest text-stone">
        Link
      </div>
      <div className="max-w-[80%] break-words text-sm text-ink">{hostname}</div>
      <div className="text-xs text-gold underline">Open ↗</div>
    </a>
  );
}

function FilmstripItem({ item, withRating, autoplayVideo }) {
  return (
    <motion.div
      className="relative flex h-full w-[84vw] flex-none flex-col overflow-y-auto snap-start md:w-[32vw]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative flex-1 overflow-hidden">
        {item.type === "video" && (
          <video
            src={item.src}
            controls
            {...(autoplayVideo ? { autoPlay: true, muted: true, loop: true, playsInline: true } : {})}
            className="block h-full w-full object-cover bg-[#2b2822] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}
        {item.type === "image" && (
          <img
            src={item.src}
            alt={item.name || item.caption || ""}
            className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}
        {item.type === "file" && <FileCard item={item} />}
        {item.type === "link" && <LinkCard item={item} />}

        {(item.name || item.caption) && (item.type === "image" || item.type === "video") && (
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
        {item.caption && (item.type === "file" || item.type === "link") && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg to-transparent p-3 text-center text-xs italic text-stone">
            {item.caption}
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

export default function Filmstrip({ items, withRating = false, autoplayVideo = false }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const [offset, setOffset] = useState(0);

  const clamp = useCallback((val) => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return 0;
    const max = Math.max(0, track.scrollWidth - container.clientWidth);
    return Math.min(Math.max(val, 0), max);
  }, []);

  const setClampedOffset = useCallback(
    (val) => {
      const next = clamp(val);
      offsetRef.current = next;
      setOffset(next);
    },
    [clamp]
  );

  // Desktop only: wheel input (any direction) pans the strip, driven by our
  // own offset state rather than the browser's native scroll position — this
  // sidesteps scroll-snap and native-scroll quirks entirely, since there's
  // no native horizontal scrolling happening on desktop anymore at all.
  // Mobile keeps native touch-swipe scrolling completely untouched (this
  // handler simply never fires for touch input).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      if (window.innerWidth < 768) return; // let mobile's native scroll handle it
      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      setClampedOffset(offsetRef.current + delta);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [setClampedOffset]);

  const scroll = (dir) => setClampedOffset(offsetRef.current + dir * 360);

  return (
    <div ref={containerRef} className="relative min-h-0 flex-1 overflow-x-auto md:overflow-hidden">
      <div
        ref={trackRef}
        className="flex h-full snap-x snap-proximity gap-4 p-4 pt-28 md:gap-4 md:pb-8 md:pl-[216px] md:pr-6 md:pt-8"
        style={{ transform: `translateX(-${offset}px)` }}
      >
        {items.map((item) => (
          <div className="group h-full" key={item.id}>
            <FilmstripItem item={item} withRating={withRating} autoplayVideo={autoplayVideo} />
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
        className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-black/55 text-ondark transition-transform hover:scale-110 md:left-[224px] md:block"
      >
        ‹
      </button>
    </div>
  );
}
