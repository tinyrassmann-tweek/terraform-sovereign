import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GlassCard from '../../components/GlassCard.jsx';
import NeonButton from '../../components/NeonButton.jsx';
import StarRating from '../../components/StarRating.jsx';
import AgentBadge from '../../components/AgentBadge.jsx';
import ScrollReveal from '../../components/ScrollReveal.jsx';
import { fetchConductorById, fetchReviews, createCheckoutSession } from '../../lib/api.js';
import { useAuth } from '../../lib/auth.jsx';

const TIME_SLOTS = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

function nextSevenDays() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      iso: d.toISOString().slice(0, 10),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    });
  }
  return days;
}

export default function ConductorProfilePage() {
  const { id } = useParams();
  const { user, addBooking } = useAuth();

  const [conductor, setConductor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = useMemo(nextSevenDays, []);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState('idle'); // idle | processing | success

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchConductorById(id), fetchReviews(id)]).then(
      ([c, r]) => {
        if (cancelled) return;
        setConductor(c);
        setReviews(r.filter((rev) => rev.status === 'approved'));
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [id]);

  const openModal = () => {
    setCheckoutState('idle');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCheckoutState('idle');
  };

  const confirmBooking = async () => {
    if (!conductor || !selectedSlot) return;
    setCheckoutState('processing');
    const session = await createCheckoutSession(conductor.id, {
      date: selectedDay.iso,
      time: selectedSlot,
    });
    addBooking({
      conductorId: conductor.id,
      conductorName: conductor.name,
      date: selectedDay.iso,
      slot: selectedSlot,
      price: conductor.priceFrom,
      checkoutSessionId: session.id,
      status: 'confirmed',
    });
    setCheckoutState('success');
  };

  if (loading) {
    return (
      <div className="bg-void">
        <div className="mx-auto max-w-5xl animate-pulse px-6 pb-20 pt-16">
          <div className="glass p-8">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-3xl bg-white/10" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-1/3 rounded bg-white/10" />
                <div className="h-4 w-1/2 rounded bg-white/10" />
                <div className="h-4 w-1/4 rounded bg-white/10" />
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="glass h-56" />
            <div className="glass h-56" />
          </div>
        </div>
      </div>
    );
  }

  if (!conductor) {
    return (
      <div className="bg-void">
        <div className="mx-auto max-w-xl px-6 pb-20 pt-24 text-center">
          <GlassCard className="p-12">
            <p className="text-5xl" aria-hidden="true">🎭</p>
            <h1 className="mt-4 font-display text-2xl font-bold text-white">
              This Conductor has left the stage
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              The score you are looking for does not exist — or has been
              retired from the ensemble.
            </p>
            <NeonButton to="/conductors" className="mt-8">
              Back to the Ensemble
            </NeonButton>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-void">
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-16">
        {/* Header */}
        <ScrollReveal>
          <GlassCard className="relative overflow-hidden p-8">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-20"
              style={{
                background: `linear-gradient(120deg, ${conductor.accent}, transparent 60%)`,
              }}
              aria-hidden="true"
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl font-display text-3xl font-bold text-void"
                style={{
                  background: `linear-gradient(135deg, ${conductor.accent}, #a78bfa)`,
                }}
                aria-hidden="true"
              >
                {conductor.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
                    {conductor.name}
                  </h1>
                  {conductor.sponsored && (
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                      First Chair
                    </span>
                  )}
                </div>
                {conductor.certified && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-neon">
                    <span aria-hidden="true">✓</span> Certified Brand Symphony Conductor
                  </p>
                )}
                <p className="mt-2 italic text-slate-400">“{conductor.tagline}”</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <StarRating value={conductor.harmonyScore} />
                    <span className="font-semibold text-gold">
                      {conductor.harmonyScore.toFixed(1)}
                    </span>
                    <span className="text-slate-500">Harmony Score</span>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">
                    {conductor.resonanceCount} Resonance
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">📍 {conductor.location}</span>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Sessions from
                </p>
                <p className="font-display text-3xl font-bold text-gradient">
                  ${conductor.priceFrom}
                </p>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-3">
            <ScrollReveal delay={0.05}>
              <GlassCard className="p-6">
                <h2 className="font-display text-xl font-semibold text-white">
                  The Arrangement
                </h2>
                <p className="mt-3 leading-relaxed text-slate-400">{conductor.bio}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {conductor.specialties.map((s) => (
                    <AgentBadge key={s} agentId={s} />
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>

            {conductor.portfolio.length > 0 && (
              <ScrollReveal delay={0.1}>
                <GlassCard className="p-6">
                  <h2 className="font-display text-xl font-semibold text-white">
                    Past Performances
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {conductor.portfolio.map((p) => (
                      <li key={p.url}>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition-colors hover:border-neon/50 hover:text-neon"
                        >
                          <span>{p.title}</span>
                          <span className="text-slate-500 group-hover:text-neon" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </ScrollReveal>
            )}

            {/* Resonance (reviews) */}
            <ScrollReveal delay={0.15}>
              <GlassCard className="p-6">
                <h2 className="font-display text-xl font-semibold text-white">
                  Resonance
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Verified applause from {reviews.length} client
                  {reviews.length === 1 ? '' : 's'}.
                </p>
                {reviews.length === 0 ? (
                  <p className="mt-6 rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
                    The hall is still warming up — no Resonance yet.
                  </p>
                ) : (
                  <ul className="mt-5 space-y-5">
                    {reviews.map((r) => (
                      <li
                        key={r.id}
                        className="rounded-xl border border-white/5 bg-void/40 p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pulse/20 font-display text-sm font-bold text-pulse">
                              {r.author[0]}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {r.author}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(r.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                          <StarRating value={r.rating} size={14} />
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300">
                          {r.text}
                        </p>
                        {r.response && (
                          <div className="mt-4 rounded-lg border-l-2 border-neon/50 bg-neon/5 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neon">
                              Conductor's Response
                            </p>
                            <p className="mt-1 text-sm italic text-slate-300">
                              {r.response}
                            </p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </GlassCard>
            </ScrollReveal>
          </div>

          {/* Right column: scheduling */}
          <div className="lg:col-span-2">
            <ScrollReveal delay={0.1}>
              <GlassCard className="sticky top-24 p-6">
                <h2 className="font-display text-xl font-semibold text-white">
                  Compose a Session
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Pick a movement — {conductor.name.split(' ')[0]} will set the tempo.
                </p>

                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Next 7 days
                </p>
                <div className="mt-2 grid grid-cols-7 gap-1.5">
                  {days.map((d) => {
                    const active = d.iso === selectedDay.iso;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => {
                          setSelectedDay(d);
                          setSelectedSlot(null);
                        }}
                        className={`rounded-lg border px-1 py-2 text-center transition-colors ${
                          active
                            ? 'border-neon bg-neon/15 text-neon'
                            : 'border-white/10 text-slate-400 hover:border-neon/40'
                        }`}
                      >
                        <span className="block text-[9px] uppercase">{d.weekday}</span>
                        <span className="block text-sm font-semibold">{d.day}</span>
                        <span className="block text-[9px] text-slate-500">{d.month}</span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Available slots
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const active = slot === selectedSlot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                          active
                            ? 'border-pulse bg-pulse/15 text-pulse'
                            : 'border-white/10 text-slate-400 hover:border-pulse/40 hover:text-pulse'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                <NeonButton
                  onClick={openModal}
                  className="mt-6 w-full py-3"
                  variant={selectedSlot ? 'primary' : 'ghost'}
                >
                  {selectedSlot ? 'Book & Pay' : 'Select a time slot'}
                </NeonButton>
                {!user && (
                  <p className="mt-3 text-center text-[11px] text-slate-500">
                    <Link to="/settings" className="text-neon hover:underline">
                      Sign in
                    </Link>{' '}
                    to keep your bookings in one score.
                  </p>
                )}
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={checkoutState === 'processing' ? undefined : closeModal}
        >
          <GlassCard className="w-full max-w-md p-8">
            <div onClick={(e) => e.stopPropagation()}>
              {checkoutState === 'success' ? (
                <div className="text-center">
                  <p className="text-5xl" aria-hidden="true">🎶</p>
                  <h3 className="mt-4 font-display text-2xl font-bold text-white">
                    Your session is composed
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {conductor.name} · {selectedDay.weekday}, {selectedDay.month}{' '}
                    {selectedDay.day} at {selectedSlot}
                  </p>
                  <p className="mt-4 rounded-xl border border-gold/30 bg-gold/5 p-4 text-xs text-gold">
                    Stripe checkout will be wired in here — your booking is
                    confirmed in mock mode.
                  </p>
                  <NeonButton onClick={closeModal} className="mt-6 w-full">
                    Bravo
                  </NeonButton>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Confirm Your Session
                  </h3>
                  <dl className="mt-5 space-y-3 rounded-xl border border-white/10 bg-void/40 p-5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Conductor</dt>
                      <dd className="font-medium text-white">{conductor.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Date</dt>
                      <dd className="text-white">
                        {selectedDay.weekday}, {selectedDay.month} {selectedDay.day}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Time</dt>
                      <dd className="text-white">{selectedSlot}</dd>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-3">
                      <dt className="text-slate-500">From</dt>
                      <dd className="font-display text-lg font-bold text-gradient">
                        ${conductor.priceFrom}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-6 flex gap-3">
                    <NeonButton
                      variant="ghost"
                      onClick={closeModal}
                      className="flex-1"
                    >
                      Not yet
                    </NeonButton>
                    <NeonButton
                      onClick={confirmBooking}
                      className="flex-1"
                      variant="gold"
                    >
                      {checkoutState === 'processing'
                        ? 'Composing…'
                        : 'Confirm & Pay'}
                    </NeonButton>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
