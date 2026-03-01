import type { Agent } from "../lib/api";
import { AgentCard } from "./AgentCard";

interface Props {
  agents: Agent[];
  loading?: boolean;
  emptyMessage?: string;
}

export function AgentGrid({
  agents,
  loading,
  emptyMessage = "No agents found",
}: Props) {
  if (loading) {
    return (
      <div className="agent-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="agent-skeleton">
            <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <div className="skeleton-avatar" />
              <div style={{ flex: 1 }}>
                <div className="skeleton-line w-60" />
                <div className="skeleton-line w-40" />
              </div>
            </div>
            <div className="skeleton-line w-full" />
            <div className="skeleton-line w-80" />
          </div>
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div className="agent-grid">
      {agents.map((agent) => (
        <AgentCard key={`${agent.author}/${agent.name}`} agent={agent} />
      ))}
    </div>
  );
}
