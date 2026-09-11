"use client";

import { useEffect, useRef } from "react";

export default function BookingEmbed({ calLink: calLinkProp }) {
  const calLink = calLinkProp || process.env.NEXT_PUBLIC_CAL_LINK;
  const containerRef = useRef(null);
  // A fresh namespace per mount, so Cal's embed script treats every visit as
  // a brand-new embed rather than colliding with leftover state from a
  // previous mount.
  const namespaceRef = useRef(`booking-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!calLink || !containerRef.current) return;
    const namespace = namespaceRef.current;

    (function (C, A, L) {
      let p = function (a, ar) {
        a.q.push(ar);
      };
      let d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments);
            };
            const ns = ar[1];
            api.q = api.q || [];
            if (typeof ns === "string") {
              cal.ns[ns] = cal.ns[ns] || api;
              p(cal.ns[ns], ar);
              p(cal, ["initNamespace", ns]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", namespace, { origin: "https://cal.com" });
    window.Cal.ns[namespace]("inline", {
      elementOrSelector: containerRef.current,
      calLink,
      config: { layout: "month_view" },
    });
  }, [calLink]);

  if (!calLink) {
    return (
      <div className="p-8 text-stone">
        Booking isn't connected yet — set NEXT_PUBLIC_CAL_LINK once there's a Cal.com account.
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: 600 }} />;
}
