# Automated client onboarding — setup

This replaces manually pasting a Clerk User ID for every new client. Now:
`admin creates client (name + email)` → `Clerk sends invite automatically` →
`client signs up` → `webhook links their account automatically`.

## 1. Database migration

Your `clients` table already exists with `clerk_user_id` as `NOT NULL`. Run
this once in Neon's SQL editor:

```sql
alter table clients alter column clerk_user_id drop not null;
```

## 2. New environment variables

Add to `.env.local` (and to both Cloudflare "Variables and Secrets" sections
— runtime and Build — same as everything else):

```
SITE_URL=https://your-real-domain.com
CLERK_WEBHOOK_SECRET=whsec_...
```

`SITE_URL` should be your actual production domain (not the workers.dev one
if you've attached a custom domain by the time you read this) — it's used
so invitation emails redirect back to the right place after signup.

## 3. Create the webhook in Clerk

1. Clerk dashboard → **Webhooks** → **Add Endpoint**
2. Endpoint URL: `https://your-real-domain.com/api/webhooks/clerk`
3. Subscribe to the **`user.created`** event only
4. Save, then copy the **Signing Secret** it shows you (starts with `whsec_`)
   into `CLERK_WEBHOOK_SECRET`
5. Redeploy so the new env var takes effect

## 4. Test it

1. In `/admin/clients/new`, create a client with a real email you can check
2. They should receive an invitation email from Clerk within a minute or two
3. Once they click it and complete signup, check `/admin/clients/<id>` —
   it should now show their Clerk User ID instead of "Invite sent — waiting
   for them to sign up"
4. Their `/portal` should now show whatever project you've set up for them

## If it doesn't link automatically

- Double check the webhook is actually receiving events: Clerk dashboard →
  Webhooks → your endpoint → there's a log of recent deliveries and their
  response codes. A 401 there usually means `CLERK_WEBHOOK_SECRET` is wrong
  or wasn't picked up (redeploy needed).
- The match is by email, case-insensitively — make sure the email you used
  in `/admin/clients/new` matches exactly what they sign up with.
