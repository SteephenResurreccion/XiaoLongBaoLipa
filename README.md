# Xiao Long Bow — Website

Xiao Long Bow is a Filipino home-based food business selling handmade Chocolate Xiao Long Bao, based in Lipa City, Batangas.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database**: SQLite via Prisma 7 + `@prisma/adapter-libsql`
- **Auth**: NextAuth.js (Google OAuth — owner only)
- **Payments**: PayMongo (GCash), Stripe (card)
- **SMS**: Semaphore
- **Delivery**: Lalamove API

---

## Before You Launch — Accounts to Create

1. **Semaphore** — semaphore.co.ph — Load ₱100 credits to start
2. **PayMongo** — paymongo.com — Register business for GCash
3. **Stripe** — stripe.com — For card payments
4. **Lalamove Business Account** — lalamove.com — Apply for API access
5. **Google Cloud Console** — Create OAuth credentials for admin login
6. **Google Analytics** — analytics.google.com — Create GA4 property
7. **Vercel** — vercel.com — For deployment

---

## Setup

### 1. Install dependencies
```
npm install
```

### 2. Configure .env
Fill in your API keys (see .env for all variables).

### 3. Set up the database
```
npx prisma migrate dev
npx prisma generate
```

### 4. Run locally
```
npm run dev
```

- Customer site: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

---

## Google OAuth Setup (Admin Login)
1. Go to console.cloud.google.com → Create project
2. Credentials → Create OAuth 2.0 Client ID
3. Authorized redirect URI: https://your-domain.com/api/auth/callback/google
4. Set OWNER_GOOGLE_EMAIL to your Google email — only this can log in

## Stripe Webhook
Endpoint: https://your-domain.com/api/payment/stripe-webhook
Event: payment_intent.succeeded

## Lalamove Notes
- Set LALAMOVE_ENVIRONMENT="sandbox" for dev (returns mock ₱150 fee)
- Set LALAMOVE_ENVIRONMENT="production" for live

## Production Deployment
- Vercel: push to GitHub, connect repo on vercel.com, set env vars
- Hostinger: npm run build, upload project, set start command: npm start
- For Hostinger production, consider switching to PostgreSQL (update schema + adapter)

## Project Structure
app/(public)/     — Customer pages (Home, Menu, Track, About, FAQ, etc.)
app/admin/        — Admin dashboard (Google OAuth protected)
app/api/          — All backend API routes
lib/              — Prisma, Stripe, PayMongo, Lalamove, Semaphore clients
