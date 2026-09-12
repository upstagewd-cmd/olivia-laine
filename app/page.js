import Link from "next/link";

function SplashHalf({ href, label, image, align }) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-1 justify-center overflow-hidden ${
        align === "top" ? "items-start pt-16 md:pt-24" : "items-end pb-16 md:pb-24"
      }`}
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-black/25 transition-opacity duration-700 group-hover:bg-black/10" />

      <span className="relative z-10 w-48 border border-ondark/30 bg-ink/70 px-6 py-3 text-center text-sm uppercase tracking-[0.2em] text-ondark backdrop-blur-sm transition-colors duration-300 group-hover:border-ondark/60">
        {label}
      </span>
    </Link>
  );
}

export default function SplashPage() {
  return (
    <div className="relative flex h-dvh w-screen flex-col">
      <SplashHalf
        href="/work?track=commercial"
        label="Commercial Styling"
        image="/commercial-banner.jpg"
        align="top"
      />
      <SplashHalf
        href="/work?track=personal"
        label="Personal Styling"
        image="/personal-banner.jpg"
        align="bottom"
      />

      {/* Logo, dead center, straddling both halves. Sized to its real
          proportions (tall — circle mark plus wordmark beneath) rather than
          forced into a square/circular backdrop. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-40 -translate-x-1/2 -translate-y-1/2 md:w-56">
        <img
          src="/logo.svg"
          alt="Olivia Laine"
          className="w-full drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
        />
      </div>
    </div>
  );
}
