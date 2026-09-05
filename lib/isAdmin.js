import { auth } from "@clerk/nextjs/server";

// Simple single-admin check for now: her Clerk user ID lives in an env var.
// Good enough while it's just her; if there's ever a second admin, this is
// the place to swap in Clerk's publicMetadata role check instead.
export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId || userId !== process.env.ADMIN_CLERK_USER_ID) {
    return null;
  }
  return userId;
}
