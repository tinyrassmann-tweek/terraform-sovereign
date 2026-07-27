import { Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard.jsx';
import NeonButton from '../../components/NeonButton.jsx';
import ScrollReveal from '../../components/ScrollReveal.jsx';
import AgentBadge from '../../components/AgentBadge.jsx';
import { mockConductors } from '../../data/mockConductors.js';
import { conductorMetrics } from '../../data/mockMetrics.js';

// The signed-in provider of this mock session.
const conductor = mockConductors[0];

const currency = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const STATS = [
  {
    label: 'Profile Views',
    value: conductorMetrics.profileViews.toLocaleString(),
    hint: '+8.2% vs last month',
    icon: '👁️',
    accent: 'text-neon',
  },
  {
    label: 'Booking Conversions',
    value: `${Math.round(conductorMetrics.bookingConversions * 100)}%`,
    hint: 'View → booking',
    icon: '🎟️',
    accent: 'text-pulse',
  },
  {
    label: 'Revenue Recovered for Clients',
    value: currency(conductorMetrics.revenueRecovered),
    hint: 'Pipeline saved from Discord',
    icon: '💰',
    accent: 'text-gold',
  },
  {
    label: 'Response Rate',
    value: `${Math.round(conductorMetrics.responseRate * 100)}%`,
    hint: 'Within 24 hours',
    icon: '⚡',
    accent: 'text-neon',
  },
];

const QUICK_LINKS = [
  {
    to: '/provider/instruments',
    title: 'My Instruments',
    description: 'Compose, tune, and retire the services you conduct.',
    icon: '🎻',
  },
  {
    to: '/provider/reviews',
    title: 'Resonance Chamber',
    description: 'Answer your audience. Every review deserves a reprise.',
    icon: '🎵',
  },
  {
    to: '/provider/tuning',
    title: 'Tuning',
    description: 'Sync your socials and raise your Google SEO score.',
    icon: '🎚️',
  },
];

function MonthlyChart() {
  const maxViews = Math.max(...conductorMetrics.monthly.map((m) => m.views));
  const maxBookings = Math.max(...conductorMetrics.monthly.map((m) => m.bookings));

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-white">Monthly Performance</h3>
          <p className="mt-1 text-sm text-slate-400">Profile views and bookings, month over month.</p>
        </div>
        <div className="flex items-center gap-5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-neon" /> Views
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" /> Bookings
          </span>
        </div>
      </div>

      <div className="flex h-56 items-end gap-3 sm:gap-4">
        {conductorMetrics.monthly.map((m) => (
          <div key={m.month} className="group flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-44 w-full items-end justify-center gap-1.5">
              {/* Views bar */}
              <div
                className="w-1/3 rounded-t-md bg-gradient-to-t from-neon/30 to-neon transition-all duration-300 group-hover:from-neon/50 group-hover:to-neon"
                style={{ height: `${(m.views / maxViews) * 100}%` }}
                title={`${m.views.toLocaleString()} views`}
              />
              {/* Bookings bar */}
              <div
                className="w-1/3 rounded-t-md bg-gradient-to-t from-gold/30 to-gold transition-all duration-300 group-hover:from-gold/50 group-hover:to-gold"
                style={{ height: `${(m.bookings / maxBookings) * 100}%` }}
                title={`${m.bookings} bookings`}
              />
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-white/10 bg-obsidian px-3 py-1.5 text-xs text-slate-200 opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
                {m.views.toLocaleString()} views · {m.bookings} bookings
              </div>
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {m.month}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default function ProviderDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      {/* Greeting */}
      <ScrollReveal>
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl font-display text-2xl font-bold text-void"
              style={{ background: `linear-gradient(135deg, ${conductor.accent}, #a78bfa)` }}
            >
              {conductor.name.split(' ').map((w) => w[0]).join('')}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon neon-text">
                Conductor's Podium
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
                Welcome back, {conductor.name.split(' ')[0]}
                {conductor.certified && (
                  <span
                    className="ml-3 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 align-middle text-xs font-semibold text-gold"
                    title="Certified Brand Symphony Conductor"
                  >
                    🏅 Certified
                  </span>
                )}
              </h1>
              <p className="mt-1 text-sm text-slate-400">{conductor.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {conductor.specialties.map((id) => (
              <AgentBadge key={id} agentId={id} />
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Stat cards */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 0.08}>
            <GlassCard hover className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
                <span aria-hidden="true" className="text-xl">{stat.icon}</span>
              </div>
              <p className={`mt-3 font-display text-3xl font-bold ${stat.accent}`}>{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

      {/* Chart */}
      <ScrollReveal delay={0.1}>
        <MonthlyChart />
      </ScrollReveal>

      {/* Quick links */}
      <ScrollReveal delay={0.15}>
        <h2 className="mb-6 mt-12 font-display text-2xl font-bold text-white">
          Back to the <span className="text-gradient">Score</span>
        </h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {QUICK_LINKS.map((link, i) => (
          <ScrollReveal key={link.to} delay={0.1 + i * 0.08}>
            <Link to={link.to} className="block h-full">
              <GlassCard hover className="flex h-full flex-col p-6">
                <span aria-hidden="true" className="text-3xl">{link.icon}</span>
                <h3 className="mt-4 font-display text-lg font-bold text-white">{link.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-400">{link.description}</p>
                <span className="mt-4 text-sm font-semibold text-neon">Open →</span>
              </GlassCard>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.2}>
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-neon/5 via-pulse/5 to-gold/5 p-8 text-center">
          <p className="text-sm text-slate-300">
            The market is loud. Your podium keeps it in <span className="neon-text text-neon">harmony</span>.
          </p>
          <NeonButton to="/provider/instruments" variant="primary">
            Tune Your Instruments
          </NeonButton>
        </div>
      </ScrollReveal>
    </div>
  );
}
