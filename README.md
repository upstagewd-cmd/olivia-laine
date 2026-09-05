# Olivia Laine — stylist site

Next.js app: public portfolio + a Clerk-gated client portal with a 1–5 rating
and comment on each media drop. See `../stylist-site-build-plan.md` for the
full architecture and data model this implements.

## Local setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in:
   - Clerk keys (from the Clerk dashboard — create an app, enable email sign-in)
   - `DATABASE_URL` (from your Neon project)
3. Run the schema against your Neon database:
   ```
   psql "$DATABASE_URL" -f lib/schema.sql
   ```
4. `npm run dev` → http://localhost:3000

## Adding a client (manual, for now)

Until there's an admin UI (Phase 4 in the build plan), add clients/projects
directly in Neon's SQL editor:

```sql
insert into clients (clerk_user_id, name, email)
values ('user_xxx from Clerk dashboard', 'Client name', 'client@email.com');

insert into projects (client_id, title)
values ('<client id from above>', 'Automotive spot — casting reference');

insert into media_items (project_id, r2_key, type, caption, sort_order)
values ('<project id>', 'automotive/fit-1.jpg', 'image', 'Studio fit, first pass', 0);
```

## Media storage (R2)

1. Create an R2 bucket in the Cloudflare dashboard.
2. Enable public access (or a custom domain) and set `R2_PUBLIC_URL` in your
   env to that base URL.
3. Upload files under whatever key structure you like (e.g.
   `automotive/fit-1.jpg`) and reference that key in `media_items.r2_key`.

## Deploying to Cloudflare Workers

This app deploys via the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare), which
runs a real Next.js server (App Router, Server Actions, everything) on Cloudflare Workers —
this replaced the older `@cloudflare/next-on-pages` adapter, which Cloudflare has since
deprecated in favor of this approach.

### First-time setup

1. Install the Wrangler CLI globally or use it via `npx` (already a dev dependency here).
2. Authenticate: `npx wrangler login` — opens a browser to connect your Cloudflare account.
3. Add all the environment variables from `.env.local` as Worker secrets:
   ```
   npx wrangler secret put CLERK_SECRET_KEY
   npx wrangler secret put DATABASE_URL
   npx wrangler secret put ADMIN_CLERK_USER_ID
   npx wrangler secret put R2_ACCOUNT_ID
   npx wrangler secret put R2_ACCESS_KEY_ID
   npx wrangler secret put R2_SECRET_ACCESS_KEY
   npx wrangler secret put R2_BUCKET_NAME
   npx wrangler secret put R2_PUBLIC_URL
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put CONTACT_FROM_EMAIL
   npx wrangler secret put CONTACT_TO_EMAIL
   npx wrangler secret put PUBLIC_PORTFOLIO_PROJECT_ID
   ```
   (Each command prompts you to paste the value — nothing is typed directly into the terminal
   history.) `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `NEXT_PUBLIC_CAL_LINK` are public/build-time
   values — set those directly in `wrangler.jsonc` under a `vars` block instead of as secrets.

### Deploying

```
npm run deploy
```

This builds the app with OpenNext, then deploys the resulting Worker to Cloudflare. Your site
will be live at `<name>.<your-subdomain>.workers.dev` initially — attach a custom domain from
the Cloudflare dashboard (Workers & Pages → your Worker → Settings → Domains) once you're ready.

### Ongoing deploys

Either keep running `npm run deploy` manually, or connect the GitHub repo in the Cloudflare
dashboard (Workers & Pages → Create → Connect to Git) for automatic deploys on every push.

### R2 CORS in production

Don't forget to add your production domain to the R2 bucket's CORS policy (see the CORS section
above) — the localhost-only rule from local development won't allow uploads from the live site.

## What's stubbed vs. real

- **Real**: public site, portal auth gate, rating/comment persistence to Neon.
- **Stubbed**: the two placeholder images on the homepage (swap for real
  photos/video in `app/page.js` and via R2), and admin upload (still manual
  SQL until Phase 4).
