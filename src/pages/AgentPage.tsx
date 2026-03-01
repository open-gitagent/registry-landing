import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink, GitBranch, Shield, BookOpen, Star, GitFork, CircleDot } from "lucide-react";
import { useAgents } from "../hooks/useAgents";
import { fetchReadme, CATEGORY_LABELS } from "../lib/api";
import { InstallCommand } from "../components/InstallCommand";

function getInitials(name: string) {
  return name.split("-").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "developer-tools": "#7A5C4F",
    "data-engineering": "#6B8E7B",
    devops: "#5B7A9E",
    compliance: "#9E7B5B",
    security: "#8B5E5E",
    documentation: "#5E7A8B",
    testing: "#7A5E8B",
    research: "#5E8B7A",
    productivity: "#8B7A5E",
    finance: "#6B5B4E",
    "customer-support": "#5E6B8B",
    creative: "#8B5E7A",
    education: "#5E8B6B",
    other: "#7A7A7A",
  };
  return colors[category] ?? "#7A7A7A";
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
    fetchReadme(agent.readme).then(setReadme).catch(() => setReadme(null)).finally(() => setReadmeLoading(false));
  }, [agent]);

  useEffect(() => {
    if (!agent) return;
    document.title = `${agent.name} by ${agent.author} — gitagent registry`;
    const ogMeta = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
    if (agent.banner && ogMeta) ogMeta.content = agent.banner;
    return () => {
      document.title = "gitagent registry — discover and share AI agents";
      if (ogMeta) ogMeta.content = "/api/og-home";
    };
  }, [agent]);

  if (agentsLoading) {
    return (
      <section className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-3 w-24 bg-accent/50 rounded mb-8" />
          <div className="h-6 w-48 bg-accent/50 rounded mb-3" />
          <div className="h-3 w-96 bg-accent/30 rounded" />
        </div>
      </section>
    );
  }

  if (!agent) {
    return (
      <section className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-6xl text-center py-20">
          <h1 className="text-2xl font-bold text-foreground">Agent not found</h1>
          <p className="text-sm text-muted-foreground mt-2 font-body">No agent found for {author}/{name}</p>
          <Link to="/browse" className="inline-flex items-center gap-1.5 text-xs text-primary mt-4 font-body hover:underline">
            <ArrowLeft className="w-3 h-3" /> Back to browse
          </Link>
        </div>
      </section>
    );
  }

  const repoPath = agent.path ? `${agent.repository}/tree/main/${agent.path}` : agent.repository;
  const repoShort = agent.repository.replace("https://github.com/", "");
  const gh = agent.github;

  return (
    <section className="pt-24 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-body mb-6">
          <ArrowLeft className="w-3 h-3" /> Back to browse
        </Link>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {/* ===== Repo header ===== */}
          <div className="paper-card p-6 mb-6">
            {/* Row 1: icon + name + badges */}
            <div className="flex items-center gap-4 mb-3 relative z-10">
              <div className="w-10 h-10 rounded-md shrink-0 overflow-hidden">
                {agent.icon ? (
                  <img src={agent.icon} alt={agent.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-heading text-sm font-bold">
                    {getInitials(agent.name)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 min-w-0 flex-wrap">
                <h1 className="font-heading text-xl font-bold text-primary">{agent.author} / {agent.name}</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground font-body">Public</span>
              </div>
            </div>

            {/* Row 2: description */}
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 relative z-10">
              {agent.description}
            </p>

            {/* Row 3: link to repo + stats */}
            <div className="flex items-center gap-5 relative z-10">
              <a
                href={repoPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-body hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> github.com/{repoShort}
              </a>
              {gh && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {gh.stars}</span>
                  <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {gh.forks}</span>
                  <span className="flex items-center gap-1"><CircleDot className="w-3 h-3" /> {gh.issues}</span>
                </div>
              )}
            </div>

            {/* Row 4: tags */}
            {agent.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4 relative z-10">
                {agent.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/browse?q=${encodeURIComponent(tag)}`}
                    className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/8 text-primary/80 font-body border border-primary/15 hover:bg-primary/15 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Row 5: stats bar */}
            <div className="flex items-center gap-5 mt-5 pt-4 border-t border-border/50 relative z-10">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                <span className="w-3 h-3 rounded-full" style={{ background: getCategoryColor(agent.category) }} />
                {CATEGORY_LABELS[agent.category] ?? agent.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                <Shield className="w-3 h-3" /> {agent.license}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                <GitBranch className="w-3 h-3" /> v{agent.version}
              </span>
              <span className="text-xs text-muted-foreground font-body">
                {agent.model}
              </span>
            </div>
          </div>

          {/* ===== Two column: content + sidebar ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
            {/* Main */}
            <div className="min-w-0 space-y-6">
              {/* Run command */}
              <div>
                <h2 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-primary">$</span> Run this Agent
                </h2>
                <InstallCommand repoUrl={agent.repository} />
              </div>

              {/* Export */}
              <div>
                <h2 className="text-sm font-heading font-semibold text-foreground mb-3">Export Anywhere</h2>
                <div className="space-y-2">
                  {agent.adapters.map((adapter, i) => (
                    <motion.div
                      key={adapter}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 paper-card p-3"
                    >
                      <span className="text-xs font-heading font-semibold text-foreground relative z-10">{adapter}</span>
                      <code className="text-[10px] sm:text-xs text-primary shrink-0 font-body relative z-10">$ gitagent export -f {adapter}</code>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* README */}
              <div>
                <h2 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary" /> README
                </h2>
                <div className="paper-card p-5">
                  {readmeLoading ? (
                    <div className="animate-pulse space-y-2 relative z-10">
                      <div className="h-3 w-3/4 bg-accent/30 rounded" />
                      <div className="h-3 w-full bg-accent/30 rounded" />
                      <div className="h-3 w-2/3 bg-accent/30 rounded" />
                    </div>
                  ) : readme ? (
                    <div className="readme-content relative z-10">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground font-body relative z-10">No documentation available.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar — About */}
            <aside className="lg:sticky lg:top-20 space-y-4">
              {/* About card */}
              <div className="paper-card p-4">
                <h3 className="text-xs font-heading font-semibold text-foreground mb-3 relative z-10">About</h3>
                <p className="text-xs text-muted-foreground font-body leading-relaxed mb-4 relative z-10">
                  {agent.description}
                </p>
                <div className="space-y-3 relative z-10">
                  <a href={repoPath} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground font-body hover:text-primary transition-colors">
                    <ExternalLink className="w-3 h-3 shrink-0" /> {repoShort}
                  </a>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                    <Shield className="w-3 h-3 shrink-0" /> {agent.license} license
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                    <GitBranch className="w-3 h-3 shrink-0" /> v{agent.version}
                  </div>
                </div>
              </div>

              {/* Adapters */}
              <div className="paper-card p-4">
                <h3 className="text-xs font-heading font-semibold text-foreground mb-3 relative z-10">Adapters</h3>
                <div className="flex flex-wrap gap-1.5 relative z-10">
                  {agent.adapters.map((a) => (
                    <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/50 text-muted-foreground font-body">{a}</span>
                  ))}
                </div>
              </div>

              {/* Model */}
              <div className="paper-card p-4">
                <h3 className="text-xs font-heading font-semibold text-foreground mb-3 relative z-10">Model</h3>
                <span className="text-xs text-muted-foreground font-body relative z-10">{agent.model}</span>
              </div>

              {/* Added */}
              <div className="paper-card p-4">
                <h3 className="text-xs font-heading font-semibold text-foreground mb-2 relative z-10">Added</h3>
                <span className="text-xs text-muted-foreground font-body relative z-10">{agent.added_at}</span>
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
