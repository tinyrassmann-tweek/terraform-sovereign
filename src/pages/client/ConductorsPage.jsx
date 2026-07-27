import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard.jsx';
import StarRating from '../../components/StarRating.jsx';
import SectionHeading from '../../components/SectionHeading.jsx';
import AgentBadge from '../../components/AgentBadge.jsx';
import ScrollReveal from '../../components/ScrollReveal.jsx';
import { AI_AGENTS } from '../../data/constants.js';
import { fetchConductors } from '../../lib/api.js';
import { useAuth } from '../../lib/auth.jsx';

function SkeletonCard() {
  return (
    <GlassCard className="h-64 animate-pulse p-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-white/10" />
          <div className="h-3 w-1/3 rounded bg-white/10" />
        </div>
      </div>
      <div className="mt-5 h-3 w-full rounded bg-white/10" />
      <div className="mt-2 h-3 w-4/5 rounded bg-white/10" />
      <div className="mt-5 flex gap-2">
        <div className="h-6 w-24 rounded-full bg-white/10" />
        <div className="h-6 w-24 rounded-full bg-white/10" />
      </div>
    </GlassCard>
  );
}

export default function ConductorsPage() {
  const { user, favorites, toggleFavorite } = useAuth();
  const [conductors, setConductors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeAgent, setActiveAgent] = useState(null);
  const [certifiedOnly, setCertifiedOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchConductors({
      status: 'approved',
      ...(activeAgent ? { specialty: activeAgent } : {}),
      ...(certifiedOnly ? { certified: true } : {}),
    }).then((results) => {
      if (cancelled) return;
      // First Chair (sponsored) conductors surface first.
      const sorted = [...results].sort(
        (a, b) => Number(b.sponsored) - Number(a.sponsored)
      );
      setConductors(sorted);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [activeAgent, certifiedOnly]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conductors;
    return conductors.filter((c) =>
      [c.name, c.tagline, c.location].join(' ').toLowerCase().includes(q)
    );
  }, [conductors, search]);

  return (
    <div className="bg-void">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16">
        <ScrollReveal>
          <SectionHeading kicker="The Ensemble" title="Meet the Conductors">
            <p>
              Every Conductor is vetted through the{' '}
              <span className="text-white">Brand Symphony Arrangement Method</span>.
              First Chairs lead from the front.
            </p>
          </SectionHeading>
        </ScrollReveal>

        {/* Search + filters */}
        <ScrollReveal delay={0.1}>
          <GlassCard className="mx-auto mb-10 max-w-4xl p-5">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                >
                  🔍
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, tagline, or city…"
                  className="w-full rounded-xl border border-white/10 bg-void/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-neon/60"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAgent(null)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                    activeAgent === null
                      ? 'border-neon bg-neon/15 text-neon'
                      : 'border-white/15 text-slate-400 hover:border-neon/40 hover:text-neon'
                  }`}
                >
                  All Sections
                </button>
                {AI_AGENTS.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() =>
                      setActiveAgent(activeAgent === agent.id ? null : agent.id)
                    }
                    className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                      activeAgent === agent.id
                        ? 'border-neon bg-neon/15 text-neon'
                        : 'border-white/15 text-slate-400 hover:border-neon/40 hover:text-neon'
                    }`}
                  >
                    {agent.icon} {agent.name}
                  </button>
                ))}
                <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-slate-400">
                  <span>Certified Only</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={certifiedOnly}
                    onClick={() => setCertifiedOnly((v) => !v)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      certifiedOnly ? 'bg-pulse' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        certifiedOnly ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>

        {/* Results */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <GlassCard className="mx-auto max-w-xl p-12 text-center">
            <p className="text-4xl" aria-hidden="true">🎻</p>
            <h3 className="mt-4 font-display text-xl text-white">
              The stage is quiet
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              No Conductors match that arrangement. Loosen a filter or clear
              your search to hear the full ensemble.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveAgent(null);
                setCertifiedOnly(false);
              }}
              className="mt-6 text-sm font-medium text-neon hover:underline"
            >
              Reset all filters
            </button>
          </GlassCard>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((c, i) => {
              const isFav = favorites.includes(c.id);
              return (
                <ScrollReveal key={c.id} delay={(i % 3) * 0.08}>
                  <GlassCard hover className="relative h-full overflow-hidden p-6">
                    {c.sponsored && (
                      <div
                        className="absolute right-[-34px] top-5 rotate-45 bg-gradient-to-r from-gold to-amber-500 px-10 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-void"
                        aria-label="First Chair — sponsored placement"
                      >
                        First Chair
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(c.id)}
                      aria-label={
                        isFav
                          ? `Remove ${c.name} from favorites`
                          : `Add ${c.name} to favorites`
                      }
                      title={user ? undefined : 'Sign in to keep favorites across devices'}
                      className={`absolute left-4 top-4 z-10 text-xl transition-transform hover:scale-125 ${
                        isFav ? 'text-pulse' : 'text-white/25 hover:text-pulse/70'
                      }`}
                    >
                      {isFav ? '♥' : '♡'}
                    </button>
                    <Link to={`/conductors/${c.id}`} className="group block">
                      <div className="flex items-center gap-4 pl-8">
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-bold text-void"
                          style={{
                            background: `linear-gradient(135deg, ${c.accent}, #a78bfa)`,
                          }}
                          aria-hidden="true"
                        >
                          {c.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-display text-lg font-semibold text-white group-hover:text-neon">
                            {c.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            📍 {c.location}
                            {c.certified && (
                              <span className="ml-2 text-neon" title="Certified Brand Symphony Conductor">
                                ✓ Certified
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 line-clamp-2 text-sm italic text-slate-400">
                        “{c.tagline}”
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <StarRating value={c.harmonyScore} size={14} />
                        <span className="font-semibold text-gold">
                          {c.harmonyScore.toFixed(1)}
                        </span>
                        <span className="text-slate-500">
                          · {c.resonanceCount} Resonance
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {c.specialties.map((s) => (
                          <AgentBadge key={s} agentId={s} />
                        ))}
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          From <span className="text-neon">${c.priceFrom}</span>
                        </p>
                        <span className="text-xs font-medium text-pulse group-hover:text-neon">
                          View score →
                        </span>
                      </div>
                    </Link>
                  </GlassCard>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
