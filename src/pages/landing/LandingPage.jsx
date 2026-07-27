import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../components/GlassCard';
import NeonButton from '../../components/NeonButton';
import SectionHeading from '../../components/SectionHeading';
import AgentBadge from '../../components/AgentBadge';
import ScrollReveal from '../../components/ScrollReveal';
import { BRAND, DISCORD_PAIN_POINTS, PRICING_TIERS, AI_AGENTS } from '../../data/constants';
import { platformMetrics } from '../../data/mockMetrics';
import HeroScene from '../../three/HeroScene';

const PAIN_ICONS = {
  'manual-data-entry': '🗂️',
  'missed-leads': '📵',
  'slow-response': '🐌',
  'owner-burnout': '🔥',
};

function formatNumber(value) {
  return value.toLocaleString('en-US');
}

function formatCurrency(value) {
  return `$${value.toLocaleString('en-US')}`;
}

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <HeroScene className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-4xl"
      >
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.4em] text-neon neon-text">
          {BRAND.platform} presents The Overture
        </p>
        <h1 className="font-display text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
          <span className="text-gradient">{BRAND.tagline}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          The premier marketplace where vetted AI Conductors turn your business Discord into
          Harmony — powered by the {BRAND.method}.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <NeonButton to="/onboarding" variant="primary" className="px-8 py-3.5 text-base">
            Find Your Conductor
          </NeonButton>
          <NeonButton to="/provider" variant="gold" className="px-8 py-3.5 text-base">
            Become a First Chair Provider
          </NeonButton>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 z-10 text-slate-400"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="block text-2xl"
          aria-hidden="true"
        >
          ⌄
        </motion.span>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Stats strip                                                      */
/* ------------------------------------------------------------------ */
const STATS = [
  { key: 'mrr', label: 'Monthly Recurring Revenue', prefix: '$', value: platformMetrics.mrr },
  { key: 'conductors', label: 'Active Conductors', value: platformMetrics.activeConductors },
  { key: 'clients', label: 'Active Clients', value: platformMetrics.activeClients },
  { key: 'bookings', label: 'Bookings This Month', value: platformMetrics.bookingsThisMonth },
];

function CountUp({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{formatNumber(display)}</span>;
}

function StatsStrip() {
  return (
    <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-6">
      <ScrollReveal>
        <GlassCard className="grid grid-cols-2 gap-6 p-8 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.key} className="text-center">
              <p className="font-display text-3xl font-bold text-neon neon-text sm:text-4xl">
                {stat.prefix}
                <CountUp value={stat.value} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-slate-400">{stat.label}</p>
            </div>
          ))}
        </GlassCard>
      </ScrollReveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Discord → Harmony                                                */
/* ------------------------------------------------------------------ */
function OrchestrationDivider() {
  return (
    <ScrollReveal>
      <div className="mx-auto my-16 flex max-w-3xl flex-col items-center gap-4 px-6">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-pulse/50 bg-pulse/10 text-2xl text-pulse"
          aria-hidden="true"
        >
          ↓
        </motion.div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-pulse">Orchestration</p>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neon/60 to-transparent" />
      </div>
    </ScrollReveal>
  );
}

function DiscordToHarmony() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-28">
      <ScrollReveal>
        <SectionHeading kicker="The Discord" title="Every Business Plays Out of Tune">
          These are the dissonant notes we hear from owners every day. Left alone, they drown out
          your growth.
        </SectionHeading>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-2">
        {DISCORD_PAIN_POINTS.map((pain, i) => (
          <ScrollReveal key={pain.id} delay={i * 0.1}>
            <GlassCard hover className="h-full border-l-4 border-l-amber-500/70 p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {PAIN_ICONS[pain.id] || '⚠️'}
                </span>
                <h3 className="font-display text-xl font-semibold text-amber-300">{pain.name}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{pain.description}</p>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

      <OrchestrationDivider />

      <ScrollReveal>
        <SectionHeading kicker="The Harmony" title="The Ensemble Answers Every Note">
          Each pain point resolves into a dedicated AI Agent — conducted for you, tuned to your
          brand, running in perfect tempo.
        </SectionHeading>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-2">
        {DISCORD_PAIN_POINTS.map((pain, i) => {
          const agent = AI_AGENTS.find((a) => a.id === pain.agentId);
          return (
            <ScrollReveal key={pain.id} delay={i * 0.1}>
              <GlassCard hover className="h-full border-l-4 border-l-neon/70 p-6">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <AgentBadge agentId={pain.agentId} />
                  <span className="text-xs uppercase tracking-widest text-slate-500">
                    resolves {pain.name}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-neon neon-text">
                  {agent?.name}
                  {agent?.note && (
                    <span className="ml-2 text-sm font-normal text-pulse">({agent.note})</span>
                  )}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{agent?.blurb}</p>
              </GlassCard>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Pricing                                                          */
/* ------------------------------------------------------------------ */
function Pricing() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-28">
      <ScrollReveal>
        <SectionHeading kicker="The Arrangement" title="Choose Your Seat in the Orchestra">
          Free for the audience. A stage for every provider — and a Podium for the best.
        </SectionHeading>
      </ScrollReveal>

      <div className="grid items-stretch gap-6 lg:grid-cols-3">
        {PRICING_TIERS.map((tier, i) => {
          const isSponsored = Boolean(tier.sponsored);
          const isClientTier = tier.id === 'client-free';
          const ctaTo = isClientTier ? '/onboarding' : '/provider';
          return (
            <ScrollReveal key={tier.id} delay={i * 0.12}>
              <GlassCard
                hover
                className={`relative flex h-full flex-col p-8 ${
                  isSponsored
                    ? 'border border-gold/60 shadow-[0_0_40px_rgba(234,179,8,0.15)] lg:-mt-6 lg:mb-6'
                    : ''
                }`}
              >
                {isSponsored && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold to-amber-500 px-4 py-1 text-xs font-bold uppercase tracking-widest text-void">
                    Sponsored Podium
                  </span>
                )}
                <h3
                  className={`font-display text-2xl font-semibold ${
                    isSponsored ? 'text-gold' : 'text-white'
                  }`}
                >
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={`font-display text-5xl font-bold ${
                      isSponsored ? 'text-gold' : 'text-neon neon-text'
                    }`}
                  >
                    {tier.price === 0 ? 'Free' : formatCurrency(tier.price)}
                  </span>
                  {tier.price > 0 && <span className="text-sm text-slate-400">/ {tier.cadence}</span>}
                  {tier.price === 0 && <span className="text-sm text-slate-400">{tier.cadence}</span>}
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className={isSponsored ? 'text-gold' : 'text-neon'} aria-hidden="true">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <NeonButton
                  to={ctaTo}
                  variant={isSponsored ? 'gold' : isClientTier ? 'primary' : 'ghost'}
                  className="mt-8 w-full"
                >
                  {tier.cta}
                </NeonButton>
              </GlassCard>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Open-Core                                                        */
/* ------------------------------------------------------------------ */
function OpenCore() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-28">
      <ScrollReveal>
        <GlassCard className="relative overflow-hidden p-10 text-center sm:p-14">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-pulse/20 blur-3xl"
            aria-hidden="true"
          />
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-pulse">
            Open-Core · The Open Score
          </p>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ship Code. <span className="text-gradient">Waive Your Fees.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-slate-300">
            The platform's heart is open source. Developers who contribute merged pull requests to
            the open repo earn fee-free provider status — build the orchestra, and your seat costs
            nothing.
          </p>
          <div className="mt-8 flex justify-center">
            <NeonButton to="/opensource" variant="ghost" className="px-8 py-3">
              Enter the Open Score
            </NeonButton>
          </div>
        </GlassCard>
      </ScrollReveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Crescendo CTA band                                               */
/* ------------------------------------------------------------------ */
function CrescendoBand() {
  return (
    <section className="relative mt-28 overflow-hidden border-t border-white/10">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-neon/10 via-pulse/10 to-gold/10"
        aria-hidden="true"
      />
      <motion.div
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(120deg, transparent 0%, rgba(34,211,238,0.15) 30%, rgba(167,139,250,0.15) 60%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <ScrollReveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-neon neon-text">
            Crescendo
          </p>
          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Ready for Your <span className="text-gradient">Standing Ovation?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            The audience is waiting. Take the first downbeat — find a Conductor, or step onto the
            Podium yourself.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <NeonButton to="/onboarding" variant="primary" className="px-8 py-3.5 text-base">
              Find Your Conductor
            </NeonButton>
            <NeonButton to="/provider" variant="ghost" className="px-8 py-3.5 text-base">
              Join as a Provider
            </NeonButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-void font-body text-slate-200">
      <Hero />
      <StatsStrip />
      <DiscordToHarmony />
      <Pricing />
      <OpenCore />
      <CrescendoBand />
    </div>
  );
}
