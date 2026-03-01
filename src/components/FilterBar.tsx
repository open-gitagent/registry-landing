import { CATEGORIES, CATEGORY_LABELS } from "../lib/api";

interface Props {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedAdapter: string;
  onAdapterChange: (adapter: string) => void;
  adapters: string[];
}

export function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedAdapter,
  onAdapterChange,
  adapters,
}: Props) {
  return (
    <div className="filter-bar">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {CATEGORY_LABELS[cat]}
          </option>
        ))}
      </select>

      <select
        value={selectedAdapter}
        onChange={(e) => onAdapterChange(e.target.value)}
      >
        <option value="">All Adapters</option>
        {adapters.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}
