import { Search, SlidersHorizontal, Flame, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";

const FILTERS = [
  { id: "all",       label: "All",       icon: null          },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle2  },
  { id: "hot",       label: "Hot 🔥",   icon: Flame         },
  { id: "new",       label: "New",       icon: Sparkles      },
  { id: "trending",  label: "Trending",  icon: TrendingUp    },
];

interface CatalogFiltersProps {
  activeFilter: string;
  onFilterChange: (id: string) => void;
}

export function CatalogFilters({ activeFilter, onFilterChange }: CatalogFiltersProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Search + filter icon row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects, chains, tags…"
            className="h-9 w-full rounded-xl pl-8 pr-4 text-[13px] text-zinc-200 placeholder-zinc-600 transition-all duration-200 focus:ring-1 focus:ring-violet-500/30"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>
        <button
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[12px] font-medium text-zinc-400"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter
        </button>
      </div>

      {/* Horizontally scrollable filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide snap-x">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className="snap-start flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 active:scale-95"
              style={
                isActive
                  ? {
                      background: "rgba(139,92,246,0.18)",
                      border: "1px solid rgba(139,92,246,0.40)",
                      color: "#c4b5fd",
                      boxShadow: "0 0 10px rgba(139,92,246,0.22)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#71717a",
                    }
              }
            >
              {f.icon && <f.icon className="h-3 w-3" />}
              {f.label}
            </button>
          );
        })}
        <div className="mx-1 h-3.5 w-px shrink-0 bg-white/10" />
        {["Mainnet", "Testnet"].map((n) => (
          <button
            key={n}
            className="snap-start shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold text-zinc-600"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
