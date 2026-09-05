/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Point this at your R2 public bucket domain once it's set up.
    remotePatterns: [{ protocol: "https", hostname: "**.r2.dev" }],
  },
};

export default nextConfig;

