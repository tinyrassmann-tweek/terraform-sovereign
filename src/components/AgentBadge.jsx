import { AI_AGENTS } from '../data/constants.js';

export default function AgentBadge({ agentId }) {
  const agent = AI_AGENTS.find((a) => a.id === agentId);
  if (!agent) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs font-medium text-neon">
      <span aria-hidden="true">{agent.icon}</span>
      {agent.name}
    </span>
  );
}
