// src/components/NetworksPage.tsx
import { useState, useEffect } from "react";
import {
  Globe, Activity, ChevronRight, Zap,
  CalendarDays, CheckCircle2,
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

  const evmAddress = localStorage.getItem("vd_evm") || "";
  const solAddress = wallet.wallet || "";

  useEffect(() => {
    loadData();
  }, [wallet.wallet]);

  const loadData = async () => {
    setLoading(true);

    // Scan each network
    const stats: Record<string, { tx: number; balance: number }> = {};
    const address = evmAddress || solAddress;

    if (address) {
      const results = await Promise.all(
        NETWORKS.map(async (net) => {
          const data = await checkChain(net.id, address);
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

    // Action counts per chain
    const historyData = await getActionHistory();
    if (historyData) {
      const counts: Record<string, number> = {};
      historyData.actions.forEach((a) => {
        counts[a.chain] = (counts[a.chain] || 0) + 1;
      });
      setActionCounts(counts);
    }

    // Schedule count for today
    const schedule = await getSchedule();
    if (schedule?.schedule) {
      const today = schedule.schedule.days.find((d: any) => d.is_today);
      if (today) setScheduleToday(today.tasks.length);
    }

    setLoading(false);
  };

  // Если выбрана сеть → показываем детали
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

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Network Cards */}
            {NETWORKS.map((net) => {
              const stats = chainStats[net.id];
              const actions = actionCounts[net.id] || 0;
              const isActive = stats && stats.tx > 0;

              return (
                <button
                  key={net.id}
                  onClick={() => setSelected(net)}
                  className="relative overflow-hidden flex items-center gap-3.5 rounded-2xl p-4 transition-all active:scale-[0.98]"
                  style={{
                    background: `rgba(255,255,255,0.04)`,
                    border: `1px solid ${isActive ? `${net.color}25` : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  {/* Top glow */}
                  {isActive && (
                    <div className="absolute inset-x-0 top-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${net.color}60, transparent)` }} />
                  )}

                  {/* Emoji */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[22px]"
                    style={{
                      background: `linear-gradient(135deg, ${net.gradFrom}, ${net.gradTo})`,
                      boxShadow: isActive ? `0 4px 16px ${net.color}40` : "none",
                    }}>
                    {net.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left min-w-0">
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

                  {/* Arrow */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(255,255,255,0.06)" }}>
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                  </div>
                </button>
              );
            })}

            {/* Coming soon */}
            <div className="flex items-center justify-center gap-2 rounded-2xl py-6"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
              <span className="text-[11px] text-zinc-600">More networks coming soon...</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}