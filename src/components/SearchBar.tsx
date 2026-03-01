import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search agents..." }: Props) {
  return (
    <div className="relative max-w-lg mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-card/60 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 font-body focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all"
        style={{ boxShadow: "2px 3px 0px hsl(var(--border))" }}
      />
    </div>
  );
}
