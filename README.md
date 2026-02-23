# CarTrade – Car Marketplace

Next.js car marketplace with **shadcn/ui**, **Supabase**, **Prisma**, and **Cloudinary** for images.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **shadcn/ui** (New York style, Tailwind v4)
- **Supabase** (Auth + optional Realtime; DB via Prisma)
- **Prisma** (Postgres – use your Supabase DB URL)
- **Cloudinary** (image uploads and delivery)

## Environment

Copy `.env.example` to `.env` and fill in your keys:

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` from [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API.
- **Database**: `DATABASE_URL` and `DIRECT_URL` from Supabase → Settings → Database (use Transaction pooler for `DATABASE_URL`, direct for `DIRECT_URL`).
- **Cloudinary**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and create an upload preset for `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

## Supabase Auth

Auth is wired for session refresh and OAuth/magic-link callbacks:

- **Middleware** (`middleware.ts`) refreshes the Supabase session on each request so users stay logged in.
- **Callback** (`app/auth/callback/route.ts`) exchanges the auth code for a session after sign-in.

In [Supabase Dashboard](https://supabase.com/dashboard) → Authentication → URL Configuration, set:

- **Site URL**: `http://localhost:3000` (or your production URL).
- **Redirect URLs**: add `http://localhost:3000/auth/callback` (and your production callback, e.g. `https://yourdomain.com/auth/callback`).

Use `createClient()` from `@/lib/supabase/client` in Client Components and from `@/lib/supabase/server` in Server Components / Route Handlers.

## CLI usage

- **Prisma**: `npm run db:generate`, `npm run db:push`, `npm run db:migrate`, `npm run db:studio`
- **Supabase**: `npx supabase` (e.g. `npx supabase login`, `npx supabase link`, `npx supabase start` for local dev)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
