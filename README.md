# TerraForm Sovereign AI Platform

**Think Tank Solutions AI** — the TerraForm Sovereign AI Platform — is a premium marketplace connecting clients with vetted AI service providers called **Conductors**. Think of it as **"Angie's List for the AI Era"**: clients bring their business pain points (their *Discord*), and the platform orchestrates vetted AI solutions (the *Harmony*) through certified providers who implement, tune, and maintain them.

The entire product experience speaks in musical-orchestration terminology — premium, confident, slightly theatrical.

## Musical Terminology Glossary

| Term | Meaning |
|---|---|
| **Overture** | The opening client journey — landing page and onboarding, where the arrangement begins. |
| **Discord** | A client pain point — the noise in their business that needs resolving (missed leads, no-shows, unanswered support, stale reviews). |
| **Harmony** | The AI solution that resolves the Discord — delivered via one of the 5 AI Agents. |
| **Conductor** | A vetted AI service provider on the marketplace. |
| **First Chair** | A top-tier Conductor — the premium subscription tier with sponsored placement. |
| **Resonance** | Reviews — the echo a Conductor leaves with their clients. |
| **Maestro** | The platform admin — oversees the directory, moderation, and sponsored placements. |
| **Open Score** | The open-source hub — community contributors who earn fee-free status. |

The platform's proprietary framework is the **Brand Symphony Arrangement Method** — mapping each client's Discord to the AI Harmony that resolves it. Tagline: *"The Market is Loud. Orchestrate It."*

## Tech Stack

- **Vite** — build tooling and dev server
- **React 18** (JSX, no TypeScript)
- **react-router-dom v6** — client-side routing
- **Tailwind CSS v3** — styling, with a custom "Sovereign AI" dark theme (`void`, `obsidian`, `neon`, `pulse`, `gold`; `font-display` / `font-body`)
- **framer-motion** — animations and scroll reveals
- **three / @react-three/fiber** — the 3D pulsing node-network hero background

Custom utility classes defined in `src/index.css`: `.glass`, `.glass-hover`, `.neon-text`, `.text-gradient`, `.btn-glow`.

## Quickstart

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the production build
```

## Deployment

The site auto-deploys to **GitHub Pages** via `.github/workflows/deploy.yml`: every push to `main` builds `dist/` and publishes it to the `gh-pages` branch (with a `404.html` SPA fallback for client-side routes). Live at <https://tinyrassmann-tweek.github.io/terraform-sovereign/>.

The Vite `base` is `/terraform-sovereign/` (set in `vite.config.js`) — update it if the repo is renamed or a custom domain is added.

## Route Map

### Public / Overture

| Route | Page |
|---|---|
| `/` | Landing — hero, Discord→Harmony pitch, featured Conductors, pricing |
| `/onboarding` | Client onboarding flow — select your Discord, get matched to Harmony |
| `/conductors` | Marketplace directory — browse, filter, and search Conductors |
| `/conductors/:id` | Conductor profile — bio, specialties, Resonance (reviews), booking |
| `/opensource` | The Open Score — open-source contributors hub |

### Client Portal

| Route | Page |
|---|---|
| `/client/settings` | Client settings — profile, favorites, bookings |

### Provider Portal (Conductor)

| Route | Page |
|---|---|
| `/provider` | Conductor dashboard — metrics, performance overview |
| `/provider/instruments` | Manage offered services (the 5 AI Agents) |
| `/provider/reviews` | Manage and respond to Resonance (reviews) |
| `/provider/tuning` | Profile tuning — pricing, availability, subscription tier |

### Admin Portal (Maestro)

| Route | Page |
|---|---|
| `/admin` | Maestro dashboard — platform metrics and health |
| `/admin/directory` | Directory management — approve / suspend providers |
| `/admin/sponsored` | Sponsored placement management (First Chair slots) |
| `/admin/moderation` | Review moderation queue |

## Directory Structure

```
src/
├── main.jsx                  # App entry point
├── App.jsx                   # Router + shared Layout (navbar/footer)
├── index.css                 # Tailwind + custom theme classes (.glass, .neon-text, …)
├── components/               # Shared UI primitives
│   ├── GlassCard.jsx         # Frosted glass card container
│   ├── NeonButton.jsx        # CTA button / Link (primary | ghost | gold)
│   ├── StarRating.jsx        # 0–5 gold star display
│   ├── SectionHeading.jsx    # Kicker + display heading block
│   ├── AgentBadge.jsx        # Pill badge for one of the 5 AI Agents
│   └── ScrollReveal.jsx      # Scroll-triggered entrance animation
├── pages/
│   ├── public/               # Overture — landing, onboarding, directory, profile, Open Score
│   ├── client/               # Client portal — settings
│   ├── provider/             # Conductor portal — dashboard, instruments, reviews, tuning
│   └── admin/                # Maestro portal — dashboard, directory, sponsored, moderation
├── data/
│   ├── constants.js          # AI_AGENTS, DISCORD_PAIN_POINTS, PRICING_TIERS, BRAND
│   ├── mockConductors.js     # 8 mock Conductor profiles
│   ├── mockReviews.js        # 12 mock Resonance reviews
│   ├── mockMetrics.js        # platformMetrics + conductorMetrics
│   └── mockContributors.js   # 6 mock Open Score contributors
├── lib/
│   ├── supabaseClient.js     # Supabase connection + row mappers (mock fallback when unconfigured)
│   ├── api.js                # Data layer — Supabase when configured, mocks otherwise
│   └── auth.jsx              # useAuth() context — Google OAuth via Supabase, mock fallback
└── three/
    └── HeroScene.jsx         # 3D pulsing node-network hero background
```

## Backend Integration

The app auto-detects a backend: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`) and every data call goes to **Supabase**; leave them unset and it runs entirely on bundled mock data — no page components change either way.

- **`src/lib/supabaseClient.js`** — creates the client and exposes `isSupabaseConfigured` plus row→model mappers.
- **`src/lib/api.js`** — `fetchConductors`, `fetchConductorById`, `fetchReviews`, `submitBooking`, `submitProviderResponse`, `moderateReview`, `updateProviderStatus`, and `assignSponsoredPlacement` run real Supabase queries against the tables in **`supabase/schema.sql`**. `createCheckoutSession` remains a stub — wire it to a **Stripe** Checkout endpoint (e.g., a Supabase Edge Function).
- **`src/lib/auth.jsx`** — `useAuth()` with the same exposed shape (`{ user, signInWithGoogle, signOut, favorites, toggleFavorite, bookings, addBooking }`). When Supabase is configured, `signInWithGoogle` uses real **Google OAuth** via Supabase Auth (enable the Google provider in the Supabase dashboard and allow-list this app's URL); otherwise it uses the local mock user.

To provision the database: create a Supabase project, run `supabase/schema.sql` in the SQL editor, then enable RLS policies per portal before production use.

## Intellectual Property Note

The following are **proprietary to Think Tank Solutions AI** and intentionally centralized in a single source of truth — **`src/data/constants.js`**:

- The **Brand Symphony Arrangement Method** (the proprietary client-to-solution framework)
- The **5 AI Agents** (`lead-capture`, `scheduling`, `follow-up`, `support-triage`, `reputation`)
- The **Discord → Symphony mapping** (pain points to their resolving agents)

Do not copy, rename, or redistribute these definitions elsewhere in the codebase; import them from `src/data/constants.js` so the proprietary canon stays consistent across all portals.
