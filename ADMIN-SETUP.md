# Admin upload flow — setup

This adds a private `/admin` area (protected by `ADMIN_CLERK_USER_ID`) for
adding clients, creating projects, and uploading media directly to R2 from
the browser — no more SQL editor or R2 dashboard uploads for day-to-day use.

## 1. New dependencies

```
npm install
```

Pulls in the AWS SDK packages used for R2's S3-compatible upload API.

## 2. New environment variable

Add to `.env.local`:

```
ADMIN_CLERK_USER_ID=user_xxx
```

Use your own Clerk User ID (Clerk dashboard → Users → click yourself → copy
the User ID at the top). Only this account can see `/admin`.

## 3. Enable CORS on your R2 bucket

This is the one step that's easy to miss, and uploads will silently fail
without it: the browser is uploading directly to R2 (not through your
server), so R2 needs to allow that.

In the Cloudflare dashboard → R2 → your bucket → Settings → CORS Policy, add:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://your-production-domain.com"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"]
  }
]
```

Update the production domain once you've deployed.

## 4. Using it

- Go to `/admin` while signed in as the admin account
- `+ Client` — add a client's name, email, and their Clerk User ID (same
  one-time lookup as before, in Clerk's dashboard, after they've signed up)
- `+ Project` — pick the client, name the project
- Click into a project → drag a photo or video onto the upload box, or click
  to choose a file. It uploads straight to R2 and appears in the list below
  immediately.

## 5. Connecting the public portfolio

The homepage now pulls from a project's media too, the same way the client
portal does — you just point it at a specific project instead of looking one
up by signed-in client.

1. In `/admin`, click **+ Client**. Since this isn't a real client, use:
   - Name: `Public Portfolio`
   - Email: anything (e.g. `portfolio@olivialaine.com`)
   - Clerk User ID: literally type `public-portfolio` — it doesn't need to be
     a real Clerk ID, since this "client" never logs in. It just needs to be
     unique in the table.
2. Click **+ Project**, pick "Public Portfolio" as the client, title it
   something like `Selected Work`.
3. After creating it, you'll land on `/admin/projects/<some-id>` — copy that
   id from the URL.
4. Paste it into `.env.local` as `PUBLIC_PORTFOLIO_PROJECT_ID=<that-id>`.
5. Restart the dev server, then upload real photos/video into that project
   the same way you would for a client — they'll now show up on the
   homepage automatically, in the order you upload them.

Uploading a new piece later is just: go to that project in `/admin`, drag in
the file. No code or redeploy needed — it'll appear next time the homepage
is loaded.

