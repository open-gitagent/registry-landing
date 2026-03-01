import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Agent } from "../lib/api";
import { CATEGORY_LABELS } from "../lib/api";
import { GeneratedBanner } from "./GeneratedBanner";

function getInitials(name: string) {
  return name.split("-").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

export function AgentCard({ agent, index = 0 }: { agent: Agent; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
    >
      <Link
        to={`/agent/${agent.author}/${agent.name}`}
        className="block paper-card p-4 hover:border-primary/40 transition-colors"
      >
        <div className="rounded overflow-hidden mb-3 -mt-1 -mx-1 border border-border">
          {agent.banner ? (
            <img src={agent.banner} alt="" className="w-full h-32 object-cover" loading="lazy" />
          ) : (
            <div className="h-32">
              <GeneratedBanner name={agent.name} author={agent.author} repo={agent.repository} />
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 mb-2 relative z-10">
          <div className="w-9 h-9 rounded-md shrink-0 overflow-hidden">
            {agent.icon ? (
              <img src={agent.icon} alt={agent.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-heading text-xs font-bold">
                {getInitials(agent.name)}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <span className="text-sm font-heading font-semibold text-foreground block truncate">{agent.name}</span>
            <span className="text-[10px] text-muted-foreground font-body">{agent.author}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed font-body line-clamp-2 relative z-10 mb-3">
          {agent.description}
        </p>

        <div className="flex items-center justify-between relative z-10">
          <span className="text-[10px] sketch-border rounded px-2 py-0.5 text-primary font-body font-medium">
            {CATEGORY_LABELS[agent.category] ?? agent.category}
          </span>
          <span className="text-[10px] text-muted-foreground font-body">v{agent.version}</span>
        </div>

        {agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 relative z-10">
            {agent.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/50 text-muted-foreground font-body">{tag}</span>
            ))}
            {agent.tags.length > 3 && <span className="text-[10px] text-muted-foreground/50">+{agent.tags.length - 3}</span>}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
