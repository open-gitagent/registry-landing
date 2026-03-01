import { useState } from "react";
import { WindowDots, ExternalLinkIcon } from "../components/Icons";

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal">
      {title && (
        <div className="terminal-bar">
          <WindowDots />
          <span className="terminal-title">{title}</span>
        </div>
      )}
      <div className="terminal-body">
        <button
          className={`copy-btn${copied ? " copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? "copied!" : "copy"}
        </button>
        <pre>{code}</pre>
      </div>
    </div>
  );
}

const STEPS = [
  {
    num: "1",
    title: "Fork the registry repo",
    content: (
      <p>
        Fork{" "}
        <a
          href="https://github.com/open-gitagent/registry"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--green)" }}
        >
          open-gitagent/registry
        </a>{" "}
        on GitHub.
      </p>
    ),
  },
  {
    num: "2",
    title: "Create your agent folder",
    content: (
      <>
        <p>
          Create a folder using the naming convention{" "}
          <code style={{ color: "var(--amber)", background: "var(--bg-terminal)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85em" }}>
            agents/&lt;github-username&gt;__&lt;agent-name&gt;/
          </code>
        </p>
        <div style={{ marginTop: 12 }}>
          <CodeBlock code="mkdir agents/your-username__my-agent" />
        </div>
      </>
    ),
  },
  {
    num: "3",
    title: "Add metadata.json",
    content: (
      <>
        <p style={{ marginBottom: 12 }}>
          Add a <code style={{ color: "var(--amber)", background: "var(--bg-terminal)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85em" }}>metadata.json</code> file
          describing your agent.
        </p>
        <CodeBlock code={EXAMPLE_METADATA} title="metadata.json" />
      </>
    ),
  },
  {
    num: "4",
    title: "Add README.md and optional images",
    content: (
      <p>
        Write a <strong>README.md</strong> describing what your agent does. Optionally add{" "}
        <strong>icon.png</strong> (256x256) for the card avatar and{" "}
        <strong>banner.png</strong> (1200x630) for the social sharing / OG image displayed
        when your agent's page is shared on Twitter, Slack, or Discord.
      </p>
    ),
  },
  {
    num: "5",
    title: "Open a Pull Request",
    content: (
      <p>
        Push your branch and open a PR. CI will validate your submission
        automatically — checking the schema, verifying your repo has{" "}
        <code style={{ color: "var(--amber)", background: "var(--bg-terminal)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85em" }}>
          agent.yaml
        </code>{" "}
        and{" "}
        <code style={{ color: "var(--amber)", background: "var(--bg-terminal)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85em" }}>
          SOUL.md
        </code>.
      </p>
    ),
  },
];

export default function SubmitPage() {
  return (
    <section style={{ paddingTop: 100 }}>
      <div className="container-narrow">
        <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Submit Your Agent
        </h1>
        <p className="text-muted" style={{ marginTop: 8, maxWidth: "none" }}>
          Share your gitagent with the community. Submissions are reviewed via
          pull request — GitHub is the source of truth.
        </p>

        {/* Requirements */}
        <div className="card" style={{ marginTop: 40 }}>
          <h3 style={{ marginBottom: 16 }}>Requirements</h3>
          <ul style={{ listStyle: "none" }}>
            {[
              "Public GitHub repository",
              <>Valid <code style={{ color: "var(--amber)", background: "var(--bg-terminal)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85em" }}>agent.yaml</code> at repo root or specified path</>,
              <><code style={{ color: "var(--amber)", background: "var(--bg-terminal)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85em" }}>SOUL.md</code> file present</>,
              <>Follows the <a href="https://gitagent.sh" target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)" }}>gitagent standard</a></>,
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 10,
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                }}
              >
                <span style={{ color: "var(--green)", marginTop: 2 }}>&#10003;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="submit-steps">
          {STEPS.map((step) => (
            <div key={step.num} className="submit-step">
              <div className="step-number">{step.num}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                {step.content}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 48, marginBottom: 24 }}>
          <a
            href="https://github.com/open-gitagent/registry/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Fork & Submit{" "}
            <span style={{ display: "inline-flex" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ExternalLinkIcon /></svg>
            </span>
          </a>
          <p
            style={{
              marginTop: 12,
              fontSize: "0.8rem",
              color: "var(--text-faint)",
            }}
          >
            Full guide:{" "}
            <a
              href="https://github.com/open-gitagent/registry/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-muted)" }}
            >
              CONTRIBUTING.md
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
