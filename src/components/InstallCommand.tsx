import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { track } from "../lib/analytics";

const ADAPTERS = [
  { label: "Claude Code", flag: "claude" },
  { label: "Lyzr", flag: "lyzr" },
  { label: "Nanobot", flag: "nanobot" },
  { label: "OpenClaw", flag: "openclaw" },
];

interface Props {
  repoUrl: string;
}

export function InstallCommand({ repoUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const [selectedAdapter, setSelectedAdapter] = useState(ADAPTERS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cmd = `npx @open-gitagent/gitagent@latest run -r ${repoUrl} -a ${selectedAdapter.flag}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    track('install_command_copied', { adapter: selectedAdapter.flag, repo: repoUrl });
  };

  return (
    <div className="code-block sketch-border border-primary/30 relative !overflow-visible">
      <div className="terminal-header">
        <span className="terminal-dot bg-primary/40" />
        <span className="terminal-dot bg-primary/30" />
        <span className="terminal-dot bg-primary/20" />
        <span className="ml-3 text-xs text-muted-foreground font-body">terminal</span>
        <button
          onClick={handleCopy}
          className="ml-auto text-muted-foreground/50 hover:text-foreground transition-colors"
          aria-label="Copy command"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs sm:text-sm leading-6 sm:leading-7 font-body break-all sm:break-normal">
        <span className="flex-1 cursor-pointer" onClick={handleCopy}>
          <span className="text-primary">$ </span>
          <span className="text-foreground font-medium">npx @open-gitagent/gitagent@latest run</span>
          <span className="text-muted-foreground"> -r </span>
          <span className="text-primary/70">{repoUrl}</span>
          <span className="text-muted-foreground"> -a </span>
          <span className="text-foreground font-medium">{selectedAdapter.flag}</span>
        </span>

        {/* Adapter dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium text-primary sketch-border rounded px-2 py-1 hover:bg-accent transition-colors font-body"
          >
            {selectedAdapter.label}
            <svg className="w-2.5 h-2.5" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path d="m1 1 4 4 4-4" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 bottom-full mb-1 z-50 bg-background border border-border rounded-md shadow-lg w-32">
              {ADAPTERS.map((a) => (
                <button
                  key={a.flag}
                  onClick={() => { setSelectedAdapter(a); setDropdownOpen(false); track('adapter_selected', { adapter: a.flag, label: a.label, repo: repoUrl }); }}
                  className={`block w-full text-left px-3 py-1.5 text-xs font-body hover:bg-accent transition-colors ${
                    a.flag === selectedAdapter.flag ? "text-primary font-medium" : "text-foreground"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border space-y-1">
        <div className="text-[11px] text-muted-foreground/60 font-body">
          <span className="text-muted-foreground/40">→</span> Clones the repo (cached at <code className="text-muted-foreground/50">~/.gitagent/cache/</code>)
        </div>
        <div className="text-[11px] text-muted-foreground/60 font-body">
          <span className="text-muted-foreground/40">→</span> Reads <code className="text-muted-foreground/50">agent.yaml</code> + <code className="text-muted-foreground/50">SOUL.md</code> + skills
        </div>
        <div className="text-[11px] text-muted-foreground/60 font-body">
          <span className="text-muted-foreground/40">→</span> Launches the agent with the selected adapter
        </div>
      </div>

      {copied && (
        <span className="absolute top-3 right-10 text-[10px] text-primary font-body animate-fade-in">
          Copied!
        </span>
      )}
    </div>
  );
}
