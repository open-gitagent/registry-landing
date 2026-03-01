import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Browse", to: "/browse" },
  { label: "Submit", to: "/submit" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
          <span className="text-primary">✦</span> gitagent/registry
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-xs transition-colors font-body ${
                location.pathname === l.to ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a href="https://gitagent.sh" className="text-xs text-primary font-medium font-body">
            gitagent.sh
          </a>
          <a href="https://discord.gg/hVZV8Xyjdc" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
            Discord
          </a>
          <a
            href="https://github.com/open-gitagent/registry"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sketch-border rounded-md px-3 py-1.5 text-foreground transition-colors hover:bg-accent font-body"
          >
            GitHub
          </a>
        </div>

        {/* Mobile */}
        <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setOpen(!open)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block text-xs text-muted-foreground hover:text-foreground font-body">
              {l.label}
            </Link>
          ))}
          <a href="https://gitagent.sh" className="block text-xs text-primary font-body">gitagent.sh</a>
          <a href="https://discord.gg/hVZV8Xyjdc" target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground font-body">Discord</a>
        </div>
      )}
    </nav>
  );
}
