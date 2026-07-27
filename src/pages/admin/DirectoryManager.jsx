import { useEffect, useState } from 'react';
import GlassCard from '../../components/GlassCard';
import ScrollReveal from '../../components/ScrollReveal';
import AgentBadge from '../../components/AgentBadge';
import StarRating from '../../components/StarRating';
import { fetchConductors, updateProviderStatus } from '../../lib/api';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'approved', label: 'Approved' },
  { id: 'pending', label: 'Pending' },
  { id: 'suspended', label: 'Suspended' },
];

const STATUS_STYLES = {
  approved: 'border-neon/40 bg-neon/10 text-neon',
  pending: 'border-gold/40 bg-gold/10 text-gold',
  suspended: 'border-red-500/40 bg-red-500/10 text-red-400',
};

function StatusPill({ status }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function RowSkeleton() {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-64 animate-pulse rounded bg-white/5" />
        </div>
        <div className="h-8 w-24 animate-pulse rounded bg-white/5" />
      </div>
    </GlassCard>
  );
}

export default function DirectoryManager() {
  const [conductors, setConductors] = useState(null);
  const [tab, setTab] = useState('all');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchConductors().then((list) => {
      if (!cancelled) setConductors(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAction = async (id, status) => {
    setBusyId(id);
    await updateProviderStatus(id, status);
    setConductors((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    setBusyId(null);
  };

  const filtered =
    conductors === null ? [] : tab === 'all' ? conductors : conductors.filter((c) => c.status === tab);

  const counts = (status) =>
    conductors === null ? 0 : conductors.filter((c) => c.status === status).length;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      <ScrollReveal>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neon neon-text">
          The Maestro · Roster
        </p>
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Directory <span className="text-gradient">Manager</span>
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Approve new talent, bench the off-key, and keep the ensemble in tune.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="mt-10 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'border-neon/60 bg-neon/10 text-neon'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-white'
              }`}
            >
              {t.label}
              {t.id !== 'all' && conductors !== null && (
                <span className="ml-2 text-xs opacity-70">{counts(t.id)}</span>
              )}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="mt-8 space-y-4">
        {conductors === null ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : filtered.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="font-display text-xl text-white">An empty stage.</p>
            <p className="mt-2 text-sm text-slate-500">
              No Conductors currently hold the "{tab}" status.
            </p>
          </GlassCard>
        ) : (
          filtered.map((c, i) => (
            <ScrollReveal key={c.id} delay={Math.min(i * 0.05, 0.3)}>
              <GlassCard hover className="p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold text-void"
                      style={{ backgroundColor: c.accent }}
                    >
                      {c.name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-lg font-bold text-white">{c.name}</p>
                        {c.certified && (
                          <span className="rounded-full bg-pulse/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pulse">
                            Certified
                          </span>
                        )}
                        {c.sponsored && (
                          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                            First Chair
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-slate-400">{c.tagline}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {c.specialties.map((id) => (
                          <AgentBadge key={id} agentId={id} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-6 lg:gap-8">
                    <div className="text-center">
                      <div className="flex items-center gap-1.5">
                        <StarRating value={c.harmonyScore} size={12} />
                        <span className="text-sm font-bold text-gold">
                          {c.harmonyScore.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                        {c.resonanceCount} resonance
                      </p>
                    </div>
                    <StatusPill status={c.status} />
                    <div className="flex gap-2">
                      {c.status !== 'approved' && (
                        <button
                          disabled={busyId === c.id}
                          onClick={() => handleAction(c.id, 'approved')}
                          className="rounded-lg border border-neon/40 bg-neon/10 px-3 py-1.5 text-xs font-semibold text-neon transition-colors hover:bg-neon/20 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {c.status !== 'suspended' && (
                        <button
                          disabled={busyId === c.id}
                          onClick={() => handleAction(c.id, 'suspended')}
                          className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold/20 disabled:opacity-50"
                        >
                          Suspend
                        </button>
                      )}
                      {c.status === 'pending' && (
                        <button
                          disabled={busyId === c.id}
                          onClick={() => handleAction(c.id, 'suspended')}
                          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))
        )}
      </div>
    </div>
  );
}
