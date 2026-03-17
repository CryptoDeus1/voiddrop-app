import { useState } from "react";
import {
  Wallet, Copy, LogOut, TrendingUp,
  Shield, Zap, Award, BarChart3,
  CheckCircle2, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  MOCK_WALLET, STAT_CARDS, SYBIL_SCORE,
  CHAIN_ACTIVITY, RECENT_ACTIVITY,
} from "../data/mockPortfolio";

/* ══════════════════════════════════════════════════════════════════
   Sybil Score Ring
══════════════════════════════════════════════════════════════════ */
function ScoreRing({ score, max }: { score: number; max: number }) {
  const r   = 44;
  const sw  = 7;
  const nr  = r - sw / 2;
  const c   = 2 * Math.PI * nr;
  const off = c - (score / max) * c;

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full opacity-25 blur-xl"
        style={{ background: "radial-gradient(circle,#10b981,transparent)" }}
      />
      <svg width={r * 2} height={r * 2} className="-rotate-90" overflow="visible">
        <defs>
          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#10b981" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        <circle cx={r} cy={r} r={nr} stroke="rgba(255,255,255,0.06)" strokeWidth={sw} fill="none" />
        <circle
          cx={r} cy={r} r={nr}
          stroke="url(#sg)" strokeWidth={sw} fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.60))" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[22px] font-black text-white leading-none">{score}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">/ {max}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   useCopy hook
══════════════════════════════════════════════════════════════════ */
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return { copied, copy };
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PortfolioPage
══════════════════════════════════════════════════════════════════ */
export function PortfolioPage() {
  const w = MOCK_WALLET;
  const { copied, copy } = useCopy();
  const [scoreExpanded, setScoreExpanded] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const visibleActivity = showAllActivity ? RECENT_ACTIVITY : RECENT_ACTIVITY.slice(0, 3);

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Sticky TMA Header ════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: "rgba(9,9,11,0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-violet-400" />
              <h1 className="text-[18px] font-extrabold tracking-tight text-white">Portfolio</h1>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Your farming profile & stats</p>
          </div>
          {/* Sybil grade badge */}
          <div
            className="flex items-center gap-2 rounded-2xl px-3 py-1.5"
            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-[14px] font-extrabold text-emerald-300">A+</span>
            <span className="text-[10px] font-semibold text-emerald-600">Sybil</span>
          </div>
        </div>
      </div>

      {/* ══ Scrollable body ══════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* ── 1. Wallet Card ─────────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Top violet shimmer line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
          {/* Glow blobs */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 right-0 h-28 w-28 rounded-full bg-indigo-600/10 blur-2xl" />

          <div className="relative space-y-4">
            {/* Row 1: Avatar + name + disconnect */}
            <div className="flex items-center gap-3">
              <div
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${w.avatarGradientFrom}, ${w.avatarGradientTo})`,
                  boxShadow: "0 6px 20px -4px rgba(124,58,237,0.50)",
                }}
              >
                <Wallet className="h-5 w-5 text-white" />
                <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 bg-emerald-400"
                  style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-extrabold text-white">{w.ensName}</span>
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-400"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.22)" }}
                  >
                    Connected
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] font-mono text-zinc-500">{w.addressShort}</span>
                  <button
                    onClick={() => copy(w.address)}
                    className="transition-all active:scale-90"
                  >
                    {copied
                      ? <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      : <Copy className="h-3 w-3 text-zinc-600 hover:text-zinc-400" />
                    }
                  </button>
                </div>
              </div>

              <button
                onClick={() => { setDisconnecting(true); setTimeout(() => setDisconnecting(false), 1500); }}
                className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-all active:scale-95"
                style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#f87171" }}
              >
                <LogOut className="h-3 w-3" />
                {disconnecting ? "…" : "Out"}
              </button>
            </div>

            {/* Row 2: Network chip */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-600">Network:</span>
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-indigo-300"
                style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.22)" }}
              >
                ⟠ {w.network}
              </span>
            </div>

            {/* Row 3: Total assets */}
            <div
              className="flex items-center justify-between rounded-xl px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div>
                <p className="text-[11px] text-zinc-600">Total Assets</p>
                <p className="text-[22px] font-black text-white leading-tight">{w.totalAssetsFormatted}</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5"
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.20)" }}>
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[12px] font-bold text-emerald-400">{w.change24hFormatted}</span>
                <span className="text-[10px] text-emerald-600">24h</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Farming Stats 2×2 Grid ──────────────────────────── */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Farming Stats</p>
          <div className="grid grid-cols-2 gap-2.5">
            {STAT_CARDS.map((s) => (
              <div
                key={s.id}
                className="relative overflow-hidden rounded-2xl p-3.5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid`,
                  borderColor: s.borderClass.replace("border-", "").replace("/20", ""),
                  boxShadow: `0 0 20px -8px ${s.glowClass}`,
                }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[22px]">{s.emoji}</span>
                </div>
                <p className={`mt-2 text-[22px] font-extrabold ${s.colorClass}`}>{s.value}</p>
                <p className="text-[11px] font-semibold text-zinc-500">{s.label}</p>
                {s.subValue && (
                  <p className="mt-0.5 text-[10px] text-zinc-700">{s.subValue}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Anti-Sybil Score Widget ─────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background: "rgba(16,185,129,0.04)",
            border: "1px solid rgba(16,185,129,0.18)",
            boxShadow: "0 0 30px -10px rgba(16,185,129,0.15)",
          }}
        >
          {/* Shimmer top line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
          {/* Glow blob */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.28)" }}
              >
                <Shield className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white">Sybil-Resistance Score</p>
                <p className="text-[10px] text-zinc-500">Anti-detection health check</p>
              </div>
              <span
                className="ml-auto rounded-full px-2 py-1 text-[10px] font-extrabold text-emerald-300"
                style={{ background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.28)" }}
              >
                {SYBIL_SCORE.grade}
              </span>
            </div>

            {/* Score ring + text */}
            <div className="flex items-center gap-4 mb-4">
              <ScoreRing score={SYBIL_SCORE.total} max={SYBIL_SCORE.maxTotal} />
              <div className="flex-1">
                <p className="text-[13px] font-bold text-emerald-300 mb-1">{SYBIL_SCORE.label}!</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {SYBIL_SCORE.statusText}
                </p>
              </div>
            </div>

            {/* Pacifica Boost banner */}
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3"
              style={{ background: "rgba(14,165,233,0.10)", border: "1px solid rgba(14,165,233,0.22)" }}
            >
              <span className="text-[16px]">🌊</span>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-sky-300">Pacifica Ecosystem Boost</p>
                <p className="text-[10px] text-zinc-500">Active partnership bonus</p>
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-extrabold text-emerald-300"
                style={{ background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.28)" }}
              >
                +{SYBIL_SCORE.pacificaBoost} pts
              </span>
            </div>

            {/* Score breakdown toggle */}
            <button
              onClick={() => setScoreExpanded((p) => !p)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-[12px] font-semibold text-zinc-400 transition-all active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              Score Breakdown
              {scoreExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            {scoreExpanded && (
              <div className="mt-2 space-y-2">
                {SYBIL_SCORE.breakdown.map((b) => (
                  <div key={b.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-zinc-400">{b.label}</span>
                      <span className="text-[11px] font-bold text-zinc-300">{b.score}/{b.maxScore}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div
                        className={`h-full rounded-full ${b.color}`}
                        style={{ width: `${(b.score / b.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 4. Chain Distribution ──────────────────────────────── */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-zinc-600">Chain Distribution</p>
          {/* Stacked bar */}
          <div className="flex h-3 overflow-hidden rounded-full mb-3">
            {CHAIN_ACTIVITY.map((ch) => (
              <div
                key={ch.chain}
                title={`${ch.chain}: ${ch.pct}%`}
                style={{
                  width: `${ch.pct}%`,
                  background: `linear-gradient(90deg, ${ch.gradientFrom}, ${ch.gradientTo})`,
                }}
              />
            ))}
          </div>
          {/* Legend */}
          <div className="space-y-2">
            {CHAIN_ACTIVITY.map((ch) => (
              <div key={ch.chain} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: ch.gradientFrom }}
                />
                <span className="text-[11px] text-zinc-400 flex-1">{ch.emoji} {ch.chain}</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${ch.pct}%`, background: `linear-gradient(90deg,${ch.gradientFrom},${ch.gradientTo})` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-zinc-600 w-8 text-right">{ch.pct}%</span>
                <span className="text-[10px] text-zinc-600 w-12 text-right">${ch.volumeUSD}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Achievements ────────────────────────────────────── */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-zinc-600">Achievements</p>
            <span className="text-[11px] text-violet-400 font-semibold">3/6 Unlocked</span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {[
              { icon: "🔥", label: "Streak 7", unlocked: true },
              { icon: "🌉", label: "Bridger", unlocked: true },
              { icon: "💧", label: "LP Pro", unlocked: true },
              { icon: "⚡", label: "Speed Run", unlocked: false },
              { icon: "🏆", label: "Top 10%", unlocked: false },
              { icon: "🛡️", label: "Sybil-Free", unlocked: false },
            ].map((a) => (
              <div
                key={a.label}
                title={a.label}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-[18px] transition-all"
                  style={
                    a.unlocked
                      ? {
                          background: "rgba(139,92,246,0.18)",
                          border: "1px solid rgba(139,92,246,0.35)",
                          boxShadow: "0 0 12px rgba(139,92,246,0.25)",
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          filter: "grayscale(1)",
                          opacity: 0.35,
                        }
                  }
                >
                  {a.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. Recent Activity Feed ─────────────────────────────── */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[12px] font-semibold uppercase tracking-widest text-zinc-600">Recent Activity</p>
            </div>
            <Award className="h-3.5 w-3.5 text-zinc-600" />
          </div>

          <div className="space-y-2">
            {visibleActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-[18px] shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-zinc-300 truncate">{item.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-zinc-600">{item.chainEmoji} {item.chain}</span>
                    <span className="text-zinc-700">·</span>
                    <span className="text-[10px] text-zinc-600">{item.timeAgo}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className="flex items-center gap-0.5 text-[10px] font-bold text-violet-400"
                    style={{ background: "rgba(139,92,246,0.12)", padding: "2px 6px", borderRadius: 99 }}
                  >
                    <Zap className="h-2.5 w-2.5" /> +{item.xpGained}
                  </span>
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAllActivity((p) => !p)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold text-zinc-500 transition-all active:scale-[0.98]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {showAllActivity ? (
              <><ChevronUp className="h-3.5 w-3.5" /> Show Less</>
            ) : (
              <><ChevronDown className="h-3.5 w-3.5" /> Show All ({RECENT_ACTIVITY.length})</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
