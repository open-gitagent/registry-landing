import { useState } from "react";
import { CopyIcon, CheckIcon, WindowDots } from "./Icons";

interface Tab {
  label: string;
  command: string;
}

export function InstallCommand({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tabs[active].command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <WindowDots />
        <span className="terminal-title">install</span>
      </div>
      <div className="install-tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`install-tab${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="install-body">
        <code>
          <span className="prompt">$ </span>
          {tabs[active].command}
        </code>
        <button
          className={`install-copy${copied ? " copied" : ""}`}
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
}
