import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GlassCard from '../../components/GlassCard.jsx';
import NeonButton from '../../components/NeonButton.jsx';
import StarRating from '../../components/StarRating.jsx';
import SectionHeading from '../../components/SectionHeading.jsx';
import AgentBadge from '../../components/AgentBadge.jsx';
import ScrollReveal from '../../components/ScrollReveal.jsx';
import { DISCORD_PAIN_POINTS, AI_AGENTS, BRAND } from '../../data/constants.js';
import { mockConductors } from '../../data/mockConductors.js';

// Extra card required by the brief: maps to lead-capture, same as 'Missed Leads'.
const EXTRA_DISCORD = {
  id: 'missed-calls',
  name: 'Missed Calls',
  agentId: 'lead-capture',
  description:
    'The phone rings while you are on a job — lead capture answers, qualifies, and books before the caller rings a competitor.',
};

const ALL_DISCORDS = [...DISCORD_PAIN_POINTS, EXTRA_DISCORD];

export default function OnboardingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('discord');

  const selected = ALL_DISCORDS.find((d) => d.id === selectedId) || null;
  const selectedAgent = selected
    ? AI_AGENTS.find((a) => a.id === selected.agentId)
    : null;

  const matches = useMemo(() => {
    if (!selected) return [];
    return mockConductors
      .filter(
        (c) => c.status === 'approved' && c.specialties.includes(selected.agentId)
      )
      .sort((a, b) => b.harmonyScore - a.harmonyScore);
  }, [selected]);

  const selectDiscord = (id) => {
    if (id === selectedId) {
      setSearchParams({});
    } else {
      setSearchParams({ discord: id });
    }
  };

  return (
    <div className="bg-void">
      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-16">
        <ScrollReveal>
          <SectionHeading
            kicker="The Discord-to-Harmony Assessment"
            title="Select Your Discord"
          >
            <p>
              Every great performance begins by naming the noise. Tell us what
              hurts most in your business, and we will tune you to the
              Conductors who resolve it.
            </p>
          </SectionHeading>
        </ScrollReveal>

        {/* Discord cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_DISCORDS.map((discord, i) => {
            const agent = AI_AGENTS.find((a) => a.id === discord.agentId);
            const active = discord.id === selectedId;
            return (
              <ScrollReveal key={discord.id} delay={i * 0.06}>
                <button
                  type="button"
                  onClick={() => selectDiscord(discord.id)}
                  aria-pressed={active}
                  className={`group block w-full text-left transition-transform duration-300 hover:-translate-y-1 ${
                    active ? '-translate-y-1' : ''
                  }`}
                >
                  <GlassCard
                    hover
                    className={`h-full p-6 transition-all duration-300 ${
                      active
                        ? 'border-neon/70 shadow-[0_0_30px_rgba(34,211,238,0.25)]'
                        : ''
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-3xl" aria-hidden="true">
                        {agent?.icon}
                      </span>
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs transition-colors ${
                          active
                            ? 'border-neon bg-neon text-void'
                            : 'border-white/25 text-transparent group-hover:border-neon/50'
                        }`}
                      >
                        ✓
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-white">
                      {discord.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {discord.description}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-pulse">
                      Resolved by {agent?.name} · {agent?.note}
                    </p>
                  </GlassCard>
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Matched conductors */}
      {selected && (
        <section className="border-t border-white/5 bg-obsidian/50 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal>
              <SectionHeading
                kicker={selectedAgent ? `${selectedAgent.name} Ensemble` : 'Ensemble'}
                title="Conductors Tuned to Your Discord"
              >
                <p>
                  <span className="text-white">{matches.length}</span> vetted
                  Conductor{matches.length === 1 ? '' : 's'} specialize in
                  turning <span className="text-neon">{selected.name}</span>{' '}
                  into Harmony.
                </p>
              </SectionHeading>
            </ScrollReveal>

            {matches.length === 0 ? (
              <GlassCard className="mx-auto max-w-xl p-10 text-center">
                <p className="text-4xl" aria-hidden="true">🎼</p>
                <p className="mt-4 text-slate-300">
                  The section for this Discord is still being seated. Browse the
                  full ensemble below.
                </p>
              </GlassCard>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((c, i) => (
                  <ScrollReveal key={c.id} delay={i * 0.07}>
                    <Link to={`/conductors/${c.id}`} className="group block h-full">
                      <GlassCard hover className="relative h-full p-6">
                        {c.sponsored && (
                          <span className="absolute right-4 top-4 rounded-full bg-gold/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                            First Chair
                          </span>
                        )}
                        <div className="flex items-center gap-4">
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
                          <div>
                            <h3 className="font-display text-lg font-semibold text-white group-hover:text-neon">
                              {c.name}
                            </h3>
                            <p className="text-xs text-slate-500">{c.location}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm italic text-slate-400">
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
                        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
                          From <span className="text-neon">${c.priceFrom}</span> / session
                        </p>
                      </GlassCard>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            )}

            <ScrollReveal delay={0.15}>
              <div className="mt-12 text-center">
                <NeonButton to="/conductors" variant="primary" className="px-8 py-3">
                  Browse the Full Ensemble →
                </NeonButton>
                <p className="mt-4 text-xs text-slate-500">
                  {BRAND.tagline}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </div>
  );
}
