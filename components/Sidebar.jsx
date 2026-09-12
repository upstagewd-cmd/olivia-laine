"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/work", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

const TRACKS = { commercial: "Commercial", personal: "Personal Styling" };

function ClapperIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 9.5L4.5 5h15L21 9.5M3 9.5V19a1 1 0 001 1h16a1 1 0 001-1V9.5M3 9.5h18M7 5l1.5 4.5M13 5l1.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HangerIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 4a1.6 1.6 0 10-1.6 1.6M12 5.6v2M4 20l7.2-6.2a1.2 1.2 0 011.6 0L20 20M4 20h16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = { commercial: ClapperIcon, personal: HangerIcon };

function NavLink({ item, active, layoutId, track }) {
  const href = track ? `${item.href}?track=${track}` : item.href;
  return (
    <Link href={href} className="relative w-fit whitespace-nowrap px-1 py-2 text-sm">
      <span
        className="transition-colors duration-300"
        style={{ color: active ? "#A9822F" : "#8F8471", fontStyle: active ? "italic" : "normal" }}
      >
        {item.label}
      </span>
      {active && (
        <motion.span
          layoutId={layoutId}
          className="absolute bottom-0 left-1 right-1 h-px bg-gold"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
    </Link>
  );
}

function TrackToggle({ pathname, activeTrack }) {
  return (
    <div className="flex flex-col border border-line">
      {Object.entries(TRACKS).map(([key, label]) => {
        const Icon = ICONS[key];
        const isActive = activeTrack === key;
        return (
          <Link
            key={key}
            href={`${pathname}?track=${key}`}
            className={`flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-wide transition-colors duration-300 ${
              isActive ? "bg-gold text-ondark" : "text-stone hover:text-ink"
            }`}
          >
            <Icon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="whitespace-nowrap">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}

function AccountControls({ portalActive }) {
  return (
    <>
      <Link
        href="/portal"
        className={`whitespace-nowrap border px-3 py-1.5 text-xs transition-colors duration-300 ${
          portalActive ? "border-gold text-gold" : "border-line text-stone hover:border-stone"
        }`}
      >
        Client Portal
      </Link>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-xs text-stone underline">Sign in</button>
        </SignInButton>
      </SignedOut>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const track = searchParams.get("track");
  const activeTrack = track === "personal" ? "personal" : "commercial";
  const portalActive = pathname === "/portal";

  // The splash page is its own full-screen entry point — no persistent
  // chrome over it.
  if (pathname === "/") return null;

  return (
    <>
      {/* Mobile: fixed top bar, two rows — logo + account controls always
          fully visible on row one, nav scrolls separately on row two below.
          Cramming everything into one row was clipping the account controls
          on narrow screens. */}
      <div className="fixed inset-x-0 top-0 z-20 flex flex-col border-b border-line/60 bg-bg/70 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-shrink-0 font-serif text-[15px] tracking-[2px] text-ink">
            OLIVIA LAINE
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <AccountControls portalActive={portalActive} />
          </div>
        </div>
        <nav className="flex flex-row gap-4 overflow-x-auto px-4 pb-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={pathname === item.href}
              layoutId="active-nav-underline-mobile"
              track={track}
            />
          ))}
        </nav>
      </div>

      {/* Desktop: fixed left column. Track toggle now lives here, near the
          bottom, so it's available everywhere rather than only on one page. */}
      <div className="fixed inset-y-0 left-0 z-20 hidden w-[200px] flex-col justify-between border-r border-line/60 bg-bg/70 px-6 py-7 backdrop-blur-md md:flex">
        <div>
          <div className="font-serif text-xl tracking-[2px] text-ink">
            OLIVIA
            <br /> LAINE
          </div>
          <div className="mt-2 text-[10px] leading-relaxed tracking-widest text-stone">
            STYLIST FOR FILM &amp; COMMERCIALS
          </div>
          <nav className="mt-8 flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={pathname === item.href}
                layoutId="active-nav-underline-desktop"
                track={track}
              />
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <TrackToggle pathname={pathname} activeTrack={activeTrack} />
          <div className="flex items-center gap-2">
            <AccountControls portalActive={portalActive} />
          </div>
          <div className="text-[11px] leading-relaxed text-stone">
            hello@olivialainestylist.com
          </div>
        </div>
      </div>
    </>
  );
}
