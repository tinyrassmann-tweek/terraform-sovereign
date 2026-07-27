import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import ScrollReveal from '../../components/ScrollReveal';
import StarRating from '../../components/StarRating';
import NeonButton from '../../components/NeonButton';
import { fetchConductors, fetchReviews } from '../../lib/api';
import { platformMetrics, conductorMetrics } from '../../data/mockMetrics';

const currency = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const statCards = [
  {
    label: 'Platform MRR',
    value: currency(platformMetrics.mrr),
    hint: 'Recurring revenue across all sections',
    accent: 'text-neon',
  },
  {
    label: 'Active Conductors',
    value: platformMetrics.activeConductors.toLocaleString(),
    hint: 'Approved providers on stage',
    accent: 'text-pulse',
  },
  {
    label: 'Active Clients',
    value: platformMetrics.activeClients.toLocaleString(),
    hint: 'Brands in the audience',
    accent: 'text-gold',
  },
  {
    label: 'Bookings This Month',
    value: platformMetrics.bookingsThisMonth.toLocaleString(),
    hint: 'Sessions conducted in July',
    accent: 'text-neon',
  },
];

function StatSkeleton() {
  return (
    <GlassCard className="p-6">
      <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
      <div className="mt-4 h-8 w-32 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-3 w-40 animate-pulse rounded bg-white/5" />
    </GlassCard>
  );
}

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [pendingConductors, setPendingConductors] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [flaggedReviews, setFlaggedReviews] = useState([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchConductors({ status: 'pending' }), fetchReviews()]).then(
      ([conductors, reviews]) => {
        if (cancelled) return;
        setPendingConductors(conductors);
        setPendingReviews(reviews.filter((r) => r.status === 'pending'));
        setFlaggedReviews(reviews.filter((r) => r.status === 'flagged'));
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const maxBookings = Math.max(...conductorMetrics.monthly.map((m) => m.bookings));

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      <ScrollReveal>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neon neon-text">
          The Maestro · Command Deck
        </p>
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Platform <span className="text-gradient">Overview</span>
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Every section of the orchestra at a glance — revenue, roster, and the resonance that
          needs your baton.
        </p>
      </ScrollReveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {loading
          ? statCards.map((_, i) => <StatSkeleton key={i} />)
          : statCards.map((card, i) => (
              <ScrollReveal key={card.label} delay={i * 0.08}>
                <GlassCard hover className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    {card.label}
                  </p>
                  <p className={`mt-3 font-display text-3xl font-bold ${card.accent}`}>
                    {card.value}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">{card.hint}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
        <ScrollReveal delay={0.32}>
          <GlassCard hover className="p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Avg Harmony Score
            </p>
            <div className="mt-3 flex items-center gap-3">
              <p className="font-display text-3xl font-bold text-gold">
                {platformMetrics.avgHarmonyScore.toFixed(1)}
              </p>
              <StarRating value={platformMetrics.avgHarmonyScore} />
            </div>
            <p className="mt-2 text-xs text-slate-500">Across every approved Conductor</p>
          </GlassCard>
        </ScrollReveal>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ScrollReveal>
          <GlassCard className="h-full p-6 sm:p-8">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-bold text-white">
                Bookings Crescendo
              </h2>
              <span className="text-xs uppercase tracking-widest text-slate-500">
                Jan – Jul 2026
              </span>
            </div>
            <div className="mt-8 flex h-56 items-end gap-3 sm:gap-4">
              {conductorMetrics.monthly.map((m) => (
                <div key={m.month} className="group flex h-full flex-1 flex-col justify-end">
                  <p className="mb-2 text-center text-xs font-semibold text-neon opacity-0 transition-opacity group-hover:opacity-100">
                    {m.bookings}
                  </p>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-pulse/40 to-neon/70 transition-all duration-300 group-hover:from-pulse/70 group-hover:to-neon"
                    style={{ height: `${(m.bookings / maxBookings) * 100}%` }}
                  />
                  <p className="mt-3 text-center text-xs uppercase tracking-wider text-slate-500">
                    {m.month}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </ScrollReveal>
        </div>

        <div className="lg:col-span-2">
          <ScrollReveal delay={0.1}>
          <GlassCard className="h-full border-gold/20 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-white">Needs Attention</h2>
            <p className="mt-1 text-xs text-slate-500">
              Discord on the stage — resolve these to keep the performance clean.
            </p>

            {loading ? (
              <div className="mt-6 space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Pending Conductors</p>
                    <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-bold text-gold">
                      {pendingConductors.length}
                    </span>
                  </div>
                  {pendingConductors.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-500">No applications waiting.</p>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {pendingConductors.map((c) => (
                        <li key={c.id} className="text-xs text-slate-400">
                          {c.name} — {c.location}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    to="/admin/directory"
                    className="mt-3 inline-block text-xs font-semibold text-neon hover:underline"
                  >
                    Review directory →
                  </Link>
                </div>

                <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Pending Reviews</p>
                    <span className="rounded-full bg-neon/15 px-2.5 py-0.5 text-xs font-bold text-neon">
                      {pendingReviews.length}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Resonance awaiting your approval before it goes live.
                  </p>
                  <Link
                    to="/admin/moderation"
                    className="mt-3 inline-block text-xs font-semibold text-neon hover:underline"
                  >
                    Open moderation queue →
                  </Link>
                </div>

                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Flagged Reviews</p>
                    <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-bold text-red-400">
                      {flaggedReviews.length}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Disputed resonance requiring the Maestro's judgment.
                  </p>
                  <Link
                    to="/admin/moderation"
                    className="mt-3 inline-block text-xs font-semibold text-red-400 hover:underline"
                  >
                    Judge flagged resonance →
                  </Link>
                </div>
              </div>
            )}
          </GlassCard>
          </ScrollReveal>
        </div>
      </div>

      <ScrollReveal delay={0.15}>
        <div className="mt-12 flex flex-wrap gap-4">
          <NeonButton to="/admin/directory" variant="primary">
            Manage Directory
          </NeonButton>
          <NeonButton to="/admin/sponsored" variant="gold">
            Sponsored Placements
          </NeonButton>
          <NeonButton to="/admin/moderation" variant="ghost">
            Resonance Moderation
          </NeonButton>
        </div>
      </ScrollReveal>
    </div>
  );
}
