import { CATEGORIES, CATEGORY_LABELS } from "../lib/api";

interface Props {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedAdapter: string;
  onAdapterChange: (adapter: string) => void;
  adapters: string[];
}

export function FilterBar({ selectedCategory, onCategoryChange, selectedAdapter, onAdapterChange, adapters }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="bg-card/60 border border-border rounded-md px-3 py-1.5 text-xs text-foreground font-body focus:outline-none focus:border-primary/40 cursor-pointer"
        style={{ boxShadow: "2px 2px 0px hsl(var(--foreground) / 0.08)" }}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
        ))}
      </select>

      <select
        value={selectedAdapter}
        onChange={(e) => onAdapterChange(e.target.value)}
        className="bg-card/60 border border-border rounded-md px-3 py-1.5 text-xs text-foreground font-body focus:outline-none focus:border-primary/40 cursor-pointer"
        style={{ boxShadow: "2px 2px 0px hsl(var(--foreground) / 0.08)" }}
      >
        <option value="">All Adapters</option>
        {adapters.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  );
}
