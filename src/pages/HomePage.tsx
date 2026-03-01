import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Code, Database, Server, Shield, Lock, FileText, Wrench, Search, Zap, DollarSign, MessageCircle, Palette, GraduationCap, Package } from "lucide-react";
import { useAgents } from "../hooks/useAgents";
import { CATEGORY_LABELS } from "../lib/api";
import { AgentGrid } from "../components/AgentGrid";
import { SearchBar } from "../components/SearchBar";
import { DiscordBanner } from "../components/DiscordBanner";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "developer-tools": <Code className="w-4 h-4" />,
  "data-engineering": <Database className="w-4 h-4" />,
  devops: <Server className="w-4 h-4" />,
  compliance: <Shield className="w-4 h-4" />,
  security: <Lock className="w-4 h-4" />,
  documentation: <FileText className="w-4 h-4" />,
  testing: <Wrench className="w-4 h-4" />,
  research: <Search className="w-4 h-4" />,
  productivity: <Zap className="w-4 h-4" />,
  finance: <DollarSign className="w-4 h-4" />,
  "customer-support": <MessageCircle className="w-4 h-4" />,
  creative: <Palette className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
  other: <Package className="w-4 h-4" />,
};

export default function HomePage() {
  const { agents, total, loading } = useAgents();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const activeCategories = useMemo(() => {
    const cats = new Set(agents.map((a) => a.category));
    return Array.from(cats).sort();
  }, [agents]);

  const contributors = useMemo(() => new Set(agents.map((a) => a.author)).size, [agents]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) navigate(`/browse?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-20 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 sketch-border rounded-full px-3 py-1 text-xs text-muted-foreground mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-primary font-medium">open-gitagent/registry</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold leading-tight tracking-tight text-foreground mb-4">
              The Agent <span className="text-primary">Registry</span>
            </h1>

            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 font-body leading-relaxed">
              Discover, share, and install git-native AI agents built with the gitagent standard.
            </p>

            <SearchBar value={query} onChange={handleSearch} placeholder="Search agents by name, tag, or category..." />

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-8 font-body text-xs">
              <div>
                <span className="font-heading font-bold text-base text-foreground">{loading ? "–" : total}</span>
                <span className="text-muted-foreground ml-1.5">agents</span>
              </div>
              <span className="w-px h-4 bg-border" />
              <div>
                <span className="font-heading font-bold text-base text-foreground">{loading ? "–" : activeCategories.length}</span>
                <span className="text-muted-foreground ml-1.5">categories</span>
              </div>
              <span className="w-px h-4 bg-border" />
              <div>
                <span className="font-heading font-bold text-base text-foreground">{loading ? "–" : contributors}</span>
                <span className="text-muted-foreground ml-1.5">contributors</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 px-6 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-foreground">Featured Agents</h2>
            <Link to="/browse" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
          <AgentGrid agents={agents.slice(0, 6)} loading={loading} />
        </div>
      </section>

      {/* Categories */}
      {activeCategories.length > 0 && (
        <section className="py-16 px-6 border-t border-border">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
              <h2 className="text-xl font-bold text-foreground">Browse by Category</h2>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeCategories.map((cat, i) => {
                const count = agents.filter((a) => a.category === cat).length;
                return (
                  <motion.div key={cat} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                    <Link to={`/browse?category=${cat}`} className="flex items-center gap-3 paper-card p-3 hover:border-primary/40 transition-colors">
                      <span className="text-primary relative z-10">{CATEGORY_ICONS[cat] ?? <Package className="w-4 h-4" />}</span>
                      <div className="relative z-10">
                        <span className="text-xs font-heading font-semibold text-foreground block">{CATEGORY_LABELS[cat] ?? cat}</span>
                        <span className="text-[10px] text-muted-foreground font-body">{count} {count === 1 ? "agent" : "agents"}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Submit CTA */}
      <section className="py-20 px-6 border-t border-border">
        <div className="mx-auto max-w-6xl text-center">
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl font-bold text-foreground mb-2">Share Your Agent</h2>
            <p className="text-sm text-muted-foreground font-body mb-6 max-w-md mx-auto">
              Built an agent with gitagent? Submit it to the registry and share it with the community.
            </p>
            <Link to="/submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-md transition-opacity hover:opacity-90 font-body sketch-border border-primary">
              Submit Your Agent <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </section>

      <DiscordBanner />
    </div>
  );
}
