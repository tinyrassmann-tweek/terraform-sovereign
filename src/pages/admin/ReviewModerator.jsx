import { useEffect, useState } from 'react';
import GlassCard from '../../components/GlassCard';
import ScrollReveal from '../../components/ScrollReveal';
import StarRating from '../../components/StarRating';
import NeonButton from '../../components/NeonButton';
import { fetchReviews, fetchConductors, moderateReview } from '../../lib/api';

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'flagged', label: 'Flagged' },
  { id: 'approved', label: 'Approved' },
];

const STATUS_STYLES = {
  pending: 'border-gold/40 bg-gold/10 text-gold',
  flagged: 'border-red-500/40 bg-red-500/10 text-red-400',
  approved: 'border-neon/40 bg-neon/10 text-neon',
};

const FLAG_REASONS = [
  'Client dispute under investigation',
  'Suspected incentivized review',
  'Language violates community score',
];

function flagReason(review) {
  // Deterministic mock reason per review so the UI feels real without extra data.
  let hash = 0;
  for (const ch of review.id) hash = (hash + ch.charCodeAt(0)) % 97;
  return FLAG_REASONS[hash % FLAG_REASONS.length];
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function CardSkeleton() {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-32 animate-pulse rounded bg-white/5" />
        </div>
      </div>
      <div className="mt-4 h-12 animate-pulse rounded bg-white/5" />
    </GlassCard>
  );
}

export default function ReviewModerator() {
  const [reviews, setReviews] = useState(null);
  const [conductorNames, setConductorNames] = useState({});
  const [tab, setTab] = useState('pending');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchReviews(), fetchConductors()]).then(([revList, condList]) => {
      if (cancelled) return;
      setReviews(revList);
      setConductorNames(Object.fromEntries(condList.map((c) => [c.id, c.name])));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAction = async (review, action) => {
    setBusyId(review.id);
    await moderateReview(review.id, action);
    if (action === 'remove') {
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } else {
      const nextStatus = action === 'approve' ? 'approved' : 'flagged';
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, status: nextStatus } : r))
      );
    }
    setBusyId(null);
  };

  const queue = reviews === null ? [] : reviews.filter((r) => r.status === tab);
  const countFor = (status) =>
    reviews === null ? 0 : reviews.filter((r) => r.status === status).length;

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24">
      <ScrollReveal>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neon neon-text">
          The Maestro · Resonance
        </p>
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Resonance <span className="text-gradient">Moderation</span>
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Every review is a note in the platform's reputation. Approve the true ones, silence the
          discord.
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
              {reviews !== null && <span className="ml-2 text-xs opacity-70">{countFor(t.id)}</span>}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="mt-8 space-y-5">
        {reviews === null ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : queue.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="font-display text-xl text-white">
              {tab === 'pending' ? 'The queue is silent.' : `No ${tab} resonance.`}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {tab === 'pending'
                ? 'Every review has been heard. Enjoy the hush, Maestro.'
                : 'Nothing holds this status right now.'}
            </p>
          </GlassCard>
        ) : (
          queue.map((r, i) => (
            <ScrollReveal key={r.id} delay={Math.min(i * 0.06, 0.3)}>
              <GlassCard
                hover
                className={`p-6 ${r.status === 'flagged' ? 'border-red-500/30' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pulse/20 font-display text-sm font-bold text-pulse">
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{r.author}</p>
                      <p className="text-xs text-slate-500">
                        on{' '}
                        <span className="text-slate-300">
                          {conductorNames[r.conductorId] || r.conductorId}
                        </span>{' '}
                        · {formatDate(r.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StarRating value={r.rating} size={13} />
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-300">“{r.text}”</p>

                {r.status === 'flagged' && (
                  <div className="mt-4 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
                      ⚠ Flag reason
                    </p>
                    <p className="mt-1 text-sm text-red-200/80">{flagReason(r)}</p>
                  </div>
                )}

                {r.response && (
                  <div className="mt-4 rounded-lg border border-white/5 bg-white/5 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      Conductor response
                    </p>
                    <p className="mt-1 text-sm text-slate-400">“{r.response}”</p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/5 pt-5">
                  {r.status !== 'approved' && (
                    <button
                      disabled={busyId === r.id}
                      onClick={() => handleAction(r, 'approve')}
                      className="rounded-lg border border-neon/40 bg-neon/10 px-4 py-2 text-xs font-semibold text-neon transition-colors hover:bg-neon/20 disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  {r.status !== 'flagged' && (
                    <button
                      disabled={busyId === r.id}
                      onClick={() => handleAction(r, 'flag')}
                      className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold transition-colors hover:bg-gold/20 disabled:opacity-50"
                    >
                      Flag
                    </button>
                  )}
                  <button
                    disabled={busyId === r.id}
                    onClick={() => handleAction(r, 'remove')}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))
        )}
      </div>

      <ScrollReveal delay={0.15}>
        <div className="mt-12">
          <NeonButton to="/admin" variant="ghost">
            Back to Command Deck
          </NeonButton>
        </div>
      </ScrollReveal>
    </div>
  );
}
