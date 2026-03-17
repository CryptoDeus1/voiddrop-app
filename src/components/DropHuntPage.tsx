import { useState, useEffect } from "react";
import { Crosshair, TrendingUp, Zap, Bell, Wallet } from "lucide-react";
import { PacificaBanner }  from "./PacificaBanner";
import { CatalogFilters }  from "./CatalogFilters";
import { DropCard }        from "./DropCard";
import { MOCK_DROPS }      from "../data/mockDrops";
import { getDropsStats, type DropsStats } from "../services/api";

export function DropHuntPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [liveStats, setLiveStats] = useState<DropsStats | null>(null);

  useEffect(() => {
    getDropsStats().then(setLiveStats);
    // Обновляем каждые 30 секунд
    const interval = setInterval(() => {
      getDropsStats().then(setLiveStats);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered =
    activeFilter === "confirmed" ? MOCK_DROPS.filter((d) => d.probability === "Confirmed") :
    activeFilter === "hot"       ? MOCK_DROPS.filter((d) => d.hot) :
    activeFilter === "new"       ? MOCK_DROPS.filter((d) => d.new) :
    MOCK_DROPS;

  /* ── Summary stat cards with live data ──────────────────────── */
  const STATS = [
    {
      label: "Live Drops",
      value: liveStats ? String(liveStats.total_live) : "147",
      sub: liveStats?.pacifica ? `${liveStats.pacifica.markets} on Pacifica` : "+12 this week",
      icon: Crosshair,
      color: "text-violet-400",
      border: "border-violet-500/20",
      bg: "from-violet-500/15 to-violet-500/0",
    },
    {
      label: "Funding",
      value: liveStats?.total_funding || "$4.8B",
      sub: "Tracked",
      icon: TrendingUp,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "from-emerald-500/15 to-emerald-500/0",
    },
    {
      label: "Avg Reward",
      value: liveStats?.avg_reward || "$840",
      sub: "Confirmed",
      icon: Zap,
      color: "text-amber-400",
      border: "border-amber-500/20",
      bg: "from-amber-500/15 to-amber-500/0",
    },
  ];

  // ... остальной код без изменений, начиная с return (

  return (
    /*
     * tma-scroll = -webkit-overflow-scrolling:touch + overscroll-behavior:contain
     * pb-nav     = padding-bottom clears the fixed bottom nav
     * The outer wrapper fills the parent (flex-1 area above bottom nav)
     */
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Sticky TMA Page Header ════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(9,9,11,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo + wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/40">
            <Zap className="h-4 w-4 text-white" fill="white" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
          </div>
          <div className="leading-none">
            <span className="block text-[13px] font-bold tracking-tight text-white">AirdropHub</span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.15em] text-violet-400">Assistant</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            className="relative flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Bell className="h-4 w-4 text-zinc-400" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-violet-500" />
          </button>

          <button
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-violet-300 transition-all"
            style={{
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.30)",
              boxShadow: "0 0 14px rgba(139,92,246,0.20)",
            }}
          >
            <Wallet className="h-3.5 w-3.5" />
            Connect
          </button>
        </div>
      </div>

      {/* ══ Scrollable body ══════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* Page title row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-violet-400" />
              <h1 className="text-[18px] font-extrabold tracking-tight text-white">
                DropHunt
              </h1>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-violet-300"
                style={{ background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.30)" }}
              >
                LIVE
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-zinc-500">
              Track & farm airdrops across all ecosystems
            </p>
          </div>
          <p className="text-[11px] text-zinc-600">Updated now</p>
        </div>

        {/* ── 3-column stat cards ───────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          {STATS.map((s) => (
            <div
              key={s.label}
              className={`relative overflow-hidden rounded-2xl border ${s.border} bg-gradient-to-b ${s.bg} p-3`}
            >
              <p className={`text-[16px] font-extrabold ${s.color}`}>{s.value}</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Pacifica VIP Banner ───────────────────────────────── */}
        <PacificaBanner />

        {/* ── Filters ──────────────────────────────────────────── */}
        <CatalogFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Results count */}
        <div className="flex items-center justify-between -mt-1">
          <p className="text-[11px] text-zinc-600">
            <span className="font-semibold text-zinc-400">{filtered.length}</span> projects
          </p>
          <p className="text-[11px] text-zinc-600">Grid view</p>
        </div>

        {/* ── Card grid: 1 col on mobile ────────────────────────── */}
        <div className="flex flex-col gap-3">
          {filtered.map((drop) => (
            <DropCard key={drop.id} drop={drop} />
          ))}
        </div>

        {/* Load more */}
        <button
          className="w-full rounded-2xl py-3 text-[13px] font-semibold text-zinc-400 transition-all"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          Load More Projects
        </button>
      </div>
    </div>
  );
}
