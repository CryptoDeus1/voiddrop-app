import { useState, useEffect } from "react";
import {
  Shield, AlertTriangle, CheckCircle2, Clock,
  Fingerprint, Activity, Globe, Layers,
  ChevronDown, ChevronUp, Zap, Eye,
} from "lucide-react";
import type { WalletState } from "../hooks/useWallet";

/* ── Shield Ring SVG ─────────────────────────────────── */
function ShieldRing({ score, max }: { score: number; max: number }) {
  const r = 56;
  const sw = 8;
  const nr = r - sw / 2;
  const c = 2 * Math.PI * nr;
  const pct = score / max;
  const off = c - pct * c;

  const getColor = () => {
    if (pct >= 0.8) return { main: "#10b981", glow: "rgba(16,185,129,0.4)" };
    if (pct >= 0.6) return { main: "#0ea5e9", glow: "rgba(14,165,233,0.4)" };
    if (pct >= 0.4) return { main: "#f59e0b", glow: "rgba(245,158,11,0.4)" };
    return { main: "#ef4444", glow: "rgba(239,68,68,0.4)" };
  };

  const color = getColor();

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute rounded-full blur-xl opacity-40"
        style={{
          width: r * 2 + 20,
          height: r * 2 + 20,
          background: `radial-gradient(circle, ${color.main}, transparent)`,
        }}
      />
      {[0.85, 0.7, 0.55].map((scale, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: r * 2 * scale,
            height: r * 2 * scale,
            border: `1px solid ${color.main}${20 + i * 8}`,
            opacity: 0.3 - i * 0.08,
          }}
        />
      ))}
      <svg width={r * 2} height={r * 2} className="-rotate-90" overflow="visible">
        <defs>
          <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color.main} />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="shield-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={r} cy={r} r={nr} stroke="rgba(255,255,255,0.06)" strokeWidth={sw} fill="none" />
        <circle
          cx={r} cy={r} r={nr}
          stroke="url(#shield-grad)" strokeWidth={sw} fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          filter="url(#shield-glow)"
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[28px]">🛡️</span>
        <span className="text-[26px] font-black text-white leading-none mt-1">{score}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">/ {max}</span>
      </div>
    </div>
  );
}

/* ── Risk Level Component ────────────────────────────── */
function RiskLevel({ level }: { level: "LOW" | "MED" | "HIGH" | "CRITICAL" }) {
  const config = {
    LOW:      { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", icon: "🟢", text: "Low Risk — Shields Strong" },
    MED:      { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", icon: "🟡", text: "Medium Risk — Reinforce Shields" },
    HIGH:     { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)",  icon: "🔴", text: "High Risk — Shields Weakening" },
    CRITICAL: { color: "#dc2626", bg: "rgba(220,38,38,0.12)",  border: "rgba(220,38,38,0.25)",  icon: "⚠️", text: "Critical — Shields Down!" },
  };
  const c = config[level];

  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3 py-2"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <span className="text-[14px]">{c.icon}</span>
      <span className="text-[12px] font-bold" style={{ color: c.color }}>{c.text}</span>
    </div>
  );
}

/* ── Score Breakdown Bar ─────────────────────────────── */
function ScoreBar({ label, score, max, icon, color, description }: {
  label: string;
  score: number;
  max: number;
  icon: React.ElementType;
  color: string;
  description: string;
}) {
  const pct = (score / max) * 100;
  const Icon = icon;

  return (
    <div
      className="rounded-xl p-3"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" style={{ color }} />
          <span className="text-[12px] font-semibold text-zinc-300">{label}</span>
        </div>
        <span className="text-[12px] font-extrabold" style={{ color }}>
          {score}/{max}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
      <p className="text-[10px] text-zinc-600 mt-1.5">{description}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Mock Sybil Data
══════════════════════════════════════════════════════ */
const SYBIL_DATA = {
  totalScore: 82,
  maxScore: 100,
  riskLevel: "LOW" as const,
  grade: "A",
  breakdown: [
    {
      label: "Wallet Age",
      score: 23,
      max: 25,
      icon: Clock,
      color: "#f59e0b",
      description: "Account maturity & first transaction date",
    },
    {
      label: "Tx Diversity",
      score: 20,
      max: 25,
      icon: Fingerprint,
      color: "#8b5cf6",
      description: "Variety of contract types interacted with",
    },
    {
      label: "Time Spacing",
      score: 19,
      max: 25,
      icon: Activity,
      color: "#0ea5e9",
      description: "Gap between transactions (organic timing)",
    },
    {
      label: "Volume Pattern",
      score: 20,
      max: 25,
      icon: Layers,
      color: "#10b981",
      description: "Randomness of transaction amounts",
    },
  ],
  tips: [
    { emoji: "🎲", text: "Use random amounts like $47.83 instead of $50.00", status: "good" },
    { emoji: "⏰", text: "Space transactions 2-6 hours apart", status: "good" },
    { emoji: "🔗", text: "Interact with 5+ different protocols", status: "warning" },
    { emoji: "📅", text: "Maintain daily activity for 30+ days", status: "good" },
    { emoji: "🌐", text: "Use multiple chains, not just one", status: "warning" },
    { emoji: "💰", text: "Vary transaction sizes significantly", status: "good" },
  ],
  shields: 4,
};

/* ══════════════════════════════════════════════════════
   MAIN — ShieldPage
══════════════════════════════════════════════════════ */
interface ShieldPageProps {
  wallet: WalletState;
}

export function ShieldPage({ wallet }: ShieldPageProps) {
  const [expanded, setExpanded] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const data = SYBIL_DATA;

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Sticky Header ═══════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: "rgba(9,9,11,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(16,185,129,0.15)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <h1 className="text-[18px] font-extrabold text-white tracking-tight">Sybil Shield</h1>
            </div>
            <p className="text-[10px] text-emerald-400/60 font-semibold uppercase tracking-[0.15em] mt-0.5">
              Anti-Detection Armor System
            </p>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-6 w-2 rounded-full transition-all duration-500"
                style={{
                  background: i <= data.shields
                    ? "linear-gradient(180deg, #10b981, #059669)"
                    : "rgba(255,255,255,0.07)",
                  boxShadow: i <= data.shields ? "0 0 6px rgba(16,185,129,0.5)" : "none",
                  transitionDelay: `${i * 100}ms`,
                  opacity: animateIn ? 1 : 0,
                  transform: animateIn ? "scaleY(1)" : "scaleY(0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══ Scrollable Body ═════════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* ── Main Shield Ring ─────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl py-8"
          style={{
            background: "rgba(16,185,129,0.04)",
            border: "1px solid rgba(16,185,129,0.12)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
          <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 -bottom-8 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-4">
            <ShieldRing score={data.totalScore} max={data.maxScore} />

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className="rounded-full px-3 py-1 text-[14px] font-extrabold"
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    color: "#34d399",
                    border: "1px solid rgba(16,185,129,0.30)",
                    boxShadow: "0 0 12px rgba(16,185,129,0.20)",
                  }}
                >
                  Grade: {data.grade}
                </span>
              </div>
              <p className="text-[12px] text-zinc-400 max-w-[260px] leading-relaxed">
                Your organic behavior puts you in the <span className="text-emerald-400 font-bold">top 15%</span> of wallets.
                Keep diversifying your activity!
              </p>
            </div>

            <RiskLevel level={data.riskLevel} />
          </div>
        </div>

        {/* ── Shield Breakdown ─────────────────────────────── */}
        <div>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 mb-2 transition-all active:scale-[0.98]"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-violet-400" />
              <span className="text-[13px] font-bold text-white">Shield Analysis</span>
            </div>
            {expanded
              ? <ChevronUp className="h-4 w-4 text-zinc-500" />
              : <ChevronDown className="h-4 w-4 text-zinc-500" />
            }
          </button>

          {expanded && (
            <div className="space-y-2">
              {data.breakdown.map((item) => (
                <ScoreBar key={item.label} {...item} />
              ))}
            </div>
          )}
        </div>

        {/* ── Protection Tips ──────────────────────────────── */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <p className="text-[12px] font-bold text-white">Shield Reinforcement Tips</p>
          </div>

          <div className="space-y-2">
            {data.tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                style={{
                  background: tip.status === "good"
                    ? "rgba(16,185,129,0.06)"
                    : "rgba(245,158,11,0.06)",
                  border: `1px solid ${tip.status === "good"
                    ? "rgba(16,185,129,0.15)"
                    : "rgba(245,158,11,0.15)"}`,
                }}
              >
                <span className="text-[16px] shrink-0 mt-0.5">{tip.emoji}</span>
                <div className="flex-1">
                  <p className="text-[12px] text-zinc-300 leading-relaxed">{tip.text}</p>
                </div>
                {tip.status === "good" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Pacifica Shield Boost ────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(139,92,246,0.08))",
            border: "1px solid rgba(14,165,233,0.18)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />

          <div className="relative flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[20px]"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                boxShadow: "0 4px 14px rgba(14,165,233,0.35)",
              }}
            >
              🌊
            </div>
            <div className="flex-1">
              <p className="text-[12px] font-bold text-white">Pacifica Ecosystem Boost</p>
              <p className="text-[10px] text-zinc-500">Active trading on Pacifica strengthens your shield</p>
            </div>
            <div
              className="flex items-center gap-1 rounded-xl px-2.5 py-1.5"
              style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}
            >
              <Zap className="h-3 w-3 text-emerald-400" />
              <span className="text-[11px] font-extrabold text-emerald-400">+10 pts</span>
            </div>
          </div>
        </div>

        {/* ── Wallet Status ────────────────────────────────── */}
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: wallet.isConnected
              ? "rgba(16,185,129,0.06)"
              : "rgba(255,255,255,0.03)",
            border: `1px solid ${wallet.isConnected
              ? "rgba(16,185,129,0.15)"
              : "rgba(255,255,255,0.07)"}`,
          }}
        >
          {wallet.isConnected ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
              <p className="text-[12px] font-bold text-emerald-400">Wallet Linked — {wallet.walletShort}</p>
              <p className="text-[10px] text-zinc-600 mt-1">Shield analysis based on your on-chain data</p>
            </>
          ) : (
            <>
              <Globe className="h-5 w-5 text-zinc-600 mx-auto mb-2" />
              <p className="text-[12px] font-bold text-zinc-400">Connect wallet in Telegram bot</p>
              <p className="text-[10px] text-zinc-600 mt-1">Link your wallet for personalized shield analysis</p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}