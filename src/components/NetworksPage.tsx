// src/components/NetworksPage.tsx
import { useState, useEffect } from "react";
import {
  Globe, Activity, ChevronRight, Zap,
  CalendarDays, CheckCircle2, Search, X,
} from "lucide-react";
import { NETWORKS, type NetworkDef } from "../data/networks";
import { NetworkDetail } from "./NetworkDetail";
import { getSchedule, checkChain, getActionHistory } from "../services/api";
import type { WalletState } from "../hooks/useWallet";

interface NetworksPageProps {
  wallet: WalletState;
}

export function NetworksPage({ wallet }: NetworksPageProps) {
  const [selected, setSelected] = useState<NetworkDef | null>(null);
  const [chainStats, setChainStats] = useState<Record<string, { tx: number; balance: number }>>({});
  const [actionCounts, setActionCounts] = useState<Record<string, number>>({});
  const [scheduleToday, setScheduleToday] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "mainnet" | "testnet">("all");

  const evmAddress = localStorage.getItem("vd_evm") || "";
  const solAddress = wallet.wallet || "";

  useEffect(() => {
    loadData();
  }, [wallet.wallet]);

  const loadData = async () => {
    setLoading(true);

    const stats: Record<string, { tx: number; balance: number }> = {};

    if (evmAddress || solAddress) {
      const results = await Promise.all(
        NETWORKS.map(async (net) => {
          const addr = net.id === "solana" ? solAddress : evmAddress;
          if (!addr) return { id: net.id, data: null };
          const data = await checkChain(net.id, addr);
          return { id: net.id, data };
        })
      );
      results.forEach((r) => {
        if (r.data) {
          stats[r.id] = { tx: r.data.tx_count, balance: r.data.balance };
        }
      });
    }
    setChainStats(stats);

    const historyData = await getActionHistory();
    if (historyData) {
      const counts: Record<string, number> = {};
      historyData.actions.forEach((a) => {
        counts[a.chain] = (counts[a.chain] || 0) + 1;
      });
      setActionCounts(counts);
    }

    const schedule = await getSchedule();
    if (schedule?.schedule) {
      const today = schedule.schedule.days.find((d: any) => d.is_today);
      if (today) setScheduleToday(today.tasks.length);
    }

    setLoading(false);
  };

  // Фильтрация
  const filteredNetworks = NETWORKS.filter((net) => {
    if (filterType !== "all" && net.type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        net.name.toLowerCase().includes(q) ||
        net.description.toLowerCase().includes(q) ||
        net.tags.some((t) => t.includes(q))
      );
    }
    return true;
  });

  // Если выбрана сеть
  if (selected) {
    return (
      <NetworkDetail
        network={selected}
        wallet={wallet}
        onBack={() => { setSelected(null); loadData(); }}
      />
    );
  }

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Header ═══════════════════════════ */}
      <div className="sticky top-0 z-30 px-4 py-3"
        style={{ background: "rgba(9,9,11,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-violet-400" />
              <h1 className="text-[18px] font-extrabold text-white">Networks</h1>
            </div>
            <p className="text-[10px] text-violet-400 font-semibold uppercase tracking-[0.15em] mt-0.5">
              Farm across chains
            </p>
          </div>
          {scheduleToday > 0 && (
            <div className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)" }}>
              <CalendarDays className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-300">{scheduleToday}</span>
              <span className="text-[9px] text-amber-600">today</span>
            </div>
          )}
        </div>
      </div>

      {/* ══ Body ═════════════════════════════ */}
      <div className="flex flex-col gap-3 px-4 pb-nav pt-4">

        {/* No wallet warning */}
        {!evmAddress && !solAddress && (
          <div className="flex items-start gap-2.5 rounded-2xl p-3.5"
            style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)" }}>
            <span className="text-[16px]">👛</span>
            <p className="text-[11px] text-zinc-400">
              <span className="text-amber-400 font-semibold">Connect wallet</span> in Profile tab to see chain stats and verify transactions.
            </p>
          </div>
        )}

        {/* ── Search + Filters ──────── */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
            <input type="text" placeholder="Search networks..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl pl-8 pr-9 text-[13px] text-zinc-200 placeholder-zinc-600"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }} />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 active:scale-90">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {(["all", "mainnet", "testnet"] as const).map((f) => (
              <button key={f} onClick={() => setFilterType(f)}
                className="rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize transition-all active:scale-95"
                style={filterType === f
                  ? { background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.40)", color: "#c4b5fd" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#71717a" }
                }>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Network Cards */}
            {filteredNetworks.map((net) => {
              const stats = chainStats[net.id];
              const actions = actionCounts[net.id] || 0;
              const isActive = stats && stats.tx > 0;

              return (
                <button
                  key={net.id}
                  onClick={() => setSelected(net)}
                  className="relative overflow-hidden flex items-center gap-3.5 rounded-2xl p-4 transition-all active:scale-[0.98] text-left"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${isActive ? `${net.color}25` : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  {isActive && (
                    <div className="absolute inset-x-0 top-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${net.color}60, transparent)` }} />
                  )}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[22px]"
                    style={{
                      background: `linear-gradient(135deg, ${net.gradFrom}, ${net.gradTo})`,
                      boxShadow: isActive ? `0 4px 16px ${net.color}40` : "none",
                    }}>
                    {net.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-extrabold text-white">{net.name}</span>
                      <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                        style={net.type === "mainnet"
                          ? { background: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.22)" }
                          : { background: "rgba(59,130,246,0.12)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.22)" }
                        }>
                        {net.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{net.description}</p>

                    {/* Data badges */}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {net.funding && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(16,185,129,0.10)", color: "#6ee7b7" }}>
                          💰 {net.funding}
                        </span>
                      )}
                      {net.reward && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(245,158,11,0.10)", color: "#fcd34d" }}>
                          🎁 {net.reward}
                        </span>
                      )}
                      {net.probability && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{
                            background: net.probability === "Confirmed" ? "rgba(16,185,129,0.10)" : "rgba(245,158,11,0.10)",
                            color: net.probability === "Confirmed" ? "#6ee7b7" : "#fcd34d",
                          }}>
                          {net.probability}
                        </span>
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mt-1.5">
                      {stats ? (
                        <>
                          <span className="flex items-center gap-1 text-[10px]">
                            <Activity className="h-3 w-3" style={{ color: net.color }} />
                            <span className="font-bold" style={{ color: net.color }}>{stats.tx}</span>
                            <span className="text-zinc-600">TX</span>
                          </span>
                          {stats.balance > 0 && (
                            <span className="text-[10px] text-zinc-500">
                              {stats.balance.toFixed(4)} {net.native}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[10px] text-zinc-600">No data</span>
                      )}
                      {actions > 0 && (
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          {actions} done
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(255,255,255,0.06)" }}>
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                  </div>
                </button>
              );
            })}

            {filteredNetworks.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-2xl py-10"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="text-3xl">🔍</span>
                <p className="text-[13px] font-semibold text-zinc-500">No networks found</p>
                <button onClick={() => { setSearch(""); setFilterType("all"); }}
                  className="text-[12px] font-semibold text-violet-400">Clear filters</button>
              </div>
            )}

            {/* Coming soon */}
            {filteredNetworks.length > 0 && (
              <div className="flex items-center justify-center gap-2 rounded-2xl py-6"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                <span className="text-[11px] text-zinc-600">More networks coming soon...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}