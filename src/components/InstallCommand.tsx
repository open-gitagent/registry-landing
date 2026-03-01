import { useState } from "react";
import { WindowDots } from "./Icons";

interface Props {
  repoUrl: string;
  path?: string;
  adapters: string[];
}

const ADAPTER_LABELS: Record<string, string> = {
  "claude-code": "Claude Code",
  openai: "OpenAI Agents SDK",
  crewai: "CrewAI",
  "system-prompt": "System Prompt",
  openclaw: "OpenClaw",
  nanobot: "Nanobot",
  lyzr: "Lyzr",
  github: "GitHub Models",
  git: "Git",
};

const ADAPTER_DESCRIPTIONS: Record<string, string> = {
  "claude-code": "Export to CLAUDE.md and skills for Claude Code projects.",
  openai: "Generate OpenAI Agents SDK-compatible agent definitions.",
  crewai: "Export as CrewAI agent and task configurations.",
  "system-prompt": "Extract a single system prompt for any LLM.",
  openclaw: "Export for the OpenClaw agent framework.",
  nanobot: "Generate Nanobot-compatible configuration.",
  lyzr: "Export as a Lyzr agent definition.",
  github: "Export for GitHub Models integration.",
  git: "Export as a portable git-native agent.",
};

export function InstallCommand({ repoUrl, path, adapters }: Props) {
  const [copied, setCopied] = useState(false);

  const repoName = repoUrl.split("/").pop() ?? "agent";
  const cdPath = path ? `${repoName}/${path}` : repoName;

  const commands = [
    `npm install -g gitagent`,
    `git clone ${repoUrl}`,
    `cd ${cdPath}`,
    `gitagent validate`,
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(commands.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Quick Start Terminal */}
      <div className="terminal" style={{ maxWidth: 680 }}>
        <div className="terminal-bar">
          <WindowDots />
          <span className="terminal-title">terminal</span>
        </div>
        <div className="terminal-body">
          <button
            className={`copy-btn${copied ? " copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <pre>
            {"\n"}
            <div className="prompt-line">
              <span className="prompt">$ </span>npm install -g gitagent
              {"          "}
              <span className="comment"># Install the CLI</span>
            </div>
            <div className="prompt-line">
              <span className="prompt">$ </span>git clone {repoUrl}
            </div>
            <div className="prompt-line">
              <span className="prompt">$ </span>cd {cdPath}
              {"                              "}
            </div>
            <div className="prompt-line">
              <span className="prompt">$ </span>gitagent validate
              {"                 "}
              <span className="comment"># Check it's valid</span>
            </div>
            <div className="prompt-line">
              <span className="prompt">$ </span>gitagent export --format
              claude-code{"  "}
              <span className="comment"># Export for Claude</span>
            </div>
          </pre>
        </div>
      </div>

      {/* Export Grid */}
      {adapters.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: 20 }}>
            Export Anywhere
          </h2>
          <div className="export-grid">
            {adapters.map((adapter) => (
              <div key={adapter} className="export-card">
                <h3>{ADAPTER_LABELS[adapter] ?? adapter}</h3>
                <p>
                  {ADAPTER_DESCRIPTIONS[adapter] ??
                    `Export for the ${adapter} framework.`}
                </p>
                <div className="mini-terminal">
                  $ gitagent export --format {adapter}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
