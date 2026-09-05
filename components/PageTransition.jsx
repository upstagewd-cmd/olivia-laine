"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Briefly fade out, then back in, on every route change — without ever
    // unmounting the actual page content underneath. Unmounting was the bug:
    // it interrupted Next.js's data fetching and any setup effects (like the
    // Cal.com embed script) mid-flight, so nothing but a hard refresh could
    // recover.
    setVisible(false);
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      className={`flex flex-1 flex-col transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
