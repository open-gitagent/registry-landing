import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">
              <span className="prompt">$ </span>gitagent
              <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>
                /registry
              </span>
            </div>
            <p>
              The public registry for git-native AI agents. Discover, share, and
              install agents built with the gitagent standard.
            </p>
          </div>

          <div>
            <h4>Registry</h4>
            <ul>
              <li>
                <Link to="/browse">Browse Agents</Link>
              </li>
              <li>
                <Link to="/submit">Submit an Agent</Link>
              </li>
              <li>
                <a
                  href="https://github.com/open-gitagent/registry/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contributing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4>gitagent</h4>
            <ul>
              <li>
                <a href="https://gitagent.sh" target="_blank" rel="noopener noreferrer">
                  gitagent.sh
                </a>
              </li>
              <li>
                <a href="https://github.com/open-gitagent" target="_blank" rel="noopener noreferrer">
                  GitHub Org
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Community</h4>
            <ul>
              <li>
                <a
                  href="https://github.com/open-gitagent/registry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/open-gitagent/registry/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Issues
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          open-gitagent &middot; MIT License
        </div>
      </div>
    </footer>
  );
}
