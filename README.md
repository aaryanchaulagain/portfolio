# Developer Portfolio

Premium personal portfolio and client enquiry platform for a freelance **Software & Web Developer** serving Australian and international clients.

## Features

- Conversion-focused public portfolio (hero, about, skills, services, awards, projects, trust, contact)
- Dark / light themes with accessible focus states and reduced-motion support
- Secure contact form with Zod validation, honeypot, rate limiting, and optional Turnstile
- PostgreSQL enquiry storage via Prisma
- Transactional emails (admin notification, visitor confirmation, approval email) via Resend
- Protected admin dashboard for enquiry review, approval, notes, CSV export, and activity history
- Technical SEO: metadata, Open Graph, JSON-LD, sitemap, robots, canonical URLs
- Security headers and environment-based secrets

## Technology stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Prisma + PostgreSQL
- Auth.js (NextAuth v5) credentials for admin
- Resend
- React Hook Form + Zod
- Lucide icons
- Vitest

## Local setup

```bash
npm install
cp .env.example .env.local
```

### 1. Environment variables

Edit `.env.local`:

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Session signing secret (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Yes | Admin login email |
| `ADMIN_PASSWORD_HASH` | Yes | bcrypt hash of admin password |
| `EMAIL_FROM` | Yes for production email | From address for Resend |
| `RESEND_API_KEY` | Recommended | Resend API key (emails soft-skip in local if missing) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL |
| `NEXT_PUBLIC_SITE_NAME` | Optional | Public site name override |
| `SCHEDULING_LINK` | Optional | Discovery call / calendar link in approval emails |
| `TURNSTILE_SITE_KEY` | Optional | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Optional | Cloudflare Turnstile secret |

### 2. Database

```bash
npm run db:migrate
npm run db:seed
```

Seed creates a safe demo enquiry: `ENQ-DEMO-0001`.

### 3. Admin account

```bash
npx tsx scripts/hash-password.ts "your-secure-password"
```

Put the printed hash in `ADMIN_PASSWORD_HASH`, set `ADMIN_EMAIL`, then start the app.

### 4. Run

```bash
npm run dev
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin  

## Email provider setup (Resend)

1. Create a Resend account and API key.
2. Verify your sending domain (or use the Resend onboarding address for tests).
3. Set `RESEND_API_KEY` and `EMAIL_FROM`.
4. Submit the contact form and confirm:
   - You receive an admin notification
   - The visitor receives a confirmation email
5. Approve an enquiry in `/admin` and confirm the approval email sends once.

## Portfolio content editing

Edit TypeScript modules in `src/data/` — no UI rewrites required for copy updates:

| File | Content |
|------|---------|
| `profile.ts` | Name, title, contact, images, brand positioning |
| `skills.ts` | Skill categories and honest levels |
| `services.ts` | Service outcomes |
| `awards.ts` | Awards (verify official wording before publish) |
| `projects.ts` | Projects shipped + case studies |
| `experience.ts` | Experience and “How I Work” |
| `testimonials.ts` | Placeholder testimonials only |
| `navigation.ts` | Nav / footer links |

## Image replacement

See `public/images/README.md`.

Required replacements:

- `public/images/profile.svg` → your portrait (`profile.ts` → `profileImagePath`)
- About / award / project covers under `public/images/`
- Resume PDF under `public/resume/` and update `resumeFilePath`
- `public/images/og-default.jpg` (1200×630) for social sharing

Do not publish confidential client screenshots.

## Development commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | ESLint |
| `npm test` | Vitest |
| `npm run db:generate` | Prisma client generate |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed demo enquiry |
| `npm run db:studio` | Prisma Studio |

## Production deployment (Vercel)

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add all environment variables from `.env.example`.
4. Provision PostgreSQL (Vercel Postgres, Neon, Supabase, etc.) and set `DATABASE_URL`.
5. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
6. Deploy, then run migrations against production (`prisma migrate deploy`) via CI or a one-off command.
7. Create the admin password hash and set admin env vars.
8. Verify contact → email → admin approve → approval email.

Suggested production migrate command:

```bash
npx prisma migrate deploy
```

## Security checklist

- [ ] No secrets committed (`.env.local` ignored)
- [ ] Strong `AUTH_SECRET` and unique admin password
- [ ] Admin routes protected (no public registration)
- [ ] Contact form rate limiting and honeypot enabled
- [ ] Turnstile enabled for production if desired
- [ ] Security headers enabled via `next.config.ts`
- [ ] Raw IP addresses not stored (hashed only)
- [ ] Approval emails cannot be sent twice for the same enquiry
- [ ] Private client details reviewed before publish

## Pre-launch checklist

- [ ] Replace `[YOUR FULL NAME]` and all placeholders in `src/data/profile.ts`
- [ ] Replace award wording with official certificate text
- [ ] Replace placeholder testimonials with real, permissioned quotes — or remove them
- [ ] Add real images and resume PDF
- [ ] Confirm LinkedIn, GitHub, email, WhatsApp, location
- [ ] Test contact form end-to-end with Resend
- [ ] Test admin login, approve, reject, CSV export
- [ ] Check mobile navigation, theme toggle, and keyboard focus
- [ ] Confirm `/sitemap.xml` and `/robots.txt`
- [ ] Run `npm run build`, `npm run lint`, and `npm test`
- [ ] Lighthouse pass targets (Performance / A11y / Best Practices / SEO)

## Project structure (high level)

```text
src/app/(public)   Public marketing pages
src/app/admin      Protected enquiry dashboard
src/app/api        Contact, enquiries, auth, export
src/components     Layout, sections, UI, forms, admin
src/data           Editable portfolio content
src/lib            DB, email, auth, validation, SEO
prisma             Schema, migrations, seed
```

## Licence

Private portfolio project — update licensing before open-sourcing.
"# portfolio" 
