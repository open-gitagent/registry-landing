import type { Agent } from "../lib/api";
import { AgentCard } from "./AgentCard";

interface Props {
  agents: Agent[];
  loading?: boolean;
  emptyMessage?: string;
}

export function AgentGrid({ agents, loading, emptyMessage = "No agents found" }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="paper-card p-4 animate-pulse">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-md bg-accent/50" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 bg-accent/50 rounded" />
                <div className="h-2 w-16 bg-accent/30 rounded" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 w-full bg-accent/30 rounded" />
              <div className="h-2.5 w-3/4 bg-accent/30 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return <p className="text-center text-sm text-muted-foreground py-16 font-body">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {agents.map((agent, i) => (
        <AgentCard key={`${agent.author}/${agent.name}`} agent={agent} index={i} />
      ))}
    </div>
  );
}
