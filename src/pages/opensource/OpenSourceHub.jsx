import { useMemo, useState } from 'react';
import GlassCard from '../../components/GlassCard';
import NeonButton from '../../components/NeonButton';
import SectionHeading from '../../components/SectionHeading';
import ScrollReveal from '../../components/ScrollReveal';
import { mockContributors } from '../../data/mockContributors';
import { BRAND } from '../../data/constants';

const REPO_STATS = [
  { icon: '★', label: 'Star', value: '4.2k' },
  { icon: '⑂', label: 'Fork', value: '812' },
  { icon: '👁', label: 'Watch', value: '196' },
];

const LANGUAGES = [
  { name: 'JavaScript', pct: 61.4, color: '#f1e05a' },
  { name: 'CSS', pct: 22.1, color: '#a78bfa' },
  { name: 'GLSL', pct: 10.3, color: '#22d3ee' },
  { name: 'HTML', pct: 6.2, color: '#fbbf24' },
];

const FILE_TREE = [
  { type: 'dir', name: '.github', message: 'ci: add harmony-score regression workflow', age: '3 weeks ago' },
  { type: 'dir', name: 'src', message: 'feat: real-time booking slot engine (#212)', age: '4 days ago' },
  { type: 'dir', name: 'src/components', message: 'a11y: keyboard navigation fixes (#188)', age: 'last week' },
  { type: 'dir', name: 'src/data', message: 'chore: refresh mock conductor seed data', age: '2 weeks ago' },
  { type: 'dir', name: 'src/three', message: 'perf: overture hero scene render pass (#167)', age: '2 weeks ago' },
  { type: 'file', name: '.gitignore', message: 'chore: ignore local orchestration scratch files', age: '3 months ago' },
  { type: 'file', name: 'CODE_OF_CONDUCT.md', message: 'docs: every musician keeps tempo with respect', age: '5 months ago' },
  { type: 'file', name: 'CONTRIBUTING.md', message: 'docs: merged PRs waive the Section Player fee', age: 'last month' },
  { type: 'file', name: 'LICENSE', message: 'chore: open-core licensing terms', age: '6 months ago' },
  { type: 'file', name: 'README.md', message: 'docs: the Brand Symphony Arrangement Method', age: '4 days ago' },
  { type: 'file', name: 'package.json', message: 'chore: bump framer-motion and three', age: 'last week' },
  { type: 'file', name: 'tailwind.config.js', message: 'style: sovereign dark theme tokens', age: '2 months ago' },
];

const FEATURE_AREAS = [
  'Booking & Scheduling Engine',
  'Harmony Score Algorithm',
  'Resonance Review System',
  'Conductor Directory & Search',
  '3D Overture Hero Scene',
  'Payments & Sponsored Placement',
  'Accessibility & Performance',
];

function RepoHeader() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1117] font-mono text-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2 text-base">
          <span className="text-neon">📖</span>
          <span className="text-slate-400 hover:text-neon">think-tank-solutions-ai</span>
          <span className="text-slate-600">/</span>
          <span className="font-semibold text-neon">terraform-sovereign-core</span>
          <span className="ml-2 rounded-full border border-white/15 px-2 py-0.5 text-xs text-slate-400">
            Public
          </span>
        </div>
        <div className="flex items-center gap-2">
          {REPO_STATS.map((s) => (
            <button
              key={s.label}
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-neon/50 hover:text-neon"
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
              <span className="rounded-full bg-white/10 px-1.5 text-slate-200">{s.value}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="text-neon">⑂</span> main
        </span>
        <span>142 commits</span>
        <span>12 branches</span>
        <span>v2.4.1 latest release</span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Build passing — orchestrated by the Maestro
        </span>
      </div>

      <div className="border-t border-white/10 px-5 py-3">
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          {LANGUAGES.map((l) => (
            <div key={l.name} style={{ width: `${l.pct}%`, backgroundColor: l.color }} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
          {LANGUAGES.map((l) => (
            <span key={l.name} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: l.color }}
              />
              {l.name} <span className="text-slate-500">{l.pct}%</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FileList() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] font-mono text-sm">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-3">
        <span className="flex items-center gap-2 text-slate-300">
          <span className="inline-block h-6 w-6 rounded-full bg-gradient-to-br from-neon to-pulse text-center text-xs leading-6 text-void">
            M
          </span>
          <span className="font-semibold text-white">the-maestro</span>
          <span className="hidden text-slate-500 sm:inline">
            docs: the Brand Symphony Arrangement Method
          </span>
        </span>
        <span className="text-xs text-slate-500">4 days ago · 142 commits</span>
      </div>
      <ul className="divide-y divide-white/5">
        {FILE_TREE.map((f) => (
          <li
            key={f.name}
            className="grid grid-cols-[1fr_auto] items-center gap-x-4 px-5 py-2.5 transition-colors hover:bg-white/5 sm:grid-cols-[220px_1fr_auto]"
          >
            <span className="flex items-center gap-2 truncate">
              <span>{f.type === 'dir' ? '📁' : '📄'}</span>
              <span className={f.type === 'dir' ? 'text-neon' : 'text-slate-200'}>{f.name}</span>
            </span>
            <span className="hidden truncate text-xs text-slate-500 sm:inline">{f.message}</span>
            <span className="text-xs text-slate-500">{f.age}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReadmePanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1117]">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 font-mono text-xs text-slate-400">
        <span>📄</span> README.md
      </div>
      <div className="prose-invert px-6 py-6 sm:px-8">
        <h3 className="font-display text-2xl font-bold text-white">
          🎼 Terraform Sovereign Core
        </h3>
        <p className="mt-1 font-mono text-sm text-neon">{BRAND.tagline}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          This is the open-core engine behind {BRAND.platform} — the marketplace where clients
          drowning in <span className="text-pulse">Discord</span> meet the Conductors who bring
          their operations into <span className="text-neon">Harmony</span>.
        </p>
        <h4 className="mt-6 font-display text-lg font-semibold text-gold">
          The Brand Symphony Arrangement Method
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {BRAND.method} is our proprietary framework for arranging a business's AI stack the way
          a maestro arranges a score: every agent is an instrument, every workflow a movement. The
          core scoring, matching, and orchestration primitives live here — open for anyone to
          study, extend, and improve.
        </p>
        <h4 className="mt-6 font-display text-lg font-semibold text-gold">Open-core model</h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          The engine is open; the stage is curated. First Chair certification, sponsored
          placement, and the hosted platform remain commercial — but every merged pull request
          makes the whole orchestra stronger, and earns the contributor a place in the pit.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
          {['open-core', 'react', 'ai-orchestration', 'harmony-score', 'threejs'].map((t) => (
            <span
              key={t}
              className="rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-neon"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PullRequestForm() {
  const [title, setTitle] = useState('');
  const [area, setArea] = useState(FEATURE_AREAS[0]);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setTitle('');
    setArea(FEATURE_AREAS[0]);
    setDescription('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon/15 text-3xl">
          🎺
        </div>
        <h3 className="font-display text-2xl font-bold text-white">
          PR submitted — the Maestro will review
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
          <span className="font-mono text-neon">"{title}"</span> has joined the review queue.
          If it merges, your Section Player fee is waived — welcome to the pit.
        </p>
        <NeonButton variant="ghost" className="mt-6" onClick={handleReset}>
          Compose another PR
        </NeonButton>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="pr-title" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
            PR Title
          </label>
          <input
            id="pr-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="feat: tune the harmony score for quieter movements"
            className="w-full rounded-xl border border-white/10 bg-void/60 px-4 py-2.5 font-mono text-sm text-white placeholder-slate-600 outline-none transition-colors focus:border-neon/60"
          />
        </div>
        <div>
          <label htmlFor="pr-area" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Feature Area
          </label>
          <select
            id="pr-area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-void/60 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-neon/60"
          >
            {FEATURE_AREAS.map((a) => (
              <option key={a} value={a} className="bg-void">
                {a}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pr-desc" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Description
          </label>
          <textarea
            id="pr-desc"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this change orchestrate? Reference any issues, and describe how you tested it."
            className="w-full resize-none rounded-xl border border-white/10 bg-void/60 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors focus:border-neon/60"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            By submitting you agree to the open-core license. All PRs are reviewed by the Maestro.
          </p>
          <NeonButton
            variant="primary"
            className="shrink-0"
            onClick={handleSubmit}
          >
            Submit Pull Request
          </NeonButton>
        </div>
      </form>
    </GlassCard>
  );
}

function ContributorLeaderboard() {
  const ranked = useMemo(
    () => [...mockContributors].sort((a, b) => b.mergedPRs - a.mergedPRs),
    []
  );

  return (
    <div className="space-y-4">
      {ranked.map((c, i) => (
        <ScrollReveal key={c.id} delay={i * 0.06}>
          <GlassCard hover className="flex items-center gap-4 p-5">
            <span
              className={`w-8 text-center font-display text-xl font-bold ${
                i === 0 ? 'text-gold' : i < 3 ? 'text-neon' : 'text-slate-600'
              }`}
            >
              {i + 1}
            </span>
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold text-void"
              style={{ backgroundColor: c.avatarColor }}
            >
              {c.handle.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-semibold text-white">@{c.handle}</span>
                {c.feeFree && (
                  <span className="rounded-full border border-gold/50 bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold">
                    ✦ Fee-Free
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-sm text-slate-400">{c.topContribution}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-2xl font-bold text-neon">{c.mergedPRs}</p>
              <p className="text-xs text-slate-500">merged PRs</p>
            </div>
          </GlassCard>
        </ScrollReveal>
      ))}
    </div>
  );
}

export default function OpenSourceHub() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <ScrollReveal>
        <SectionHeading kicker="The Open Score" title="Read the Score. Join the Orchestra.">
          <p>
            The engine behind {BRAND.platform} is open to every musician. Study it, fork it, and
            submit a pull request — merged contributions waive the{' '}
            <span className="text-gold">$29/mo Section Player fee</span>.
          </p>
        </SectionHeading>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <RepoHeader />
      </ScrollReveal>

      <div className="mt-6">
        <ScrollReveal delay={0.15}>
          <FileList />
        </ScrollReveal>
      </div>

      <div className="mt-6">
        <ScrollReveal delay={0.2}>
          <ReadmePanel />
        </ScrollReveal>
      </div>

      <div className="mt-20">
        <ScrollReveal>
          <SectionHeading kicker="Contribute" title="Submit a Pull Request">
            <p>
              Every merged PR is a seat in the pit — and a waived Section Player subscription.
            </p>
          </SectionHeading>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <PullRequestForm />
        </ScrollReveal>
      </div>

      <div className="mt-20">
        <ScrollReveal>
          <SectionHeading kicker="The Pit" title="Contributor Leaderboard">
            <p>
              Ranked by merged pull requests. Gold <span className="text-gold">Fee-Free</span>{' '}
              badges mark contributors whose Section Player fee is permanently waived.
            </p>
          </SectionHeading>
        </ScrollReveal>
        <ContributorLeaderboard />
      </div>
    </div>
  );
}
