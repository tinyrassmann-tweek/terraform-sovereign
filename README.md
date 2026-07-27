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
│   ├── api.js                # Async API stubs (~250ms delay) — swap for real backend
│   └── auth.jsx              # useAuth() context — mock Google sign-in
└── three/
    └── HeroScene.jsx         # 3D pulsing node-network hero background
```

## Backend Integration

The app runs entirely on client-side mocks today. All integration points are isolated stubs, clearly marked with `TODO` comments:

- **`src/lib/api.js`** — async stubs (`fetchConductors`, `fetchConductorById`, `fetchReviews`, `submitBooking`, `createCheckoutSession`, `submitProviderResponse`, `moderateReview`, `updateProviderStatus`, `assignSponsoredPlacement`) with a simulated ~250ms latency. Replace these with **Supabase** (data + queries) and **Stripe** (checkout sessions, subscription tiers, sponsored placements) calls.
- **`src/lib/auth.jsx`** — `useAuth()` context with a mock `signInWithGoogle`. Replace with **Google OAuth** (e.g., Supabase Auth) while preserving the exposed shape: `{ user, signInWithGoogle, signOut, favorites, toggleFavorite, bookings, addBooking }`.

Because every page consumes only these stubs, swapping in real services should not require touching page components.

## Intellectual Property Note

The following are **proprietary to Think Tank Solutions AI** and intentionally centralized in a single source of truth — **`src/data/constants.js`**:

- The **Brand Symphony Arrangement Method** (the proprietary client-to-solution framework)
- The **5 AI Agents** (`lead-capture`, `scheduling`, `follow-up`, `support-triage`, `reputation`)
- The **Discord → Symphony mapping** (pain points to their resolving agents)

Do not copy, rename, or redistribute these definitions elsewhere in the codebase; import them from `src/data/constants.js` so the proprietary canon stays consistent across all portals.
