/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Point this at your R2 public bucket domain once it's set up.
    remotePatterns: [{ protocol: "https", hostname: "**.r2.dev" }],
  },
  // The little route-info badge Next.js shows in dev mode — harmless (never
  // shows in production) but easy to mistake for part of the UI while
  // testing locally.
  devIndicators: false,
};

export default nextConfig;
