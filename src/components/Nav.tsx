import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { GitHubIcon } from "./Icons";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const isActive = (path: string) =>
    location.pathname === path ? " active" : "";

  return (
    <nav className="nav">
      <div className="container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <span className="prompt">$ </span>gitagent
          <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>
            /registry
          </span>
        </Link>
        <div className={`nav-links${menuOpen ? " open" : ""}`}>
          <Link to="/browse" onClick={closeMenu} className={isActive("/browse")}>
            Browse
          </Link>
          <Link to="/submit" onClick={closeMenu} className={isActive("/submit")}>
            Submit
          </Link>
          <a href="https://gitagent.sh" className="accent">
            gitagent.sh
          </a>
          <a
            href="https://github.com/open-gitagent/registry"
            className="github-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
            GitHub
          </a>
        </div>
        <button
          className="nav-hamburger"
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
