import { useEffect, useState } from 'react';
import GlassCard from '../../components/GlassCard';
import ScrollReveal from '../../components/ScrollReveal';
import AgentBadge from '../../components/AgentBadge';
import StarRating from '../../components/StarRating';
import NeonButton from '../../components/NeonButton';
import { fetchConductors, assignSponsoredPlacement } from '../../lib/api';
import { PRICING_TIERS } from '../../data/constants';

const SLOTS = [
  {
    id: 'hero-slot',
    name: 'Hero Slot',
    description: 'Top of the marketplace homepage — the first Conductor every visitor sees.',
    accent: 'border-neon/30',
    glow: 'text-neon',
  },
  {
    id: 'category-top',
    name: 'Category Top',
    description: 'Pinned above every category listing for maximum section visibility.',
    accent: 'border-pulse/30',
    glow: 'text-pulse',
  },
  {
    id: 'search-boost',
    name: 'Search Boost',
    description: 'Elevated ranking across all directory search results.',
    accent: 'border-gold/30',
    glow: 'text-gold',
  },
];

const INITIAL_ASSIGNMENTS = {
  'hero-slot': 'nova-abelek',
  'category-top': 'sable-okonkwo',
  'search-boost': null,
};

function Avatar({ conductor, size = 'h-11 w-11 text-base' }) {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full font-display font-bold text-void`}
      style={{ backgroundColor: conductor.accent }}
    >
      {conductor.name
        .split(' ')
        .map((w) => w[0])
        .join('')}
    </div>
  );
}

function SlotSkeleton() {
  return (
    <GlassCard className="p-6">
      <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
      <div className="mt-4 h-12 animate-pulse rounded-lg bg-white/5" />
      <div className="mt-4 h-9 animate-pulse rounded-lg bg-white/5" />
    </GlassCard>
  );
}

export default function SponsoredManager() {
  const [conductors, setConductors] = useState(null);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [selections, setSelections] = useState({});
  const [busySlot, setBusySlot] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchConductors().then((list) => {
      if (!cancelled) setConductors(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const approved = conductors === null ? [] : conductors.filter((c) => c.status === 'approved');
  const firstChairs = conductors === null ? [] : conductors.filter((c) => c.sponsored);
  const byId = (id) => (conductors || []).find((c) => c.id === id) || null;

  const firstChairTier = PRICING_TIERS.find((t) => t.sponsored);

  const handleAssign = async (slotId) => {
    const conductorId = selections[slotId];
    if (!conductorId) return;
    setBusySlot(slotId);
    await assignSponsoredPlacement(slotId, conductorId);
    setAssignments((prev) => ({ ...prev, [slotId]: conductorId }));
    setSelections((prev) => ({ ...prev, [slotId]: '' }));
    setBusySlot(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      <ScrollReveal>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          The Maestro · First Chair Program
        </p>
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Sponsored <span className="text-gradient">Placements</span>
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          {firstChairTier
            ? `First Chair holders pay $${firstChairTier.price}/${firstChairTier.cadence} for the spotlight. Seat them wisely — the spotlight earns its keep.`
            : 'Seat the First Chairs — the spotlight earns its keep.'}
        </p>
      </ScrollReveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {conductors === null
          ? SLOTS.map((s) => <SlotSkeleton key={s.id} />)
          : SLOTS.map((slot, i) => {
              const assigned = byId(assignments[slot.id]);
              return (
                <ScrollReveal key={slot.id} delay={i * 0.1}>
                  <GlassCard hover className={`flex h-full flex-col p-6 ${slot.accent}`}>
                    <p className={`text-xs font-bold uppercase tracking-[0.25em] ${slot.glow}`}>
                      {slot.name}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      {slot.description}
                    </p>

                    <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                      {assigned ? (
                        <div className="flex items-center gap-3">
                          <Avatar conductor={assigned} />
                          <div className="min-w-0">
                            <p className="truncate font-display text-sm font-bold text-white">
                              {assigned.name}
                            </p>
                            <div className="mt-0.5 flex items-center gap-1.5">
                              <StarRating value={assigned.harmonyScore} size={11} />
                              <span className="text-xs text-gold">
                                {assigned.harmonyScore.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-white/20 text-lg text-slate-600">
                            ?
                          </div>
                          <div>
                            <p className="font-display text-sm font-bold text-slate-400">
                              Chair empty
                            </p>
                            <p className="text-xs text-slate-600">
                              Assign an approved Conductor below.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <select
                        value={selections[slot.id] || ''}
                        onChange={(e) =>
                          setSelections((prev) => ({ ...prev, [slot.id]: e.target.value }))
                        }
                        className="min-w-0 flex-1 rounded-lg border border-white/10 bg-obsidian px-3 py-2 text-sm text-white outline-none focus:border-neon/50"
                      >
                        <option value="">Select a Conductor…</option>
                        {approved.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} · {c.harmonyScore.toFixed(1)}★
                          </option>
                        ))}
                      </select>
                      <button
                        disabled={!selections[slot.id] || busySlot === slot.id}
                        onClick={() => handleAssign(slot.id)}
                        className="btn-glow shrink-0 rounded-lg bg-neon px-4 py-2 text-sm font-bold text-void transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {busySlot === slot.id ? 'Seating…' : 'Assign'}
                      </button>
                    </div>
                  </GlassCard>
                </ScrollReveal>
              );
            })}
      </div>

      <ScrollReveal delay={0.1}>
        <div className="mt-16 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold text-white">
            Current <span className="text-gold">First Chair</span> Holders
          </h2>
          <span className="text-xs uppercase tracking-widest text-slate-500">
            {conductors === null ? '…' : `${firstChairs.length} active subscriptions`}
          </span>
        </div>
      </ScrollReveal>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {conductors === null ? (
          <>
            <SlotSkeleton />
            <SlotSkeleton />
          </>
        ) : firstChairs.length === 0 ? (
          <GlassCard className="p-12 text-center md:col-span-2 lg:col-span-3">
            <p className="font-display text-xl text-white">No First Chairs seated.</p>
            <p className="mt-2 text-sm text-slate-500">
              Sponsored Conductors will appear here once they upgrade.
            </p>
          </GlassCard>
        ) : (
          firstChairs.map((c, i) => (
            <ScrollReveal key={c.id} delay={i * 0.08}>
              <GlassCard hover className="border-gold/20 p-6">
                <div className="flex items-start justify-between">
                  <Avatar conductor={c} />
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold">
                    First Chair
                  </span>
                </div>
                <p className="mt-4 font-display text-lg font-bold text-white">{c.name}</p>
                <p className="mt-1 text-sm text-slate-400">{c.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.specialties.map((id) => (
                    <AgentBadge key={id} agentId={id} />
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <StarRating value={c.harmonyScore} size={11} />
                    {c.harmonyScore.toFixed(1)} · {c.resonanceCount} resonance
                  </span>
                  <span>{c.location}</span>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))
        )}
      </div>

      <ScrollReveal delay={0.15}>
        <div className="mt-12">
          <NeonButton to="/admin/directory" variant="ghost">
            Back to Directory
          </NeonButton>
        </div>
      </ScrollReveal>
    </div>
  );
}
