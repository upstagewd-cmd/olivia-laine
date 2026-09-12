"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ThemeSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Portal and Admin are working tools tied to a specific person's
    // relationship with her, not general marketing browsing — they stay in
    // one consistent theme regardless of which track a visitor picked
    // elsewhere on the site.
    const isThemedRoute = !pathname.startsWith("/portal") && !pathname.startsWith("/admin");
    const track = isThemedRoute && searchParams.get("track") === "personal" ? "personal" : "commercial";
    document.documentElement.dataset.track = track;
  }, [pathname, searchParams]);

  return null;
}
