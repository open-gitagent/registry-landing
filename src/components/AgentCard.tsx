import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Agent } from "../lib/api";
import { CATEGORY_LABELS } from "../lib/api";

function getGitHubOgImage(repoUrl: string): string {
  const repoPath = repoUrl.replace("https://github.com/", "");
  return `https://opengraph.githubassets.com/1/${repoPath}`;
}

export function AgentCard({ agent, index = 0 }: { agent: Agent; index?: number }) {
  const repoShort = agent.repository.replace("https://github.com/", "");
  const ogImage = agent.banner ?? getGitHubOgImage(agent.repository);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="h-full"
    >
      <Link
        to={`/agent/${agent.author}/${agent.name}`}
        className="flex flex-col paper-card overflow-hidden hover:border-primary/40 transition-colors h-full"
      >
        {/* GitHub repo OG image */}
        <div className="border-b border-border overflow-hidden">
          <img
            src={ogImage}
            alt={agent.name}
            className="w-full h-40 object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          {/* Title */}
          <h3 className="text-base font-heading font-bold text-foreground relative z-10">
            {agent.name}
          </h3>

          {/* Subtitle: author/repo */}
          <p className="text-[11px] text-muted-foreground font-body mt-0.5 mb-3 relative z-10">
            {repoShort}
          </p>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed font-body line-clamp-2 relative z-10 mb-3">
            {agent.description}
          </p>

          {/* Tags */}
          {agent.tags.length > 0 && (
            <div className="flex gap-1.5 mb-4 relative z-10 overflow-hidden h-5">
              {agent.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-primary/80 font-body whitespace-nowrap shrink-0 border border-primary/15">
                  {tag}
                </span>
              ))}
              {agent.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground/50 shrink-0 py-0.5">+{agent.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom stats bar */}
          <div className="flex items-center gap-4 relative z-10 pt-3 border-t border-border/50">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-body">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: getCategoryColor(agent.category) }} />
              {CATEGORY_LABELS[agent.category] ?? agent.category}
            </span>
            <span className="text-[11px] text-muted-foreground font-body">{agent.license}</span>
            <span className="text-[11px] text-muted-foreground font-body">v{agent.version}</span>
            <span className="ml-auto text-muted-foreground/40">
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
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
