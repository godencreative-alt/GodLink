# godl.ink — Modern URL Shortener

A premium URL shortener built for the **Goden Creative** ecosystem. Inspired by [Kutt](https://github.com/thedevs-network/kutt), rebuilt from scratch with Next.js 15, Prisma, and a refined UX.

## Highlights

- **4-character auto slugs** — clean codes like `godl.ink/5c44`
- **Guest links + QR** — create a short link without signing up; valid 30 days
- **Free plan** — 3 active links, 90-day TTL, no custom slugs
- **Pro/Team plans** — custom slugs, custom domains, longer TTL, higher limits
- **SEO ready** — auto sitemap, robots, per-page metadata, JSON-LD schemas
- **Bilingual** — English and Indonesian, switchable per session

## Features

### Core
- Short links with custom slugs, descriptions, expiration, and password protection
- Click analytics: country, device, browser, referrer, day-by-day timeline
- Custom domains with DNS verification
- QR code generation for every link (SVG, brand-colored)
- Public redirect handler with click tracking
- Rate limiting per user and per IP

### User Dashboard
- Link management (create, edit, delete, copy, QR)
- Analytics overview with charts
- Custom domain management
- API documentation with live API key
- Account settings: profile, password change, API key rotation
- Support ticket submission
- Plan info and upgrade path
- Mobile drawer for navigation

### Admin CMS
- Site settings: logo, favicon, homepage text, login banners, SEO meta, footer
- Plan management: create, edit, delete plans with limits
- User management: change name, email, password, role, assigned plan
- Ticket management: view, reply, close tickets
- System overview: user/link/click/ticket counts

### Platform
- Light + dark themes (amber accent)
- English / Indonesian translations across the app
- Animated navbar with theme/language toggles
- Smooth Framer Motion page transitions
- Loading skeletons for slow routes
- Email verification via Resend (optional, auto-verify when not configured)
- API key authentication
- Auto-generated `sitemap.xml` and `robots.txt`
- Organization + WebSite JSON-LD schemas

## Tech Stack

| Layer       | Technology                                       |
|-------------|--------------------------------------------------|
| Framework   | Next.js 15 (App Router) + TypeScript             |
| Database    | Prisma + MySQL 8.0 / MariaDB 10.6+               |
| Auth        | Auth.js (NextAuth v5) — credentials, Google, GitHub |
| Styling     | Tailwind CSS + shadcn/ui + Framer Motion         |
| Email       | Resend (optional)                                |
| QR          | `qrcode` library                                 |
| Slug        | `nanoid` (62-char alphabet, length 4)            |
| Validation  | Zod                                              |
| Toasts      | Sonner                                           |

## Getting Started

### Prerequisites
- Node.js 22+
- MySQL 8.0+ or MariaDB 10.6+
- npm

### Installation

```bash
git clone <your-repo>
cd Shortlink
npm install
```

### Configuration

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL="mysql://root:password@localhost:3306/godlink"
NEXTAUTH_URL="http://localhost:3006"
NEXTAUTH_SECRET="generate-a-random-64-char-string"
NEXT_PUBLIC_APP_URL="http://localhost:3006"
NEXT_PUBLIC_SHORT_DOMAIN="godl.ink"

# Optional
RESEND_API_KEY=""
EMAIL_FROM="godl.ink <noreply@godl.ink>"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 48
```

### Database

```bash
npx prisma db push
```

### Run Dev Server

```bash
npm run dev
```

Open http://localhost:3006.

### Create Admin

Register an account, then promote it:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Or via Prisma Studio: `npm run db:studio`.

## Plan Behavior

| Tier         | Slug          | Links | TTL       | QR  | Custom domain |
|--------------|---------------|-------|-----------|-----|---------------|
| Guest (no signup) | Auto 4-char | 2 / IP  | 30 days   | Yes | No            |
| Free member  | Auto 4-char   | 3      | 90 days   | Yes | No            |
| Pro / Team   | Custom or auto | Plan limit | User-set | Yes | Yes (with DNS) |
| Admin        | Any           | Unlimited | Unlimited | Yes | Yes           |

## API

API docs live in the dashboard at `/dashboard/api-docs` after login.

Authentication: `Authorization: Bearer YOUR_API_KEY`

| Method | Path                       | Description              |
|--------|----------------------------|--------------------------|
| POST   | /api/links                 | Create short link        |
| GET    | /api/links                 | List your links          |
| DELETE | /api/links/[id]            | Delete a link            |
| PATCH  | /api/links/[id]            | Update a link            |
| GET    | /api/links/[id]/stats      | Get link analytics       |
| GET    | /api/qr?slug=xxx           | Get QR code SVG          |
| POST   | /api/tickets               | Submit support ticket    |
| GET    | /api/me                    | Get current user         |
| PATCH  | /api/me                    | Update profile / password / rotate key |
| GET    | /api/stats                 | Public total link count  |

## SEO Routes

- `/sitemap.xml` — auto-generated, lists 9 public routes
- `/robots.txt` — disallows `/dashboard`, `/api`, `/auth/verify`
- Per-page metadata on home, features, about, pricing, privacy, terms, support, login, register
- JSON-LD `Organization` and `WebSite` injected on every page

## Project Structure

```
src/
  app/
    page.tsx                # Landing page (guest form + 4-char slug)
    home/                   # Features page (Kutt parity + Goden polish)
    about/                  # About Goden Creative + product directory
    privacy/, terms/, support/
    auth/                   # Login, register, verify
    dashboard/              # Protected dashboard + admin CMS
    marketing/pricing/      # Pricing page
    [slug]/                 # Public redirect handler
    api/                    # All API routes
    sitemap.ts              # Auto sitemap
    robots.ts               # Auto robots.txt
  components/
    ui/                     # Primitives (button, input, card, dialog, animations)
    layout/                 # Navbar, Footer
    providers/              # AppProvider (theme, locale, session)
    auth/, dashboard/, admin/, redirect/
    links/                  # LinkResultCard
  lib/
    auth.ts, auth.config.ts # NextAuth
    prisma.ts               # Prisma client
    utils.ts, slug.ts       # Helpers
    email.ts, rate-limit.ts
    api-auth.ts, admin-auth.ts
    site-settings.ts        # CMS settings helper
    i18n.ts                 # Translations
    validators/             # Zod schemas
  styles/
    globals.css
```

## Scripts

| Command            | Description                       |
|--------------------|-----------------------------------|
| `npm run dev`      | Start dev server (port 3006)      |
| `npm run build`    | Production build                  |
| `npm start`        | Start production server           |
| `npm run db:push`  | Push schema to database           |
| `npm run db:studio`| Open Prisma Studio                |
| `npm run lint`     | Lint                              |

## Deployment

See **[DEPLOY.md](./DEPLOY.md)** for complete deployment guides:
- aaPanel (recommended, with PM2 + Nginx + Let's Encrypt)
- cPanel (Node.js App Manager + Application Manager)
- FAQ + troubleshooting

## License

Built for Goden Creative. All rights reserved.
