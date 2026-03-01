import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Copy, Check } from "lucide-react";

const EXAMPLE_METADATA = `{
  "name": "my-agent",
  "author": "your-github-username",
  "description": "A short description of what your agent does",
  "repository": "https://github.com/your-username/your-repo",
  "path": "",
  "version": "1.0.0",
  "category": "developer-tools",
  "tags": ["tag1", "tag2"],
  "license": "MIT",
  "model": "claude-sonnet-4-5-20250929",
  "adapters": ["claude-code", "system-prompt"],
  "icon": false,
  "banner": false
}`;

function CodeBlock({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="code-block sketch-border relative">
      {title && (
        <div className="terminal-header">
          <span className="terminal-dot bg-primary/40" />
          <span className="terminal-dot bg-primary/30" />
          <span className="terminal-dot bg-primary/20" />
          <span className="ml-3 text-xs text-muted-foreground font-body">{title}</span>
        </div>
      )}
      <button onClick={handleCopy} className="absolute top-3 right-3 text-muted-foreground/50 hover:text-foreground transition-colors">
        {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <pre className="text-xs text-foreground font-body whitespace-pre-wrap">{code}</pre>
    </div>
  );
}

const STEPS = [
  { num: "1", title: "Fork the registry repo", content: <p className="text-xs text-muted-foreground font-body">Fork <a href="https://github.com/open-gitagent/registry" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">open-gitagent/registry</a> on GitHub.</p> },
  { num: "2", title: "Create your agent folder", content: <><p className="text-xs text-muted-foreground font-body mb-2">Create a folder: <code className="text-primary bg-card/80 px-1.5 py-0.5 rounded text-[11px]">agents/&lt;github-username&gt;__&lt;agent-name&gt;/</code></p><CodeBlock code="mkdir agents/your-username__my-agent" /></> },
  { num: "3", title: "Add metadata.json", content: <><p className="text-xs text-muted-foreground font-body mb-2">Describe your agent:</p><CodeBlock code={EXAMPLE_METADATA} title="metadata.json" /></> },
  { num: "4", title: "Add README.md and optional images", content: <p className="text-xs text-muted-foreground font-body">Write a <strong className="text-foreground">README.md</strong>. Optionally add <strong className="text-foreground">icon.png</strong> (256x256) and <strong className="text-foreground">banner.png</strong> (1200x630) for social sharing.</p> },
  { num: "5", title: "Open a Pull Request", content: <p className="text-xs text-muted-foreground font-body">Push your branch and open a PR. CI validates your submission — checks schema, clones your repo, verifies <code className="text-primary bg-card/80 px-1 py-0.5 rounded text-[11px]">agent.yaml</code> and <code className="text-primary bg-card/80 px-1 py-0.5 rounded text-[11px]">SOUL.md</code>.</p> },
];

export default function SubmitPage() {
  return (
    <section className="pt-24 pb-20 px-6">
      <div className="mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground mb-2">Submit Your Agent</h1>
          <p className="text-sm text-muted-foreground font-body">Submissions are reviewed via PR — GitHub is the source of truth.</p>
        </motion.div>

        {/* Requirements */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="paper-card p-4 mt-8">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3 relative z-10">Requirements</h3>
          <ul className="space-y-2 relative z-10">
            {["Public GitHub repository", "Valid agent.yaml at repo root or specified path", "SOUL.md file present", "Follows the gitagent standard"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground font-body">
                <span className="text-primary mt-0.5">✓</span> {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Steps */}
        <div className="mt-10 space-y-8">
          {STEPS.map((step, i) => (
            <motion.div key={step.num} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex gap-4">
              <div className="w-7 h-7 rounded-full sketch-border flex items-center justify-center font-heading text-xs font-bold text-primary shrink-0 mt-0.5">
                {step.num}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-heading font-semibold text-foreground mb-2">{step.title}</h3>
                {step.content}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
          <a
            href="https://github.com/open-gitagent/registry/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-md transition-opacity hover:opacity-90 font-body sketch-border border-primary"
          >
            Fork & Submit <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-[10px] text-muted-foreground mt-3 font-body">
            Full guide: <a href="https://github.com/open-gitagent/registry/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CONTRIBUTING.md</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
