# Hur Travel Medical

A bilingual (Arabic/English) medical tourism website for **Hur Travel Medical** — a luxury 10-day clinical stay program in Hurghada, Egypt, pairing European-credentialed doctors with beachfront recovery on the Red Sea. Built with Next.js 15 and Payload CMS v3.

## Features

- **Doctors** - Consultant profiles with specialties, European certifications, career history, procedure galleries, and case/surgery occurrences
- **Hotels** - Partner hotel listings with photo galleries surfaced on the homepage ("Where you can stay")
- **Medical Consultation** - Lead-capture form tied to a specific doctor or general inquiry
- **Full Bilingual i18n** - Arabic (RTL) and English (LTR) with a cookie-based locale switch, translated throughout the frontend
- **Payload CMS Admin** - Draft/publish workflow, live preview (mobile/tablet/desktop), Pages and Posts collections
- **Supabase Storage** - S3-compatible media uploads with public CDN URLs
- **SEO** - Sitemaps, meta tags, structured data
- **Responsive Design** - Mobile, tablet, and desktop layouts

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15 (App Router) |
| CMS | Payload CMS 3 |
| Database | MongoDB (Atlas) |
| Media Storage | Supabase Storage (S3-compatible) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| i18n | Custom dictionary-based translator (`src/i18n`), Arabic/English |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+ (local via Docker, or MongoDB Atlas)
- A Supabase project (for media storage) — optional for local development without uploads

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Start MongoDB (using Docker)
docker-compose up -d

# Run development server
pnpm dev
```

### Environment Variables

See `.env.example` for the full list. Key variables:

```bash
# Database (MongoDB Atlas or local)
NEXT_PRIVATE_DATABASE_URL=mongodb://127.0.0.1/hur-travel

# Payload
NEXT_PRIVATE_PAYLOAD_SECRET=your-secret-here
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PREVIEW_SECRET=your-preview-secret

# Supabase Storage (S3-compatible uploads + public URLs)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PRIVATE_SUPABASE_STORAGE_BUCKET_NAME=hur
NEXT_PRIVATE_S3_ENDPOINT=https://your-project-ref.storage.supabase.co/storage/v1/s3
NEXT_PRIVATE_S3_ACCESS_KEY_ID=
NEXT_PRIVATE_S3_SECRET_ACCESS_KEY=
NEXT_PRIVATE_S3_REGION=eu-central-1
```

## Project Structure

```
hur-travel/
├── src/
│   ├── app/
│   │   ├── (frontend)/            # Public site
│   │   │   ├── page.tsx           # Homepage (hero, package timeline, hotels, doctors, CTA)
│   │   │   ├── doctors/           # Doctor listing + detail + surgery/case pages
│   │   │   ├── consultation/      # Medical consultation lead form
│   │   │   ├── search/            # Site search
│   │   │   ├── posts/             # Blog-style posts
│   │   │   └── [slug]/            # CMS-managed static pages
│   │   └── (payload)/             # Payload admin + REST/GraphQL API routes
│   ├── collections/               # Payload collections
│   │   ├── Doctors/               # Doctor profiles, procedures, certifications
│   │   ├── Hotels/                # Partner hotel listings + galleries
│   │   ├── Pages/                 # Flexible CMS pages
│   │   ├── Posts/                 # Blog posts
│   │   ├── Media.ts               # Media/uploads
│   │   └── Users/                 # Admin users
│   ├── components/
│   │   ├── medical/               # Hero, package timeline, doctor cards, hotel gallery
│   │   ├── ConsultationForm/       # Consultation lead form
│   │   └── ...                    # Shared UI (Header, Footer, Media, ui/*)
│   ├── i18n/                      # Arabic/English dictionary, locale detection, RTL helpers
│   ├── utilities/                 # Shared helpers (media URLs, gallery flattening, etc.)
│   ├── payload.config.ts          # Payload configuration
│   └── payload-types.ts           # Generated collection types
├── public/                        # Static assets
├── docker-compose.yml             # Local MongoDB container
└── tailwind.config.mjs            # Tailwind config
```

## Localization

The site is fully bilingual:

- Translations live in `src/i18n/translations.ts` as flat `ar`/`en` dictionaries with `{param}` interpolation.
- Locale is resolved server-side from a `locale` cookie (`src/i18n/server.ts`), defaulting to Arabic.
- `getDirection(locale)` drives `dir="rtl"|"ltr"` on `<html>`, and layouts use logical CSS properties (`ps-*`, `-start-*`, etc.) so both directions render correctly.
- When adding UI copy, add both an `ar` and `en` entry to `translations.ts` rather than hardcoding strings in components.

## Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Deployment

1. Set all environment variables (see `.env.example`)
2. Use MongoDB Atlas for production data
3. Configure Supabase Storage (or another S3-compatible bucket) for media
4. Deploy to Vercel (or any Node host) — `vercel` CLI works out of the box

## License

MIT
