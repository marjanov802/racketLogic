# RacketLogic — Setup Guide

## Tech Stack
- **Next.js** (App Router, TypeScript)
- **Tailwind CSS**
- **Supabase** (PostgreSQL database + Storage for PDFs)
- **Clerk** (authentication)
- **Stripe** (payments)
- **Resend** (transactional emails)
- **Prisma** (ORM)
- **Vercel** (hosting)

---

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New project
2. Choose a name (e.g. `racketlogic`), set a strong password
3. Wait for the project to be created

**Get your credentials:**
- Settings → API → copy `Project URL` and `anon public` key
- Settings → API → copy `service_role` key (keep this secret)
- Settings → Database → Connection string → copy the **direct** connection string (for Prisma)

**Create storage buckets:**
- Storage → New bucket → `playbooks` (set to **private**)
- Storage → New bucket → `images` (set to **public**)

---

## Step 2: Clerk Setup

1. Go to [clerk.com](https://clerk.com) → Create application
2. Name it `RacketLogic`, enable Email as sign-in method
3. Copy your `Publishable key` and `Secret key`

**Set up webhook to sync users to database:**
- Clerk Dashboard → Webhooks → Add endpoint
- URL: `https://yourdomain.com/api/webhooks/clerk`
- Events: `user.created`, `user.updated`, `user.deleted`

**Set admin role for your account:**
- Clerk Dashboard → Users → click your user → Metadata
- Add to Public metadata: `{ "role": "admin" }`

---

## Step 3: Stripe Setup

1. Go to [stripe.com](https://stripe.com) → Create account
2. Dashboard → API keys → copy Publishable and Secret keys

**Set up webhook:**
- Stripe Dashboard → Developers → Webhooks → Add endpoint
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events: `checkout.session.completed`
- Copy the signing secret

---

## Step 4: Resend Setup

1. Go to [resend.com](https://resend.com) → Create account
2. API Keys → Create API key → copy it
3. Add your sending domain (or use the default `@resend.dev` for testing)

---

## Step 5: Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

---

## Step 6: Database Setup

```bash
# Push the Prisma schema to your Supabase database
npm run db:push

# Seed the initial playbooks
npx ts-node prisma/seed.ts
```

---

## Step 7: Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Step 8: Deploy to Vercel

1. Push to GitHub
2. [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Add all environment variables from `.env.local` to Vercel
4. Deploy

**Important:** After deploying, update your Stripe webhook and Clerk webhook URLs to use your production domain.

---

## Stripe Webhook Local Testing

Install Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret printed by the CLI into `STRIPE_WEBHOOK_SECRET`.

---

## Key URLs

| Page | URL |
|------|-----|
| Home | `/` |
| Stringing | `/stringing` |
| Playbooks | `/playbooks` |
| Training | `/training` |
| Reviews | `/reviews` |
| Learn | `/learn` |
| Custom Programmes | `/custom-programmes` |
| About | `/about` |
| Contact | `/contact` |
| Sign In | `/sign-in` |
| Dashboard | `/dashboard` |
| Admin | `/admin` |

---

## Adding Content

### Playbooks
After running the seed script, all 10 playbooks and 5 bundles will be in the database.
- Upload PDFs via Admin → Playbooks → Edit → Upload PDF
- PDFs are stored in the private Supabase `playbooks` bucket

### Reviews
Admin → Reviews → New Review → write with the rich text editor → Publish

### Learn Articles
Admin → Learn Articles → New Article → write with the rich text editor → Publish

---

## Admin Role
To set yourself as admin:
1. Sign up on the website
2. Go to Clerk Dashboard → Users → your user → Metadata
3. Set Public metadata to: `{ "role": "admin" }`
4. Sign out and back in

Then visit `/admin` to access the admin panel.

---

## Customisation Points

- **Prices:** Edit directly in Admin → Playbooks or in `src/lib/playbooks-data.ts` before seeding
- **Stringing prices:** Edit in `src/app/(public)/stringing/page.tsx`
- **Brand email:** Update `RESEND_FROM_EMAIL` in `.env.local`
- **Location:** Update "England, UK" references in Footer and stringing page if needed
- **Future shop/membership:** These are not built yet — structure is ready to add pages when needed
