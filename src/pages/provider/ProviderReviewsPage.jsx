import { useEffect, useMemo, useState } from 'react';
import GlassCard from '../../components/GlassCard.jsx';
import NeonButton from '../../components/NeonButton.jsx';
import ScrollReveal from '../../components/ScrollReveal.jsx';
import StarRating from '../../components/StarRating.jsx';
import { fetchReviews, submitProviderResponse } from '../../lib/api.js';
import { mockConductors } from '../../data/mockConductors.js';

const conductor = mockConductors[0];

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'answered', label: 'Answered' },
  { id: 'unanswered', label: 'Unanswered' },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

function ReviewSkeleton() {
  return (
    <GlassCard className="animate-pulse p-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10" />
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="h-3 w-20 rounded bg-white/10" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-3/4 rounded bg-white/10" />
      </div>
    </GlassCard>
  );
}

function ReviewCard({ review, onResponded }) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setError(null);
    try {
      const result = await submitProviderResponse(review.id, text);
      onResponded(review.id, result.response);
      setDraft('');
      setComposerOpen(false);
    } catch {
      setError('The response missed a beat — try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <GlassCard hover className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pulse to-neon font-display text-sm font-bold text-void">
            {review.author.split(' ').map((w) => w[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{review.author}</p>
            <p className="text-xs text-slate-500">{formatDate(review.date)}</p>
          </div>
        </div>
        <StarRating value={review.rating} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-300">“{review.text}”</p>

      {review.response ? (
        <div className="mt-4 rounded-xl border border-neon/20 bg-neon/5 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neon">
            🎼 Your Reprise
          </p>
          <p className="text-sm leading-relaxed text-slate-300">{review.response}</p>
        </div>
      ) : composerOpen ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-void/40 p-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            autoFocus
            placeholder="Answer your audience with grace — thank them, acknowledge the note, close in harmony…"
            className="w-full resize-none rounded-lg border border-white/10 bg-void/60 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-neon/60"
          />
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          <div className="mt-3 flex gap-2">
            <NeonButton
              variant="primary"
              className={!draft.trim() || sending ? 'opacity-50' : ''}
              onClick={handleSend}
            >
              {sending ? 'Sending…' : 'Send Response'}
            </NeonButton>
            <NeonButton variant="ghost" onClick={() => setComposerOpen(false)}>
              Cancel
            </NeonButton>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setComposerOpen(true)}
          className="mt-4 rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-neon/60 hover:text-neon"
        >
          ✍️ Respond
        </button>
      )}
    </GlassCard>
  );
}

export default function ProviderReviewsPage() {
  const [reviews, setReviews] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    let cancelled = false;
    fetchReviews(conductor.id)
      .then((data) => {
        if (!cancelled) setReviews(data.filter((r) => r.status === 'approved'));
      })
      .catch(() => {
        if (!cancelled) setLoadError('The Resonance Chamber could not be reached.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleResponded = (reviewId, response) =>
    setReviews((list) => list.map((r) => (r.id === reviewId ? { ...r, response } : r)));

  const filtered = useMemo(() => {
    if (!reviews) return [];
    if (tab === 'answered') return reviews.filter((r) => r.response);
    if (tab === 'unanswered') return reviews.filter((r) => !r.response);
    return reviews;
  }, [reviews, tab]);

  const counts = useMemo(() => {
    if (!reviews) return { all: 0, answered: 0, unanswered: 0 };
    const answered = reviews.filter((r) => r.response).length;
    return { all: reviews.length, answered, unanswered: reviews.length - answered };
  }, [reviews]);

  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
      <ScrollReveal>
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon neon-text">
            The First Chair
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            Resonance <span className="text-gradient">Chamber</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            Your audience is speaking. Answer every note — a Conductor who responds turns applause
            into encore bookings.
          </p>
          {reviews && reviews.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2">
              <StarRating value={avgRating} size={14} />
              <span className="text-sm font-semibold text-gold">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-slate-500">across {reviews.length} reviews</span>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Filter tabs */}
      <ScrollReveal delay={0.05}>
        <div className="mb-8 flex justify-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                tab === t.id
                  ? 'btn-glow bg-gradient-to-r from-neon to-pulse text-void'
                  : 'border border-white/15 text-slate-300 hover:border-neon/50 hover:text-neon'
              }`}
            >
              {t.label}
              <span className={`ml-2 text-xs ${tab === t.id ? 'text-void/70' : 'text-slate-500'}`}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Loading / error / list */}
      {loadError ? (
        <GlassCard className="p-10 text-center">
          <p className="text-sm text-red-400">{loadError}</p>
        </GlassCard>
      ) : reviews === null ? (
        <div className="space-y-4">
          <ReviewSkeleton />
          <ReviewSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <ScrollReveal>
          <GlassCard className="flex flex-col items-center gap-3 p-12 text-center">
            <span aria-hidden="true" className="text-5xl">🎧</span>
            <h2 className="font-display text-xl font-bold text-white">
              {tab === 'unanswered' ? 'All caught up — every note answered' : 'Silence in the chamber'}
            </h2>
            <p className="max-w-md text-sm text-slate-400">
              {tab === 'unanswered'
                ? 'No unanswered reviews. Your audience knows you are listening.'
                : 'No reviews in this section yet. Keep delivering harmony and the resonance will come.'}
            </p>
          </GlassCard>
        </ScrollReveal>
      ) : (
        <div className="space-y-4">
          {filtered.map((review, i) => (
            <ScrollReveal key={review.id} delay={Math.min(i * 0.06, 0.3)}>
              <ReviewCard review={review} onResponded={handleResponded} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
