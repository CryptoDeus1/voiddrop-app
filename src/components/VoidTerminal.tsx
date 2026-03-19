import { useState, useEffect } from "react";
import {
  Radar, TrendingUp, TrendingDown, Zap, Activity,
  Anchor, ArrowUpRight, ArrowDownRight, RefreshCw,
  AlertTriangle, Eye, BarChart3, Flame,
} from "lucide-react";
import { getTopMarkets, getPacificaStats, getPortfolioByTelegram, type MarketData, type PacificaStats } from "../services/api";

/* ── Pilot Rank System ─────────────────────────────────── */
const RANKS = [
  { name: "Cadet",       icon: "🌑", minTrades: 0,  color: "#71717a" },
  { name: "Navigator",   icon: "🌘", minTrades: 5,  color: "#a78bfa" },
  { name: "Commander",   icon: "🌗", minTrades: 15, color: "#38bdf8" },
  { name: "Captain",     icon: "🌖", minTrades: 30, color: "#34d399" },
  { name: "Admiral",     icon: "🌕", minTrades: 50, color: "#fbbf24" },
  { name: "Void Master", icon: "⭐", minTrades: 100, color: "#f472b6" },
];

function getRank(trades: number) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (trades >= RANKS[i].minTrades) return RANKS[i];
  }
  return RANKS[0];
}

/* ── Price Ticker Card ─────────────────────────────────── */
function PriceTicker({ market, index }: { market: MarketData; index: number }) {
  const price = Number(market.price);
  const funding = Number(market.funding_rate);
  const fundingPct = (funding * 100).toFixed(4);
  const isPositive = funding >= 0;

  const symbols: Record<string, { icon: string; color: string; glow: string }> = {
    BTC:  { icon: "₿", color: "#f7931a", glow: "rgba(247,147,26,0.3)" },
    ETH:  { icon: "Ξ", color: "#627eea", glow: "rgba(98,126,234,0.3)" },
    SOL:  { icon: "◎", color: "#9945ff", glow: "rgba(153,69,255,0.3)" },
    SUI:  { icon: "💧", color: "#4da2ff", glow: "rgba(77,162,255,0.3)" },
    DOGE: { icon: "🐕", color: "#c2a633", glow: "rgba(194,166,51,0.3)" },
  };

  const s = symbols[market.symbol] || { icon: "●", color: "#a78bfa", glow: "rgba(167,139,250,0.3)" };

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-3.5 transition-all active:scale-[0.98]"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl"
        style={{ background: s.glow }} />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[18px] font-bold"
            style={{ background: `${s.color}20`, border: `1px solid ${s.color}40`, color: s.color }}
          >
            {s.icon}
          </div>
          <div>
            <p className="text-[14px] font-extrabold text-white">{market.symbol}</p>
            <p className="text-[10px] text-zinc-600">{market.max_leverage}x max</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[15px] font-extrabold text-white tabular-nums">
            ${price >= 100 ? price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : price.toFixed(4)}
          </p>
          <div className="flex items-center justify-end gap-1">
            {isPositive
              ? <ArrowUpRight className="h-3 w-3 text-emerald-400" />
              : <ArrowDownRight className="h-3 w-3 text-red-400" />
            }
            <span className={`text-[10px] font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
              {fundingPct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Position Card with PnL ────────────────────────────── */
function PositionCard({ position, currentPrice }: { position: any; currentPrice: number }) {
  const entry = Number(position.entry_price || 0);
  const amount = Number(position.amount || 0);
  const isLong = position.side === "bid" || position.side === "long";
  const liq = Number(position.liquidation_price || 0);

  const pnl = isLong
    ? (currentPrice - entry) * amount
    : (entry - currentPrice) * amount;
  const pnlPct = entry > 0 ? ((isLong ? currentPrice - entry : entry - currentPrice) / entry) * 100 : 0;
  const isProfit = pnl >= 0;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-4"
      style={{
        background: isProfit ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
        border: `1px solid ${isProfit ? "rgba(16,185,129,0.20)" : "rgba(239,68,68,0.20)"}`,
        boxShadow: `0 0 25px -8px ${isProfit ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}`,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${isProfit ? "rgba(16,185,129,0.6)" : "rgba(239,68,68,0.6)"}, transparent)` }} />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[20px]`}>{isProfit ? "🚀" : "☄️"}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-extrabold text-white">{position.symbol}</span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                style={{
                  background: isLong ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  color: isLong ? "#34d399" : "#f87171",
                  border: `1px solid ${isLong ? "rgba(16,185,129,0.30)" : "rgba(239,68,68,0.30)"}`,
                }}
              >
                {isLong ? "LONG" : "SHORT"}
              </span>
            </div>
            <p className="text-[10px] text-zinc-600">Size: {amount} × ${entry.toLocaleString()}</p>
          </div>
        </div>

        {/* PnL Display */}
        <div className="text-right">
          <p className={`text-[18px] font-black ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
            {isProfit ? "+" : ""}{pnlPct.toFixed(2)}%
          </p>
          <p className={`text-[12px] font-bold ${isProfit ? "text-emerald-500" : "text-red-500"}`}>
            {isProfit ? "+" : ""}${pnl.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Price bar */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-zinc-600 mb-1">
            <span>Liq ${liq.toLocaleString()}</span>
            <span>Entry ${entry.toLocaleString()}</span>
            <span>Now ${currentPrice.toLocaleString()}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(Math.max(((currentPrice - liq) / (entry * 2 - liq)) * 100, 5), 95)}%`,
                background: isProfit
                  ? "linear-gradient(90deg, #059669, #10b981, #34d399)"
                  : "linear-gradient(90deg, #dc2626, #ef4444, #f87171)",
                boxShadow: `0 0 8px ${isProfit ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.5)"}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Flight status */}
      <div
        className="flex items-center justify-center gap-2 rounded-xl py-1.5 text-[11px] font-bold"
        style={{
          background: isProfit ? "rgba(16,185,129,0.10)" : "rgba(239,68,68,0.10)",
          color: isProfit ? "#34d399" : "#f87171",
        }}
      >
        {isProfit ? (
          <><TrendingUp className="h-3.5 w-3.5" /> Ascending — Smooth Flight 🚀</>
        ) : (
          <><AlertTriangle className="h-3.5 w-3.5" /> Asteroid Field — Hold Steady ☄️</>
        )}
      </div>
    </div>
  );
}

/* ── Funding Rate Monitor ──────────────────────────────── */
function FundingMonitor({ markets }: { markets: MarketData[] }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-sky-400" />
          <p className="text-[12px] font-bold text-white">Funding Radar</p>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-zinc-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
        </span>
      </div>

      <div className="space-y-2">
        {markets.map((m) => {
          const rate = Number(m.funding_rate);
          const pct = (rate * 100).toFixed(4);
          const isPositive = rate >= 0;
          const barWidth = Math.min(Math.abs(rate) * 100000, 100);

          return (
            <div key={m.symbol} className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-zinc-400 w-12">{m.symbol}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${barWidth}%`,
                    background: isPositive
                      ? "linear-gradient(90deg, #059669, #10b981)"
                      : "linear-gradient(90deg, #dc2626, #ef4444)",
                    boxShadow: `0 0 6px ${isPositive ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
                  }}
                />
              </div>
              <span className={`text-[11px] font-bold w-16 text-right ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN — VoidTerminal
══════════════════════════════════════════════════════════ */
export function VoidTerminal() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [stats, setStats] = useState<PacificaStats | null>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchAll = async () => {
    const [m, s, p] = await Promise.all([
      getTopMarkets(),
      getPacificaStats(),
      getPortfolioByTelegram(),
    ]);
    setMarkets(m);
    setStats(s);
    setPortfolio(p);
    setLoading(false);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, []);

  const positions = portfolio?.positions || [];
  const rank = getRank(positions.length);

  // Get current prices for positions
  const priceMap: Record<string, number> = {};
  markets.forEach((m) => { priceMap[m.symbol] = Number(m.price); });

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Sticky Header ═══════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: "rgba(9,9,11,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(14,165,233,0.15)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="relative flex h-8 w-8 items-center justify-center rounded-xl"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                boxShadow: "0 0 16px rgba(14,165,233,0.40)",
              }}
            >
              <Radar className="h-4 w-4 text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950 animate-pulse" />
            </div>
            <div>
              <h1 className="text-[16px] font-extrabold text-white tracking-tight">Void Terminal</h1>
              <p className="text-[9px] text-sky-400 font-semibold uppercase tracking-[0.15em]">Pacifica Trading Hub</p>
            </div>
          </div>

          {/* Rank badge */}
          <div
            className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5"
            style={{ background: `${rank.color}15`, border: `1px solid ${rank.color}30` }}
          >
            <span className="text-[14px]">{rank.icon}</span>
            <span className="text-[11px] font-extrabold" style={{ color: rank.color }}>{rank.name}</span>
          </div>
        </div>
      </div>

      {/* ══ Scrollable Body ═════════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* ── Quick Stats ──────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className="flex flex-col items-center gap-1 rounded-2xl py-3"
            style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.18)" }}
          >
            <BarChart3 className="h-4 w-4 text-sky-400" />
            <span className="text-[16px] font-extrabold text-sky-400">{stats?.total_markets || "—"}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Markets</span>
          </div>
          <div
            className="flex flex-col items-center gap-1 rounded-2xl py-3"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)" }}
          >
            <Anchor className="h-4 w-4 text-violet-400" />
            <span className="text-[16px] font-extrabold text-violet-400">{positions.length}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Positions</span>
          </div>
          <div
            className="flex flex-col items-center gap-1 rounded-2xl py-3"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)" }}
          >
            <Flame className="h-4 w-4 text-amber-400" />
            <span className="text-[16px] font-extrabold text-amber-400">{rank.icon}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Rank</span>
          </div>
        </div>

        {/* ── Live Prices ──────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Live Markets</p>
            </div>
            <button
              onClick={fetchAll}
              className="flex items-center gap-1 text-[10px] text-sky-400 font-semibold active:scale-95 transition-all"
            >
              <RefreshCw className="h-3 w-3" /> {lastUpdate}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 rounded-full border-2 border-sky-500/30 border-t-sky-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {markets.map((m, i) => (
                <PriceTicker key={m.symbol} market={m} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* ── Active Positions ─────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
              {positions.length > 0 ? "🛸 Active Flights" : "🛸 No Active Flights"}
            </p>
            {positions.length > 0 && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold text-sky-300"
                style={{ background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.22)" }}
              >
                {positions.length} open
              </span>
            )}
          </div>

          {positions.length > 0 ? (
            <div className="space-y-3">
              {positions.map((pos: any, i: number) => (
                <PositionCard
                  key={i}
                  position={pos}
                  currentPrice={priceMap[pos.symbol] || 0}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-3 rounded-2xl py-8"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-[36px]">🌌</span>
              <p className="text-[13px] font-semibold text-zinc-500">The void is empty</p>
              <p className="text-[11px] text-zinc-600">Open a position on Pacifica to start your flight</p>
              <button
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12px] font-bold text-white active:scale-95 transition-all"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                  boxShadow: "0 0 16px rgba(14,165,233,0.35)",
                }}
                onClick={() => window.open("https://app.pacifica.fi", "_blank")}
              >
                Launch on Pacifica <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Funding Radar ────────────────────────────────── */}
        {markets.length > 0 && <FundingMonitor markets={markets} />}

        {/* ── Pacifica Partner Badge ───────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-4 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(14,165,233,0.15)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
          <p className="text-[10px] text-zinc-600 mb-1">Powered by</p>
          <p className="text-[14px] font-extrabold text-white">
            🌊 Pacifica × <span className="text-violet-400">VoidDrop</span>
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">
            Builder: <span className="text-sky-400 font-bold">{stats?.builder_code || "AIRDROPHUB"}</span>
          </p>
        </div>

      </div>
    </div>
  );
}