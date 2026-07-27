import { useMemo, useState } from 'react';
import GlassCard from '../../components/GlassCard.jsx';
import NeonButton from '../../components/NeonButton.jsx';
import ScrollReveal from '../../components/ScrollReveal.jsx';
import AgentBadge from '../../components/AgentBadge.jsx';
import { AI_AGENTS } from '../../data/constants.js';

const seedInstruments = [
  {
    id: 'inst-1',
    agentId: 'lead-capture',
    name: 'After-Hours Lead Net',
    description:
      'Catches every inbound inquiry after 6pm, qualifies it in seconds, and books it into your morning queue.',
    price: 650,
    active: true,
  },
  {
    id: 'inst-2',
    agentId: 'lead-capture',
    name: 'Web-to-Pipeline Intake',
    description:
      'Turns website forms and chat into scored CRM leads with instant owner alerts on hot opportunities.',
    price: 480,
    active: true,
  },
  {
    id: 'inst-3',
    agentId: 'follow-up',
    name: '7-Touch Nurture Sequence',
    description:
      'A personalized seven-touch follow-up movement that revives cold quotes and unclosed estimates.',
    price: 520,
    active: true,
  },
  {
    id: 'inst-4',
    agentId: 'scheduling',
    name: 'Calendar Conductor',
    description:
      'Books, reschedules, and reminds automatically — synced with your crew calendars and drive-time buffers.',
    price: 410,
    active: false,
  },
  {
    id: 'inst-5',
    agentId: 'reputation',
    name: 'Review Encore Engine',
    description:
      'Requests reviews at the peak-satisfaction moment and drafts on-brand responses to every rating.',
    price: 375,
    active: true,
  },
];

const emptyForm = { agentId: AI_AGENTS[0].id, name: '', description: '', price: '', active: true };

const currency = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function Toggle({ on, onToggle, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ${
        on ? 'bg-neon/80 shadow-[0_0_12px_rgba(34,211,238,0.5)]' : 'bg-white/15'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          on ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function InstrumentForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    onSave({ ...form, name: form.name.trim(), price: Number(form.price) });
  };

  const inputClasses =
    'w-full rounded-xl border border-white/10 bg-void/60 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-neon/60';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Agent Ensemble
        </label>
        <select value={form.agentId} onChange={set('agentId')} className={inputClasses}>
          {AI_AGENTS.map((agent) => (
            <option key={agent.id} value={agent.id} className="bg-obsidian">
              {agent.icon} {agent.name} ({agent.note})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Instrument Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={set('name')}
          placeholder="e.g. After-Hours Lead Net"
          className={inputClasses}
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={set('description')}
          rows={3}
          placeholder="What does this service orchestrate for the client?"
          className={`${inputClasses} resize-none`}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Price (USD)
        </label>
        <input
          type="number"
          min="0"
          step="1"
          value={form.price}
          onChange={set('price')}
          placeholder="450"
          className={inputClasses}
          required
        />
      </div>
      <label className="flex items-center gap-3 text-sm text-slate-300">
        <Toggle
          on={form.active}
          onToggle={() => setForm((f) => ({ ...f, active: !f.active }))}
          label="Instrument active"
        />
        Listed on your public score
      </label>
      <div className="flex gap-3 pt-2">
        <NeonButton variant="primary" className="flex-1" onClick={handleSubmit}>
          {initial.id ? 'Save Changes' : 'Add Instrument'}
        </NeonButton>
        <NeonButton variant="ghost" onClick={onCancel}>
          Cancel
        </NeonButton>
      </div>
    </form>
  );
}

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState(seedInstruments);
  // null = panel closed, 'new' = adding, otherwise an instrument object being edited
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const activeCount = useMemo(() => instruments.filter((i) => i.active).length, [instruments]);

  const handleSave = (form) => {
    if (editing === 'new') {
      setInstruments((list) => [...list, { ...form, id: `inst-${Date.now()}` }]);
    } else {
      setInstruments((list) => list.map((i) => (i.id === editing.id ? { ...i, ...form } : i)));
    }
    setEditing(null);
  };

  const handleDelete = (id) => {
    setInstruments((list) => list.filter((i) => i.id !== id));
    setConfirmDelete(null);
    if (editing && editing !== 'new' && editing.id === id) setEditing(null);
  };

  const toggleActive = (id) =>
    setInstruments((list) => list.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <ScrollReveal>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon neon-text">
              The First Chair
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              My <span className="text-gradient">Instruments</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {instruments.length} service{instruments.length === 1 ? '' : 's'} composed ·{' '}
              {activeCount} live on your score
            </p>
          </div>
          {editing === null && (
            <NeonButton variant="primary" onClick={() => setEditing('new')}>
              + Compose New Instrument
            </NeonButton>
          )}
        </div>
      </ScrollReveal>

      {/* Add / edit panel */}
      {editing !== null && (
        <ScrollReveal>
          <GlassCard className="mb-8 border-neon/30 p-6 sm:p-8">
            <h2 className="mb-6 font-display text-xl font-bold text-white">
              {editing === 'new' ? 'Compose a New Instrument' : `Tuning: ${editing.name}`}
            </h2>
            <InstrumentForm
              initial={editing === 'new' ? emptyForm : editing}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
          </GlassCard>
        </ScrollReveal>
      )}

      {/* Empty state */}
      {instruments.length === 0 && (
        <ScrollReveal>
          <GlassCard className="flex flex-col items-center gap-4 p-12 text-center">
            <span aria-hidden="true" className="text-5xl">🎼</span>
            <h2 className="font-display text-xl font-bold text-white">Your score is empty</h2>
            <p className="max-w-md text-sm text-slate-400">
              Every Conductor needs instruments. Compose your first service and let clients hear
              what harmony sounds like.
            </p>
            <NeonButton variant="primary" onClick={() => setEditing('new')}>
              Compose Your First Instrument
            </NeonButton>
          </GlassCard>
        </ScrollReveal>
      )}

      {/* Instrument list */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {instruments.map((inst, i) => (
          <ScrollReveal key={inst.id} delay={i * 0.06}>
            <GlassCard hover className={`flex h-full flex-col p-6 ${inst.active ? '' : 'opacity-70'}`}>
              <div className="flex items-start justify-between gap-3">
                <AgentBadge agentId={inst.agentId} />
                <Toggle
                  on={inst.active}
                  onToggle={() => toggleActive(inst.id)}
                  label={`${inst.name} ${inst.active ? 'active' : 'paused'}`}
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">{inst.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{inst.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <p className="font-display text-xl font-bold text-gold">
                  {currency(inst.price)}
                  <span className="ml-1 text-xs font-normal text-slate-500">/ project</span>
                </p>
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    inst.active ? 'text-neon' : 'text-slate-500'
                  }`}
                >
                  {inst.active ? '● Live' : '○ Paused'}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(inst)}
                  className="flex-1 rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-neon/60 hover:text-neon"
                >
                  Edit
                </button>
                {confirmDelete === inst.id ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(inst.id)}
                    className="flex-1 rounded-xl border border-red-400/50 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20"
                  >
                    Confirm Delete?
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(inst.id)}
                    className="flex-1 rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-red-400/60 hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
