import { useState, useEffect } from "react";
import { Crosshair, TrendingUp, Zap, Bell, Wallet } from "lucide-react";
import { PacificaBanner }  from "./PacificaBanner";
import { CatalogFilters }  from "./CatalogFilters";
import { DropCard }        from "./DropCard";
import { DropDetail }      from "./DropDetail";
import { MOCK_DROPS }      from "../data/mockDrops";
import { getDropsStats, getLiveDrops, type DropsStats } from "../services/api";
import type { WalletState } from "../hooks/useWallet";

interface DropHuntPageProps {
  wallet: WalletState;
}

export function DropHuntPage({ wallet }: DropHuntPageProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [networkFilter, setNetworkFilter] = useState("all");
  const [liveStats, setLiveStats] = useState<DropsStats | null>(null);
  const [selectedDrop, setSelectedDrop] = useState<any | null>(null);
  const [showCount, setShowCount] = useState(6);
  const [liveDrops, setLiveDrops] = useState<any[]>([]);

  useEffect(() => {
    getDropsStats().then(setLiveStats);
    const interval = setInterval(() => {
      getDropsStats().then(setLiveStats);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Загружаем дропы из бэкенда
  useEffect(() => {
    getLiveDrops().then((drops) => {
      if (drops.length > 0) {
        const mapped = drops.map((d: any) => ({
          ...d,
          tasks_list: d.tasks || [],
          tasks_count: (d.tasks || []).length,
          completedTasks: (d.tasks || []).filter((t: any) => t.completed).length,
          // Для совместимости со старым кодом
          tasks: (d.tasks || []).length || 0,
        }));
        setLiveDrops(mapped);
      }
    });
  }, []);

  // Live drops если есть, иначе моки
  const allDrops: any[] = liveDrops.length > 0
    ? liveDrops
    : MOCK_DROPS.map((d) => ({
        ...d,
        tasks_count: d.tasks,
        tasks_list: [],
        project_url: "",
      }));

  // Фильтрация
  const filtered = allDrops.filter((d: any) => {
    if (activeFilter === "confirmed" && d.probability !== "Confirmed") return false;
    if (activeFilter === "hot" && !d.hot) return false;
    if (activeFilter === "new" && !d.new) return false;
    if (activeFilter === "trending" && !d.hot && d.probability !== "Confirmed") return false;
    if (networkFilter !== "all" && d.type !== networkFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const fields = [d.name, d.ticker, d.category, d.chain, d.description].map(
        (f) => (f || "").toLowerCase()
      );
      if (!fields.some((f) => f.includes(q))) return false;
    }

    return true;
  });

  // Сортировка
  const sorted = [...filtered].sort((a, b) => {
    if (a.hot && !b.hot) return -1;
    if (!a.hot && b.hot) return 1;
    if (a.probability === "Confirmed" && b.probability !== "Confirmed") return -1;
    if (a.probability !== "Confirmed" && b.probability === "Confirmed") return 1;
    return 0;
  });

  const visible = sorted.slice(0, showCount);
  const hasMore = showCount < sorted.length;

  useEffect(() => { setShowCount(6); }, [activeFilter, networkFilter, searchQuery]);

  const STATS = [
    {
      label: "Live Drops",
      value: liveStats ? String(liveStats.total_live) : String(allDrops.length),
      color: "text-violet-400",
      border: "border-violet-500/20",
      bg: "from-violet-500/15 to-violet-500/0",
    },
    {
      label: "Funding",
      value: liveStats?.total_funding || "$4.8B",
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "from-emerald-500/15 to-emerald-500/0",
    },
    {
      label: "Avg Reward",
      value: liveStats?.avg_reward || "$840",
      color: "text-amber-400",
      border: "border-amber-500/20",
      bg: "from-amber-500/15 to-amber-500/0",
    },
  ];

  const handleConnect = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.openTelegramLink("https://t.me/web3scan_assistant_bot");
    } else {
      window.open("https://t.me/web3scan_assistant_bot", "_blank");
    }
  };

  // Если выбран дроп → показываем детали
  if (selectedDrop) {
    return <DropDetail drop={selectedDrop} onBack={() => setSelectedDrop(null)} />;
  }

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Header ════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(9,9,11,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/40">
            <Zap className="h-4 w-4 text-white" fill="white" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
          </div>
          <div className="leading-none">
            <span className="block text-[13px] font-bold tracking-tight text-white">
              {wallet.isConnected ? `Hey, ${wallet.firstName}` : "Void Drop"}
            </span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.15em] text-violet-400">
              {wallet.isConnected ? "Wallet Connected" : "Explore the Void"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="relative flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Bell className="h-4 w-4 text-zinc-400" />
            {wallet.positionsCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
            )}
          </button>

          {wallet.isConnected ? (
            <div
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
              style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.30)",
                boxShadow: "0 0 14px rgba(16,185,129,0.15)",
              }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px rgba(16,185,129,0.8)" }} />
              <span className="text-[12px] font-semibold text-emerald-300">{wallet.walletShort}</span>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-violet-300 transition-all active:scale-95"
              style={{
                background: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.30)",
                boxShadow: "0 0 14px rgba(139,92,246,0.20)",
              }}
            >
              <Wallet className="h-3.5 w-3.5" />
              Connect
            </button>
          )}
        </div>
      </div>

      {/* ══ Body ══════════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-violet-400" />
              <h1 className="text-[18px] font-extrabold tracking-tight text-white">DropHunt</h1>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-violet-300"
                style={{ background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.30)" }}
              >
                {liveDrops.length > 0 ? "LIVE" : "DEMO"}
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-zinc-500">Track & farm airdrops across all ecosystems</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {STATS.map((s) => (
            <div key={s.label} className={`relative overflow-hidden rounded-2xl border ${s.border} bg-gradient-to-b ${s.bg} p-3`}>
              <p className={`text-[16px] font-extrabold ${s.color}`}>{s.value}</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>

        <PacificaBanner />

        <CatalogFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          networkFilter={networkFilter}
          onNetworkChange={setNetworkFilter}
        />

        <div className="flex items-center justify-between -mt-1">
          <p className="text-[11px] text-zinc-600">
            <span className="font-semibold text-zinc-400">{sorted.length}</span> projects
            {searchQuery && <span> matching "{searchQuery}"</span>}
          </p>
          {(searchQuery || networkFilter !== "all" || activeFilter !== "all") && (
            <button
              onClick={() => { setSearchQuery(""); setNetworkFilter("all"); setActiveFilter("all"); }}
              className="text-[11px] text-violet-400 font-semibold"
            >
              Clear all
            </button>
          )}
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl py-10"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-3xl">🔍</span>
            <p className="text-[13px] font-semibold text-zinc-500">No projects found</p>
            <button
              onClick={() => { setSearchQuery(""); setNetworkFilter("all"); setActiveFilter("all"); }}
              className="text-[12px] font-semibold text-violet-400"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visible.map((drop: any) => (
              <DropCard key={drop.id} drop={drop} onSelect={setSelectedDrop} />
            ))}
          </div>
        )}

        {hasMore && (
          <button
            onClick={() => setShowCount((p) => p + 6)}
            className="w-full rounded-2xl py-3 text-[13px] font-semibold text-zinc-400 transition-all active:scale-[0.98]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            Load More ({sorted.length - showCount} remaining)
          </button>
        )}
      </div>
    </div>
  );
}