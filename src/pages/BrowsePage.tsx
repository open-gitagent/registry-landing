import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAgents } from "../hooks/useAgents";
import { search } from "../lib/search";
import { AgentGrid } from "../components/AgentGrid";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";

export default function BrowsePage() {
  const { agents, loading } = useAgents();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? ""
  );
  const [adapter, setAdapter] = useState(searchParams.get("adapter") ?? "");

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (adapter) params.set("adapter", adapter);
    setSearchParams(params, { replace: true });
  }, [query, category, adapter, setSearchParams]);

  const allAdapters = useMemo(() => {
    const set = new Set<string>();
    agents.forEach((a) => a.adapters.forEach((ad) => set.add(ad)));
    return Array.from(set).sort();
  }, [agents]);

  const filtered = useMemo(() => {
    let result = agents;
    if (category) result = result.filter((a) => a.category === category);
    if (adapter) result = result.filter((a) => a.adapters.includes(adapter));
    if (query.trim()) result = search(query, result);
    return result;
  }, [agents, query, category, adapter]);

  return (
    <section style={{ paddingTop: 100 }}>
      <div className="container">
        <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
          Browse Agents
        </h1>
        <p className="text-muted" style={{ marginTop: 8 }}>
          Search and filter the full agent catalog.
        </p>

        <div style={{ marginTop: 32 }}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by name, description, tags..."
          />
          <FilterBar
            selectedCategory={category}
            onCategoryChange={setCategory}
            selectedAdapter={adapter}
            onAdapterChange={setAdapter}
            adapters={allAdapters}
          />
        </div>

        <div className="results-count">
          {loading
            ? "Loading..."
            : `${filtered.length} ${filtered.length === 1 ? "agent" : "agents"} found`}
        </div>

        <AgentGrid
          agents={filtered}
          loading={loading}
          emptyMessage="No agents match your search. Try different keywords or filters."
        />
      </div>
    </section>
  );
}
