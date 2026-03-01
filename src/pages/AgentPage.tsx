import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink, GitBranch, Shield } from "lucide-react";
import { useAgents } from "../hooks/useAgents";
import { fetchReadme, CATEGORY_LABELS } from "../lib/api";
import { InstallCommand } from "../components/InstallCommand";
import { GeneratedBanner } from "../components/GeneratedBanner";

function getInitials(name: string) {
  return name.split("-").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
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
      if (ogMeta) ogMeta.content = "/og-image.png";
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

  return (
    <section className="pt-24 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-body mb-6">
          <ArrowLeft className="w-3 h-3" /> Back to browse
        </Link>

        {/* Banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg overflow-hidden border border-border mb-6" style={{ boxShadow: "2px 3px 0px hsl(var(--border))" }}>
          {agent.banner ? (
            <img src={agent.banner} alt={`${agent.name} banner`} className="w-full" />
          ) : (
            <GeneratedBanner name={agent.name} author={agent.author} repo={agent.repository} category={agent.category} description={agent.description} />
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
          {/* Main */}
          <div className="min-w-0">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-lg shrink-0 overflow-hidden">
                {agent.icon ? (
                  <img src={agent.icon} alt={agent.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-heading text-lg font-bold">
                    {getInitials(agent.name)}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">{agent.name}</h1>
                <p className="text-xs text-muted-foreground font-body mt-0.5">by {agent.author}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">{agent.description}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="inline-flex items-center gap-1.5 text-[10px] sketch-border rounded px-2 py-1 text-primary font-body font-medium">
                {CATEGORY_LABELS[agent.category] ?? agent.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] sketch-border rounded px-2 py-1 text-muted-foreground font-body">
                <GitBranch className="w-2.5 h-2.5" /> v{agent.version}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] sketch-border rounded px-2 py-1 text-muted-foreground font-body">
                <Shield className="w-2.5 h-2.5" /> {agent.license}
              </span>
            </div>

            {/* Install command */}
            <h2 className="text-base font-heading font-semibold text-foreground mb-3">Run this Agent</h2>
            <InstallCommand repoUrl={agent.repository} />

            {/* Export */}
            <div className="mt-8">
              <h2 className="text-base font-heading font-semibold text-foreground mb-3">Export Anywhere</h2>
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
            <div className="mt-10">
              <h2 className="text-base font-heading font-semibold text-foreground mb-4">Documentation</h2>
              {readmeLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-3 w-3/4 bg-accent/30 rounded" />
                  <div className="h-3 w-full bg-accent/30 rounded" />
                  <div className="h-3 w-2/3 bg-accent/30 rounded" />
                </div>
              ) : readme ? (
                <div className="readme-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-body">No documentation available.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20">
            <div className="paper-card p-4 space-y-5">
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-body block mb-2">Model</span>
                <span className="text-xs text-foreground font-body">{agent.model}</span>
              </div>

              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-body block mb-2">Adapters</span>
                <div className="flex flex-wrap gap-1">
                  {agent.adapters.map((a) => (
                    <span key={a} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/50 text-muted-foreground font-body">{a}</span>
                  ))}
                </div>
              </div>

              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-body block mb-2">Tags</span>
                <div className="flex flex-wrap gap-1">
                  {agent.tags.map((tag) => (
                    <Link key={tag} to={`/browse?q=${encodeURIComponent(tag)}`} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/50 text-muted-foreground hover:text-primary font-body transition-colors">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-body block mb-2">Added</span>
                <span className="text-xs text-muted-foreground font-body">{agent.added_at}</span>
              </div>

              <a
                href={repoPath}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full sketch-border rounded-md px-3 py-2 text-xs font-body text-foreground hover:bg-accent transition-colors relative z-10"
              >
                <ExternalLink className="w-3 h-3" /> View on GitHub
              </a>
            </div>
          </aside>
        </motion.div>
      </div>
    </section>
  );
}
