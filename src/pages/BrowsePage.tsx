import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAgents } from "../hooks/useAgents";
import { search } from "../lib/search";
import { AgentGrid } from "../components/AgentGrid";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";

export default function BrowsePage() {
  const { agents, loading } = useAgents();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
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
    <section className="pt-24 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground mb-2">Browse Agents</h1>
          <p className="text-sm text-muted-foreground font-body mb-8">Search and filter the full agent catalog.</p>
        </motion.div>

        <SearchBar value={query} onChange={setQuery} placeholder="Search by name, description, tags..." />
        <FilterBar selectedCategory={category} onCategoryChange={setCategory} selectedAdapter={adapter} onAdapterChange={setAdapter} adapters={allAdapters} />

        <p className="text-xs text-muted-foreground font-body mt-6 mb-4">
          {loading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "agent" : "agents"} found`}
        </p>

        <AgentGrid agents={filtered} loading={loading} emptyMessage="No agents match your search. Try different keywords or filters." />
      </div>
    </section>
  );
}
