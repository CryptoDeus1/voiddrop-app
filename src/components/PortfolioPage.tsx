import { useState, useEffect } from "react";
import {
  Wallet, Copy, TrendingUp, TrendingDown,
  Shield, Zap, Award, BarChart3, Rocket,
  CheckCircle2, ChevronDown, ChevronUp,
  Globe, Flame, Target, Orbit,
} from "lucide-react";
import { getPortfolioByTelegram, getTopMarkets, getTelegramUser, type MarketData } from "../services/api";

/* ── Pilot Ranks ─────────────────────────────────────── */
const RANKS = [
  { name: "Cadet",       icon: "🌑", min: 0,   color: "#71717a", next: 5 },
  { name: "Navigator",   icon: "🌘", min: 5,   color: "#a78bfa", next: 15 },
  { name: "Commander",   icon: "🌗", min: 15,  color: "#38bdf8", next: 30 },
  { name: "Captain",     icon: "🌖", min: 30,  color: "#34d399", next: 50 },
  { name: "Admiral",     icon: "🌕", min: 50,  color: "#fbbf24", next: 100 },
  { name: "Void Master", icon: "⭐", min: 100, color: "#f472b6", next: 999 },
];

function getRank(score: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (score >= RANKS[i].min) return { ...RANKS[i], index: i };
  }
  return { ...RANKS[0], index: 0 };
}

/* ── Copy Hook ───────────────────────────────────────── */
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return { copied, copy };
}

/* ── Orbit Ring ──────────────────────────────────────── */
function OrbitRing({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const r = 38;
  const sw = 5;
  const nr = r - sw / 2;
  const c = 2 * Math.PI * nr;
  const pct = Math.min(value / max, 1);
  const off = c - pct * c;

  return (
    <div className="relative flex flex-col items-center gap-1">
      <div className="relative" style={{ width: r * 2, height: r * 2 }}>
        <div className="absolute inset-0 rounded-full opacity-20 blur-md"
          style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />
        <svg width={r * 2} height={r * 2} className="-rotate-90">
          <circle cx={r} cy={r} r={nr} stroke="rgba(255,255,255,0.06)" strokeWidth={sw} fill="none" />
          <circle cx={r} cy={r} r={nr} stroke={color} strokeWidth={sw} fill="none"
            strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
            style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 4px ${color}80)` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[16px] font-black text-white">{value}</span>
        </div>
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN — PortfolioPage (VoidDrop Edition)
══════════════════════════════════════════════════════ */
export function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoreExpanded, setScoreExpanded] = useState(false);
  const { copied, copy } = useCopy();

  const user = getTelegramUser();

  useEffect(() => {
    Promise.all([getPortfolioByTelegram(), getTopMarkets()]).then(([p, m]) => {
      setPortfolio(p);
      setMarkets(m);
      setLoading(false);
    });
  }, []);

  const positions = portfolio?.positions || [];
  const orders = portfolio?.orders || [];
  const wallet = portfolio?.wallet || "";
  const walletShort = portfolio?.wallet_short || "Not connected";

  // Calculate total PnL
  const priceMap: Record<string, number> = {};
  markets.forEach((m) => { priceMap[m.symbol] = Number(m.price); });

  let totalPnl = 0;
  positions.forEach((pos: any) => {
    const entry = Number(pos.entry_price || 0);
    const amount = Number(pos.amount || 0);
    const current = priceMap[pos.symbol] || 0;
    const isLong = pos.side === "bid" || pos.side === "long";
    if (current > 0 && entry > 0) {
      totalPnl += isLong ? (current - entry) * amount : (entry - current) * amount;
    }
  });

  // Mock activity score for now
  const activityScore = positions.length * 10 + orders.length * 5 + 15;
  const rank = getRank(activityScore);
  const nextRank = RANKS[Math.min(rank.index + 1, RANKS.length - 1)];
  const rankProgress = rank.next > rank.min
    ? ((activityScore - rank.min) / (rank.next - rank.min)) * 100
    : 100;

  // Sybil score mock
  const sybilScore = 82;
  const sybilGrade = sybilScore >= 80 ? "A+" : sybilScore >= 60 ? "B" : sybilScore >= 40 ? "C" : "D";

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Sticky Header ═══════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: "rgba(9,9,11,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-violet-400" />
              <h1 className="text-[18px] font-extrabold tracking-tight text-white">Pilot Profile</h1>
            </div>
            <p className="text-[10px] text-violet-400/60 font-semibold uppercase tracking-[0.15em] mt-0.5">
              Your Void Identity
            </p>
          </div>
          <div
            className="flex items-center gap-2 rounded-2xl px-3 py-1.5"
            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-[14px] font-extrabold text-emerald-300">{sybilGrade}</span>
          </div>
        </div>
      </div>

      {/* ══ Scrollable Body ═════════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* ── Pilot Card ───────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(88,28,135,0.30), rgba(30,27,75,0.60))",
            border: "1px solid rgba(139,92,246,0.25)",
            boxShadow: "0 0 30px -8px rgba(139,92,246,0.20)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-indigo-600/10 blur-2xl" />

          <div className="relative">
            {/* Row 1: Avatar + Name + Rank */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[28px]"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                  boxShadow: "0 6px 20px rgba(124,58,237,0.50)",
                }}
              >
                {rank.icon}
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-zinc-950 bg-emerald-400 flex items-center justify-center"
                  style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }}>
                  <CheckCircle2 className="h-2.5 w-2.5 text-zinc-950" />
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-extrabold text-white">
                    {user?.firstName || "Void Pilot"}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                    style={{ background: `${rank.color}20`, color: rank.color, border: `1px solid ${rank.color}40` }}
                  >
                    {rank.name}
                  </span>
                </div>
                {wallet ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-mono text-zinc-500">{walletShort}</span>
                    <button onClick={() => copy(wallet)} className="active:scale-90 transition-all">
                      {copied
                        ? <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        : <Copy className="h-3 w-3 text-zinc-600" />
                      }
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-600 mt-0.5">Connect wallet in bot</p>
                )}
              </div>
            </div>

            {/* Rank Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-zinc-500">Progress to {nextRank.name}</span>
                <span className="text-[10px] font-bold" style={{ color: rank.color }}>
                  {activityScore}/{rank.next} XP
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${rankProgress}%`,
                    background: `linear-gradient(90deg, ${rank.color}99, ${rank.color})`,
                    boxShadow: `0 0 8px ${rank.color}60`,
                  }}
                />
              </div>
            </div>

            {/* PnL Display */}
            <div
              className="flex items-center justify-between rounded-xl px-3 py-2.5"
              style={{
                background: totalPnl >= 0 ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                border: `1px solid ${totalPnl >= 0 ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)"}`,
              }}
            >
              <div className="flex items-center gap-2">
                {totalPnl >= 0
                  ? <Rocket className="h-4 w-4 text-emerald-400" />
                  : <TrendingDown className="h-4 w-4 text-red-400" />
                }
                <div>
                  <p className="text-[10px] text-zinc-500">Flight Status</p>
                  <p className={`text-[16px] font-black ${totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-600">{positions.length} active</p>
                <p className="text-[10px] text-zinc-600">{orders.length} orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Orbit ──────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          <OrbitRing value={positions.length} max={10} label="Positions" color="#0ea5e9" />
          <OrbitRing value={orders.length} max={20} label="Orders" color="#8b5cf6" />
          <OrbitRing value={sybilScore} max={100} label="Shield" color="#10b981" />
        </div>

        {/* ── Active Positions ─────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Orbit className="h-3.5 w-3.5 text-sky-400" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Active Flights</p>
            </div>
            {positions.length > 0 && (
              <span className="text-[10px] font-bold text-sky-400">{positions.length} open</span>
            )}
          </div>

          {positions.length > 0 ? (
            <div className="space-y-2">
              {positions.map((pos: any, i: number) => {
                const entry = Number(pos.entry_price || 0);
                const amount = Number(pos.amount || 0);
                const current = priceMap[pos.symbol] || 0;
                const isLong = pos.side === "bid";
                const pnl = isLong ? (current - entry) * amount : (entry - current) * amount;
                const pnlPct = entry > 0 ? (isLong ? (current - entry) / entry : (entry - current) / entry) * 100 : 0;
                const isProfit = pnl >= 0;

                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl p-3"
                    style={{
                      background: isProfit ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                      border: `1px solid ${isProfit ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}`,
                    }}
                  >
                    <span className="text-[20px]">{isProfit ? "🚀" : "☄️"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-extrabold text-white">{pos.symbol}</span>
                        <span className={`text-[10px] font-bold ${isLong ? "text-emerald-400" : "text-red-400"}`}>
                          {isLong ? "LONG" : "SHORT"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-600">
                        {amount} × ${entry >= 100 ? entry.toLocaleString() : entry.toFixed(4)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[14px] font-black ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
                        {isProfit ? "+" : ""}{pnlPct.toFixed(2)}%
                      </p>
                      <p className={`text-[10px] font-bold ${isProfit ? "text-emerald-500" : "text-red-500"}`}>
                        {isProfit ? "+" : ""}${pnl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-2 rounded-2xl py-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-[32px]">🌌</span>
              <p className="text-[12px] text-zinc-500">No active flights</p>
              <p className="text-[10px] text-zinc-700">Open positions on Pacifica to start exploring</p>
            </div>
          )}
        </div>

        {/* ── Achievements ─────────────────────────────────── */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Achievements</p>
            </div>
            <span className="text-[10px] text-violet-400 font-semibold">3/8</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: "🚀", label: "First Flight", unlocked: true },
              { icon: "🛡️", label: "Shield Up", unlocked: true },
              { icon: "🌊", label: "Pacifica", unlocked: true },
              { icon: "⚡", label: "Speed Run", unlocked: false },
              { icon: "🏆", label: "Top 10%", unlocked: false },
              { icon: "🔥", label: "7d Streak", unlocked: false },
              { icon: "💎", label: "Diamond", unlocked: false },
              { icon: "⭐", label: "Void Master", unlocked: false },
            ].map((a) => (
              <div
                key={a.label}
                className="flex flex-col items-center gap-1 py-2"
                style={{ opacity: a.unlocked ? 1 : 0.3 }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-[18px]"
                  style={
                    a.unlocked
                      ? { background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.35)", boxShadow: "0 0 10px rgba(139,92,246,0.2)" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }
                  }
                >
                  {a.icon}
                </div>
                <span className="text-[8px] text-zinc-600 text-center">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rank Ladder ──────────────────────────────────── */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-3">Pilot Ranks</p>
          <div className="space-y-2">
            {RANKS.map((r, i) => {
              const isCurrent = rank.name === r.name;
              const isLocked = activityScore < r.min;
              return (
                <div
                  key={r.name}
                  className="flex items-center gap-3 rounded-xl px-3 py-2"
                  style={{
                    background: isCurrent ? `${r.color}15` : "transparent",
                    border: isCurrent ? `1px solid ${r.color}30` : "1px solid transparent",
                    opacity: isLocked ? 0.4 : 1,
                  }}
                >
                  <span className="text-[18px] w-6 text-center">{r.icon}</span>
                  <span className="text-[12px] font-bold flex-1" style={{ color: isCurrent ? r.color : "#a1a1aa" }}>
                    {r.name}
                  </span>
                  <span className="text-[10px] text-zinc-600">{r.min}+ XP</span>
                  {isCurrent && (
                    <span className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
                      style={{ background: r.color }}>
                      YOU
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}