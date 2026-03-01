import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAgents } from "../hooks/useAgents";
import { CATEGORY_LABELS } from "../lib/api";
import { AgentGrid } from "../components/AgentGrid";
import { SearchBar } from "../components/SearchBar";
import { ArrowRightIcon, CATEGORY_SVGS } from "../components/Icons";

export default function HomePage() {
  const { agents, total, loading } = useAgents();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const activeCategories = useMemo(() => {
    const cats = new Set(agents.map((a) => a.category));
    return Array.from(cats).sort();
  }, [agents]);

  const contributors = useMemo(
    () => new Set(agents.map((a) => a.author)).size,
    [agents]
  );

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      navigate(`/browse?q=${encodeURIComponent(value)}`);
    }
  };

  const featured = agents.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="hero hero-centered">
        <div className="container">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="dot"></span> open-gitagent/registry
            </div>
            <h1>
              The Agent <span className="accent">Registry</span>
            </h1>
            <p className="subtitle">
              Discover, share, and install git-native AI agents built with the
              gitagent standard.
            </p>

            <SearchBar
              value={query}
              onChange={handleSearch}
              placeholder="Search agents by name, tag, or category..."
            />

            {/* Stats */}
            <div className="stats-bar" style={{ marginTop: 40 }}>
              <div>
                <span className="stat-value">
                  {loading ? "-" : total}
                </span>
                <span className="stat-label">agents</span>
              </div>
              <div className="stat-divider" />
              <div>
                <span className="stat-value">
                  {loading ? "-" : activeCategories.length}
                </span>
                <span className="stat-label">categories</span>
              </div>
              <div className="stat-divider" />
              <div>
                <span className="stat-value">
                  {loading ? "-" : contributors}
                </span>
                <span className="stat-label">contributors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Featured */}
      <section>
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 40,
            }}
          >
            <h2>Featured Agents</h2>
            <Link
              to="/browse"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.875rem",
                color: "var(--text-muted)",
              }}
            >
              View all{" "}
              <span
                style={{ display: "inline-flex" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ArrowRightIcon />
                </svg>
              </span>
            </Link>
          </div>
          <AgentGrid agents={featured} loading={loading} />
        </div>
      </section>

      <hr className="section-divider" />

      {/* Categories */}
      {activeCategories.length > 0 && (
        <section>
          <div className="container">
            <div className="section-header">
              <h2>Browse by Category</h2>
            </div>
            <div className="category-grid">
              {activeCategories.map((cat) => {
                const count = agents.filter((a) => a.category === cat).length;
                const IconComp = CATEGORY_SVGS[cat] ?? CATEGORY_SVGS["other"];
                return (
                  <Link
                    key={cat}
                    to={`/browse?category=${cat}`}
                    className="category-card"
                  >
                    <span className="category-card-icon">
                      <IconComp />
                    </span>
                    <div>
                      <div className="category-card-label">
                        {CATEGORY_LABELS[cat] ?? cat}
                      </div>
                      <div className="category-card-count">
                        {count} {count === 1 ? "agent" : "agents"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <hr className="section-divider" />

      {/* Submit CTA */}
      <section>
        <div className="container" style={{ textAlign: "center" }}>
          <h2>
            Share Your <span className="glow-green">Agent</span>
          </h2>
          <p
            style={{
              margin: "16px auto 32px",
              color: "var(--text-muted)",
              fontSize: "1.1rem",
            }}
          >
            Built an agent with gitagent? Submit it to the registry and share it
            with the community.
          </p>
          <Link to="/submit" className="btn btn-primary">
            Submit Your Agent
          </Link>
        </div>
      </section>
    </>
  );
}
