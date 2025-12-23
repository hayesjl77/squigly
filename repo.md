# Squigly Repository Overview

## Project Information

- **Name**: squigly
- **Version**: 0.1.0
- **Type**: Next.js Web Application
- **Status**: Private Repository

## Technology Stack

### Frontend
- **Framework**: Next.js 16.1.0
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4 with PostCSS
- **Type Checking**: Strict mode enabled

### Backend/Services
- **Database**: Supabase (PostgreSQL)
  - `@supabase/supabase-js`: 2.89.0
  - `@supabase/ssr`: 0.8.0
- **Payments**: Stripe
  - `stripe`: 20.1.0
  - `@stripe/stripe-js`: 8.6.0
- **Analytics**: Google Analytics
  - `@google-analytics/data`: 5.2.1
- **Authentication**: Google Auth
  - `google-auth-library`: 10.5.0
  - `googleapis`: 169.0.0

### Development Tools
- **ESLint**: 9.x with Next.js config
- **TypeScript**: 5.x
- **Module System**: ESNext

## Project Structure

```
squigly/
├── public/                 # Static assets
│   └── images/
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   │   ├── youtube/   # YouTube integration endpoints
│   │   │   ├── stripe/    # Stripe payment endpoints
│   │   │   ├── ai/        # AI analysis endpoints
│   │   │   └── waitlist/  # Waitlist management
│   │   ├── page.tsx       # Home page
│   │   ├── layout.tsx     # Root layout
│   │   ├── pricing/       # Pricing page
│   │   ├── roadmap/       # Roadmap page
│   │   ├── privacy/       # Privacy policy page
│   │   └── terms/         # Terms of service page
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   ├── AuthHeader.tsx
│   │   └── Providers.ts   # React context providers
│   └── lib/               # Utilities and clients
│       ├── supabaseClient.ts
│       ├── supabaseAdmin.ts
│       └── stripe.ts
├── .zencoder/             # Zencoder config and rules
├── .idea/                 # WebStorm IDE settings
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
├── eslint.config.mjs      # ESLint configuration
├── postcss.config.mjs     # PostCSS configuration
└── package.json           # Project dependencies

```

## Key Features

### API Endpoints

**YouTube Integration**
- `/api/youtube/channel` - Get channel information
- `/api/youtube/videos` - Fetch videos
- `/api/youtube/shorts` - Fetch shorts
- `/api/youtube/analytics` - Get analytics data
- `/api/youtube/callback` - OAuth callback handler

**Stripe Integration**
- `/api/stripe/portal` - Customer portal access

**AI Features**
- `/api/ai/analyze` - AI analysis endpoint

**Waitlist Management**
- `/api/waitlist` - Manage user waitlist

### Public Pages
- Home page (`/`)
- Pricing (`/pricing`)
- Roadmap (`/roadmap`)
- Privacy Policy (`/privacy`)
- Terms of Service (`/terms`)

## Configuration

### TypeScript
- **Target**: ES2017
- **Strict Mode**: Enabled
- **Path Aliases**: `@/*` → `./src/*`

### Styling
- Tailwind CSS 4 with PostCSS support
- Global styles via Tailwind

## Available Scripts

```bash
npm run dev       # Start development server on http://localhost:3000
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## Environment Setup

This project requires configuration for:
- **Supabase**: Database and authentication
- **Stripe**: Payment processing
- **Google APIs**: YouTube and Analytics data
- **OAuth**: Google authentication

## Development Workflow

1. Start the development server: `npm run dev`
2. Edit files in `src/` for automatic hot reload
3. Use `@/` path alias to import from src directory
4. Run linting: `npm run lint`
5. Build for production: `npm run build`

## Deployment

Deploy using Vercel (recommended for Next.js):
1. Push to repository
2. Connect to Vercel dashboard
3. Configure environment variables for services
4. Deploy automatically on push

## Notes

- The project uses Next.js App Router (newer routing system)
- Strict TypeScript configuration for type safety
- Integrated with Supabase for backend services
- Payment processing via Stripe API
- YouTube data integration through Google APIs
- Currently in v0.1.0 - early development stage
