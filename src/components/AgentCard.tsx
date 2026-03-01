import { Link } from "react-router-dom";
import type { Agent } from "../lib/api";
import { CATEGORY_LABELS } from "../lib/api";

function getInitials(name: string) {
  return name
    .split("-")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function AgentCard({ agent }: { agent: Agent }) {
  const hasBanner = !!agent.banner;

  return (
    <Link
      to={`/agent/${agent.author}/${agent.name}`}
      className={`agent-card${hasBanner ? " has-banner" : ""}`}
    >
      {hasBanner && (
        <div className="agent-card-banner">
          <img src={agent.banner!} alt="" loading="lazy" />
        </div>
      )}
      <div className={hasBanner ? "agent-card-content" : undefined}>
        <div className="agent-card-header">
          <div className="agent-card-avatar">
            {agent.icon ? (
              <img src={agent.icon} alt={agent.name} loading="lazy" />
            ) : (
              <div className="agent-card-avatar-initials">
                {getInitials(agent.name)}
              </div>
            )}
          </div>
          <div className="agent-card-meta">
            <div className="agent-card-name">{agent.name}</div>
            <div className="agent-card-author">{agent.author}</div>
          </div>
        </div>

        <p className="agent-card-desc">{agent.description}</p>

        <div className="agent-card-footer">
          <span className="tag">
            {CATEGORY_LABELS[agent.category] ?? agent.category}
          </span>
          <span className="agent-card-version">v{agent.version}</span>
        </div>

        {agent.tags.length > 0 && (
          <div className="agent-card-tags">
            {agent.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag muted">
                {tag}
              </span>
            ))}
            {agent.tags.length > 4 && (
              <span
                style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}
              >
                +{agent.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
