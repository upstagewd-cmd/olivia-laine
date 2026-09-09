"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/booking", label: "Booking" },
  { href: "/contact", label: "Contact" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const portalActive = pathname === "/portal";

  return (
    <div className="fixed inset-x-0 top-0 z-20 flex flex-row items-center justify-between border-b border-line/60 bg-bg/70 px-4 py-3 backdrop-blur-md md:inset-y-0 md:right-auto md:w-[200px] md:flex-col md:items-stretch md:justify-between md:border-b-0 md:border-r md:px-6 md:py-7">
      <div>
        <div className="font-serif text-[15px] tracking-[2px] text-ink md:text-xl">
          OLIVIA
          <br className="hidden md:block" /> LAINE
        </div>
        <div className="mt-2 hidden text-[10px] leading-relaxed tracking-widest text-stone md:block">
          STYLIST FOR FILM &amp; COMMERCIALS
        </div>
        <nav className="mt-0 flex flex-row gap-4 overflow-x-auto md:mt-8 md:flex-col md:gap-3 md:overflow-visible">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative w-fit whitespace-nowrap pb-1 text-sm"
              >
                <span
                  className="transition-colors duration-300"
                  style={{ color: active ? "#A9822F" : "#8F8471", fontStyle: active ? "italic" : "normal" }}
                >
                  {item.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="active-nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
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
        </div>

        <div className="hidden text-[11px] leading-relaxed text-stone md:block">
          hello@olivialainestylist.com
        </div>
      </div>
    </div>
  );
}
