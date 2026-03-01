import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12">
          <div>
            <span className="font-heading text-sm font-semibold text-foreground mb-3 block">
              <span className="text-primary">✦</span> gitagent/registry
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed font-body">
              The public registry for git-native AI agents.
            </p>
          </div>

          <div>
            <span className="text-xs font-heading font-semibold text-foreground mb-3 block">Registry</span>
            <div className="space-y-2">
              <Link to="/browse" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Browse Agents</Link>
              <Link to="/submit" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Submit an Agent</Link>
            </div>
          </div>

          <div>
            <span className="text-xs font-heading font-semibold text-foreground mb-3 block">gitagent</span>
            <div className="space-y-2">
              <a href="https://gitagent.sh" target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">gitagent.sh</a>
              <a href="https://github.com/open-gitagent" target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">GitHub Org</a>
            </div>
          </div>

          <div>
            <span className="text-xs font-heading font-semibold text-foreground mb-3 block">Community</span>
            <div className="space-y-2">
              <a href="https://github.com/open-gitagent/registry" target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">GitHub</a>
              <a href="https://github.com/open-gitagent/registry/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Contributing</a>
            </div>
          </div>
        </div>

        <div className="line-glow w-full mb-6" />
        <p className="text-xs text-muted-foreground text-center font-body">open-gitagent · MIT License</p>
      </div>
    </footer>
  );
}
