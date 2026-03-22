import { Search, Flame, Sparkles, CheckCircle2, TrendingUp, X } from "lucide-react";

const FILTERS = [
  { id: "all",       label: "All",       icon: null },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { id: "hot",       label: "Hot 🔥",    icon: Flame },
  { id: "new",       label: "New",       icon: Sparkles },
  { id: "trending",  label: "Trending",  icon: TrendingUp },
];

const NETWORKS = [
  { id: "all",      label: "All Networks" },
  { id: "Mainnet",  label: "Mainnet" },
  { id: "Testnet",  label: "Testnet" },
];

interface CatalogFiltersProps {
  activeFilter: string;
  onFilterChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  networkFilter: string;
  onNetworkChange: (n: string) => void;
}

export function CatalogFilters({
  activeFilter, onFilterChange,
  searchQuery, onSearchChange,
  networkFilter, onNetworkChange,
}: CatalogFiltersProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search projects, chains…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 w-full rounded-xl pl-8 pr-9 text-[13px] text-zinc-200 placeholder-zinc-600 transition-all focus:ring-1 focus:ring-violet-500/30"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
        {searchQuery && (
          <button onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 active:scale-90">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide snap-x">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className="snap-start flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-95"
              style={isActive
                ? { background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.40)", color: "#c4b5fd", boxShadow: "0 0 10px rgba(139,92,246,0.22)" }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#71717a" }
              }
            >
              {f.icon && <f.icon className="h-3 w-3" />}
              {f.label}
            </button>
          );
        })}

        <div className="mx-1 h-3.5 w-px shrink-0 bg-white/10" />

        {NETWORKS.map((n) => {
          const isActive = networkFilter === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onNetworkChange(isActive ? "all" : n.id)}
              className="snap-start shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-95"
              style={isActive
                ? {
                    background: n.id === "Mainnet" ? "rgba(16,185,129,0.18)" : n.id === "Testnet" ? "rgba(59,130,246,0.18)" : "rgba(139,92,246,0.18)",
                    border: `1px solid ${n.id === "Mainnet" ? "rgba(16,185,129,0.40)" : n.id === "Testnet" ? "rgba(59,130,246,0.40)" : "rgba(139,92,246,0.40)"}`,
                    color: n.id === "Mainnet" ? "#6ee7b7" : n.id === "Testnet" ? "#93c5fd" : "#c4b5fd",
                  }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#52525b" }
              }
            >
              {n.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}