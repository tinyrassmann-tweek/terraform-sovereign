import { useMemo, useState } from 'react';
import GlassCard from '../../components/GlassCard.jsx';
import NeonButton from '../../components/NeonButton.jsx';
import ScrollReveal from '../../components/ScrollReveal.jsx';
import { mockConductors } from '../../data/mockConductors.js';
import { mockReviews } from '../../data/mockReviews.js';

const conductor = mockConductors[0];

const SOCIALS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    blurb: 'Sync your page so bookings and Resonance highlights post automatically.',
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    blurb: 'Showcase before/after transformations straight from your portfolio.',
    gradient: 'from-fuchsia-500 via-pink-500 to-amber-400',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: '𝕏',
    blurb: 'Broadcast client wins and Harmony Score milestones to your audience.',
    gradient: 'from-slate-500 to-slate-800',
  },
];

const initialConnections = { facebook: true, instagram: false, x: false };

function SocialCard({ social, connected, onToggle }) {
  const [busy, setBusy] = useState(false);

  const handleToggle = () => {
    setBusy(true);
    // Mock network latency for the connect/disconnect handshake.
    setTimeout(() => {
      onToggle(social.id);
      setBusy(false);
    }, 400);
  };

  return (
    <GlassCard hover className="flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-xl ${social.gradient}`}
        >
          <span aria-hidden="true">{social.icon}</span>
        </div>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              connected
                ? 'bg-neon shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                : 'bg-slate-500'
            }`}
          />
          <span className={connected ? 'text-neon' : 'text-slate-500'}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-white">{social.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{social.blurb}</p>
      <button
        type="button"
        onClick={handleToggle}
        disabled={busy}
        className={`mt-5 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 disabled:opacity-50 ${
          connected
            ? 'border border-white/15 text-slate-300 hover:border-red-400/60 hover:text-red-300'
            : 'btn-glow bg-gradient-to-r from-neon to-pulse text-void hover:brightness-110'
        }`}
      >
        {busy ? 'Tuning…' : connected ? 'Disconnect' : 'Connect'}
      </button>
    </GlassCard>
  );
}

function SeoScorePanel() {
  const reviewCount = mockReviews.filter(
    (r) => r.conductorId === conductor.id && r.status === 'approved'
  ).length;

  const checklist = [
    {
      id: 'bio',
      label: 'Bio present',
      hint: 'A full bio gives search engines a rich profile to index.',
      complete: Boolean(conductor.bio && conductor.bio.trim().length > 0),
    },
    {
      id: 'specialties',
      label: '3+ specialties listed',
      hint: 'More specialties mean more search surfaces to rank on.',
      complete: conductor.specialties.length >= 3,
    },
    {
      id: 'portfolio',
      label: 'Portfolio links added',
      hint: 'Outbound proof of work lifts domain relevance.',
      complete: conductor.portfolio && conductor.portfolio.length > 0,
    },
    {
      id: 'accent',
      label: 'Avatar & accent set',
      hint: 'A branded profile converts more of the traffic SEO earns.',
      complete: Boolean(conductor.accent),
    },
    {
      id: 'reviews',
      label: '5+ Resonance reviews',
      hint: 'Fresh reviews are the strongest local ranking signal.',
      complete: reviewCount >= 5,
    },
  ];

  const done = checklist.filter((c) => c.complete).length;
  const score = Math.round((done / checklist.length) * 100);

  // SVG progress ring
  const R = 54;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const offset = CIRCUMFERENCE * (1 - score / 100);
  const scoreColor = score >= 80 ? '#22d3ee' : score >= 50 ? '#fbbf24' : '#f87171';

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
        {/* Ring */}
        <div className="relative shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
            <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            <circle
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out', filter: `drop-shadow(0 0 8px ${scoreColor})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold" style={{ color: scoreColor }}>
              {score}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              / 100
            </span>
          </div>
        </div>

        {/* Checklist */}
        <div className="w-full flex-1">
          <h3 className="font-display text-xl font-bold text-white">
            Google SEO Score{' '}
            <span className="text-gradient">· Profile Completeness</span>
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Complete every item to maximize how loudly Google amplifies your podium.
          </p>
          <ul className="mt-5 space-y-3">
            {checklist.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    item.complete
                      ? 'bg-neon/20 text-neon shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                      : 'bg-gold/15 text-gold'
                  }`}
                >
                  {item.complete ? '✓' : '!'}
                </span>
                <div>
                  <p className={`text-sm font-medium ${item.complete ? 'text-slate-200' : 'text-gold'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500">{item.hint}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-relaxed text-slate-400">
            {done === checklist.length
              ? '🎉 Perfectly tuned — your profile is playing at full volume.'
              : `${checklist.length - done} item${checklist.length - done === 1 ? '' : 's'} left to tune. Complete them to raise your score and your ranking.`}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

export default function TuningPage() {
  const [connections, setConnections] = useState(initialConnections);

  const connectedCount = useMemo(
    () => Object.values(connections).filter(Boolean).length,
    [connections]
  );

  const toggleConnection = (id) =>
    setConnections((c) => ({ ...c, [id]: !c[id] }));

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <ScrollReveal>
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon neon-text">
            The First Chair
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            <span className="text-gradient">Tuning</span> — SEO &amp; Social Sync
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Even a maestro needs amplification. Connect your social channels and complete your
            profile so the whole market hears your harmony.
          </p>
        </div>
      </ScrollReveal>

      {/* Social sync */}
      <ScrollReveal delay={0.05}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white">Social Sync</h2>
          <span className="text-xs text-slate-500">
            {connectedCount} of {SOCIALS.length} channels connected
          </span>
        </div>
      </ScrollReveal>
      <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {SOCIALS.map((social, i) => (
          <ScrollReveal key={social.id} delay={0.08 + i * 0.08}>
            <SocialCard
              social={social}
              connected={connections[social.id]}
              onToggle={toggleConnection}
            />
          </ScrollReveal>
        ))}
      </div>

      {/* SEO score */}
      <ScrollReveal delay={0.1}>
        <h2 className="mb-5 font-display text-xl font-bold text-white">Search Resonance</h2>
        <SeoScorePanel />
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-neon/5 via-pulse/5 to-gold/5 p-8 text-center">
          <p className="max-w-lg text-sm text-slate-300">
            A tuned profile turns searchers into an audience — and an audience into{' '}
            <span className="neon-text text-neon">standing ovations</span>.
          </p>
          <NeonButton to="/provider/reviews" variant="gold">
            Visit the Resonance Chamber
          </NeonButton>
        </div>
      </ScrollReveal>
    </div>
  );
}
