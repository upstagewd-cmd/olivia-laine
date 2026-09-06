import { neon } from "@neondatabase/serverless";

// Lazy on purpose: creating this at module load time (rather than on first
// actual use) makes it run during Next.js's build-time "collecting page
// data" step too — and on Cloudflare, runtime secrets aren't available
// during that build phase, so DATABASE_URL would be undefined and this
// would throw and crash the whole build.
let _sql;
export function sql(...args) {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql(...args);
}
