import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAgents } from "../hooks/useAgents";
import { fetchReadme, CATEGORY_LABELS } from "../lib/api";
import { InstallCommand } from "../components/InstallCommand";
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  TagIcon,
  GitBranchIcon,
  ShieldIcon,
  CpuIcon,
} from "../components/Icons";

function getInitials(name: string) {
  return name
    .split("-")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function AgentPage() {
  const { author, name } = useParams<{ author: string; name: string }>();
  const { agents, loading: agentsLoading } = useAgents();
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(true);

  const agent = useMemo(
    () => agents.find((a) => a.author === author && a.name === name),
    [agents, author, name]
  );

  useEffect(() => {
    if (!agent) return;
    setReadmeLoading(true);
    fetchReadme(agent.readme)
      .then(setReadme)
      .catch(() => setReadme(null))
      .finally(() => setReadmeLoading(false));
  }, [agent]);

  // Set OG meta for agent with banner
  useEffect(() => {
    if (!agent) return;
    document.title = `${agent.name} by ${agent.author} — gitagent registry`;

    // Update OG image to agent banner if available
    let ogMeta = document.querySelector(
      'meta[property="og:image"]'
    ) as HTMLMetaElement | null;
    if (agent.banner && ogMeta) {
      ogMeta.content = agent.banner;
    }

    return () => {
      document.title = "gitagent registry — discover and share AI agents";
      if (ogMeta) ogMeta.content = "/og-image.png";
    };
  }, [agent]);

  if (agentsLoading) {
    return (
      <section style={{ paddingTop: 100 }}>
        <div className="container">
          <div className="skeleton-line w-40" />
          <div className="skeleton-line w-60" style={{ marginTop: 32 }} />
          <div className="skeleton-line w-full" style={{ marginTop: 16 }} />
        </div>
      </section>
    );
  }

  if (!agent) {
    return (
      <section style={{ paddingTop: 100 }}>
        <div className="container" style={{ textAlign: "center", padding: "80px 0" }}>
          <h1>Agent not found</h1>
          <p className="text-muted" style={{ margin: "8px auto" }}>
            No agent found for {author}/{name}
          </p>
          <Link to="/browse" className="back-link" style={{ marginTop: 24, justifyContent: "center" }}>
            <ArrowLeftIcon /> Back to browse
          </Link>
        </div>
      </section>
    );
  }

  const repoPath = agent.path
    ? `${agent.repository}/tree/main/${agent.path}`
    : agent.repository;

  const cloneCmd = agent.path
    ? `git clone ${agent.repository} && cd ${agent.repository.split("/").pop()}/${agent.path}`
    : `git clone ${agent.repository}`;

  const installTabs = [
    { label: "git clone", command: cloneCmd },
    {
      label: "gitagent run",
      command: `gitagent run -r ${agent.repository}${agent.path ? ` -p ${agent.path}` : ""}`,
    },
  ];

  return (
    <section style={{ paddingTop: 100 }}>
      <div className="container">
        <Link to="/browse" className="back-link">
          <ArrowLeftIcon /> Back to browse
        </Link>

        {/* Banner */}
        {agent.banner && (
          <div className="agent-detail-banner">
            <img src={agent.banner} alt={`${agent.name} banner`} />
          </div>
        )}

        <div className="agent-detail">
          {/* Main */}
          <div className="agent-detail-main">
            <div className="agent-detail-header">
              <div className="agent-detail-icon">
                {agent.icon ? (
                  <img src={agent.icon} alt={agent.name} />
                ) : (
                  <div className="agent-detail-icon-initials">
                    {getInitials(agent.name)}
                  </div>
                )}
              </div>
              <div className="agent-detail-title">
                <h1>{agent.name}</h1>
                <div className="agent-detail-author">by {agent.author}</div>
              </div>
            </div>

            <p style={{ marginBottom: 16, lineHeight: 1.7, maxWidth: "none" }}>
              {agent.description}
            </p>

            {/* Badges */}
            <div className="agent-detail-badges">
              <span className="tag">
                <span style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><TagIcon /></svg>
                </span>
                {CATEGORY_LABELS[agent.category] ?? agent.category}
              </span>
              <span className="tag muted">
                <span style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><GitBranchIcon /></svg>
                </span>
                v{agent.version}
              </span>
              <span className="tag muted">
                <span style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ShieldIcon /></svg>
                </span>
                {agent.license}
              </span>
            </div>

            {/* Install */}
            <h2 style={{ fontSize: "1.2rem", marginBottom: 16 }}>Install</h2>
            <InstallCommand tabs={installTabs} />

            {/* README */}
            <div className="readme-content">
              <h2 style={{ fontSize: "1.2rem", marginBottom: 16, borderBottom: "none", paddingBottom: 0 }}>
                Documentation
              </h2>
              {readmeLoading ? (
                <div>
                  <div className="skeleton-line w-80" />
                  <div className="skeleton-line w-full" />
                  <div className="skeleton-line w-60" />
                </div>
              ) : readme ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {readme}
                </ReactMarkdown>
              ) : (
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  No documentation available.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="agent-sidebar">
            <div className="agent-sidebar-card">
              <div className="sidebar-section">
                <div className="sidebar-label">Model</div>
                <div className="sidebar-value" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><CpuIcon /></svg>
                  {agent.model}
                </div>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-label">Adapters</div>
                <div className="sidebar-tags">
                  {agent.adapters.map((a) => (
                    <span key={a} className="tag muted">{a}</span>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-label">Tags</div>
                <div className="sidebar-tags">
                  {agent.tags.map((tag) => (
                    <Link key={tag} to={`/browse?q=${encodeURIComponent(tag)}`} className="tag muted">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <div className="sidebar-label">Added</div>
                <div className="sidebar-value">{agent.added_at}</div>
              </div>

              <a
                href={repoPath}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-btn"
              >
                <ExternalLinkIcon />
                View on GitHub
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
