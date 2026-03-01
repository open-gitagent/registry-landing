import { SearchIcon } from "./Icons";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search agents...",
}: Props) {
  return (
    <div className="search-bar">
      <span className="search-icon">
        <SearchIcon />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
