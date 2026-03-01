import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink, CircleDot } from "lucide-react";
import type { Agent } from "../lib/api";
import { CATEGORY_LABELS } from "../lib/api";
import { track } from "../lib/analytics";

// Priority: banner (icon) > custom social preview > GitHub avatar
function getProfileImage(agent: Agent, gh: Agent["github"]): string {
  // 1. Agent's custom icon
  if (agent.icon) return agent.icon;
  // 2. Custom social preview (repository-images, not auto-generated opengraph)
  const sp = gh?.social_preview;
  if (sp && sp.includes("repository-images.githubusercontent.com")) return sp;
  // 3. GitHub avatar
  return gh?.avatar ?? `https://github.com/${agent.author}.png?size=40`;
}

export function AgentCard({ agent, index = 0 }: { agent: Agent; index?: number }) {
  const gh = agent.github;

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
        onClick={() => track('agent_card_clicked', { name: agent.name, author: agent.author, category: agent.category })}
        className="flex flex-col paper-card overflow-hidden hover:border-primary/40 transition-colors h-full"
      >
        {/* Top section: GitHub-style repo preview */}
        <div className="p-4 pb-3 border-b border-border/50 relative z-10">
          {/* Profile image + repo name */}
          <div className="flex items-center gap-3 mb-2">
            <img
              src={getProfileImage(agent, gh)}
              alt={agent.author}
              className="w-8 h-8 rounded-full shrink-0 object-cover"
              loading="lazy"
            />
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground font-body truncate block">{agent.author} /</span>
              <span className="text-sm font-heading font-bold text-primary truncate block">{agent.name}</span>
            </div>
          </div>

          {/* Description from GitHub */}
          <p className="text-[11px] text-muted-foreground font-body leading-relaxed line-clamp-2 mb-3">
            {gh?.description ?? agent.description}
          </p>

          {/* Stats row: stars, forks, issues, language */}
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-body">
            {gh && (
              <>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" /> {gh.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3 h-3" /> {gh.forks}
                </span>
                <span className="flex items-center gap-1">
                  <CircleDot className="w-3 h-3" /> {gh.issues}
                </span>
                {gh.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: getCategoryColor(agent.category) }} />
                    {gh.language}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom section: agent details */}
        <div className="flex flex-col flex-1 p-4 pt-3">
          {/* Tags */}
          {agent.tags.length > 0 && (
            <div className="flex gap-1.5 mb-3 overflow-hidden h-5">
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

          {/* Footer stats */}
          <div className="flex items-center gap-4 pt-3 border-t border-border/50">
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
