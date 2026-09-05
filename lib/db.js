import { neon } from "@neondatabase/serverless";

// Reads DATABASE_URL from the environment (set in .env.local, or in the
// Cloudflare Pages project settings for production).
export const sql = neon(process.env.DATABASE_URL);
