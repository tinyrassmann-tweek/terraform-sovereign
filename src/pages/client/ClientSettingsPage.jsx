import { Link } from 'react-router-dom';
import GlassCard from '../../components/GlassCard.jsx';
import NeonButton from '../../components/NeonButton.jsx';
import StarRating from '../../components/StarRating.jsx';
import SectionHeading from '../../components/SectionHeading.jsx';
import ScrollReveal from '../../components/ScrollReveal.jsx';
import { mockConductors } from '../../data/mockConductors.js';
import { useAuth } from '../../lib/auth.jsx';

export default function ClientSettingsPage() {
  const { user, signInWithGoogle, signOut, favorites, bookings } = useAuth();

  if (!user) {
    return (
      <div className="bg-void">
        <div className="mx-auto flex max-w-md flex-col items-center px-6 pb-24 pt-24">
          <ScrollReveal>
            <GlassCard className="w-full p-10 text-center">
              <p className="text-5xl" aria-hidden="true">🎟️</p>
              <h1 className="mt-4 font-display text-2xl font-bold text-white">
                Take Your Seat
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Sign in to save your favorite Conductors, track bookings, and
                hear your Resonance echo back.
              </p>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-all hover:brightness-95"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
                  />
                </svg>
                Continue with Google
              </button>
              <p className="mt-4 text-[11px] text-slate-500">
                Mock sign-in for the Overture build — real OAuth arrives with
                the full premiere.
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  const favoriteConductors = mockConductors.filter((c) =>
    favorites.includes(c.id)
  );

  return (
    <div className="bg-void">
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-16">
        <ScrollReveal>
          <SectionHeading kicker="Your Box Seat" title="Client Settings" />
        </ScrollReveal>

        {/* Profile */}
        <ScrollReveal delay={0.05}>
          <GlassCard className="flex flex-col items-center gap-6 p-8 sm:flex-row">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl font-display text-2xl font-bold text-void"
              style={{
                background: `linear-gradient(135deg, ${user.avatarColor || '#22d3ee'}, #a78bfa)`,
              }}
              aria-hidden="true"
            >
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-2xl font-bold text-white">
                {user.name}
              </h2>
              <p className="text-sm text-slate-400">{user.email}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neon">
                Audience Member
              </p>
            </div>
            <NeonButton variant="ghost" onClick={signOut}>
              Sign Out
            </NeonButton>
          </GlassCard>
        </ScrollReveal>

        {/* Favorites */}
        <ScrollReveal delay={0.1}>
          <div className="mt-12">
            <h2 className="mb-6 font-display text-xl font-semibold text-white">
              Your Favorite Conductors
            </h2>
            {favoriteConductors.length === 0 ? (
              <GlassCard className="p-10 text-center">
                <p className="text-4xl" aria-hidden="true">♡</p>
                <p className="mt-3 text-sm text-slate-400">
                  No favorites yet — tap the heart on any Conductor to keep
                  them in your front row.
                </p>
                <NeonButton to="/conductors" className="mt-6">
                  Browse the Ensemble
                </NeonButton>
              </GlassCard>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteConductors.map((c) => (
                  <Link key={c.id} to={`/conductors/${c.id}`} className="group block">
                    <GlassCard hover className="h-full p-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold text-void"
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
                          <h3 className="truncate font-display font-semibold text-white group-hover:text-neon">
                            {c.name}
                          </h3>
                          <p className="text-xs text-slate-500">{c.location}</p>
                        </div>
                        <span className="ml-auto text-pulse" aria-hidden="true">♥</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <StarRating value={c.harmonyScore} size={12} />
                        <span className="font-semibold text-gold">
                          {c.harmonyScore.toFixed(1)}
                        </span>
                        <span className="text-slate-500">
                          · {c.resonanceCount} Resonance
                        </span>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Booking history */}
        <ScrollReveal delay={0.15}>
          <div className="mt-12">
            <h2 className="mb-6 font-display text-xl font-semibold text-white">
              Booking History
            </h2>
            {bookings.length === 0 ? (
              <GlassCard className="p-10 text-center">
                <p className="text-4xl" aria-hidden="true">🎼</p>
                <p className="mt-3 text-sm text-slate-400">
                  No sessions composed yet. When you book a Conductor, the
                  arrangement appears here.
                </p>
                <NeonButton to="/conductors" variant="gold" className="mt-6">
                  Book Your First Session
                </NeonButton>
              </GlassCard>
            ) : (
              <GlassCard className="divide-y divide-white/5 p-2">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-wrap items-center gap-4 px-5 py-4"
                  >
                    <span className="text-2xl" aria-hidden="true">🎫</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">
                        {b.conductorName || b.conductorId}
                      </p>
                      <p className="text-xs text-slate-500">
                        {b.date} · {b.slot}
                      </p>
                    </div>
                    {typeof b.price === 'number' && (
                      <p className="text-sm font-semibold text-neon">
                        ${b.price}
                      </p>
                    )}
                    <span className="rounded-full bg-neon/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neon">
                      {b.status || 'confirmed'}
                    </span>
                  </div>
                ))}
              </GlassCard>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
