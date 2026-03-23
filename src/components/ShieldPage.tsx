import { useState, useEffect } from "react";
import {
  Shield, AlertTriangle, CheckCircle2, Clock,
  Activity, Layers, ChevronDown, ChevronUp,
  Zap, Eye, Wallet, BarChart3,
} from "lucide-react";
import { getSybilScore, type SybilScoreData } from "../services/api";
import type { WalletState } from "../hooks/useWallet";

const ICONS = [Clock, Wallet, Activity, Layers, BarChart3];

interface ShieldPageProps {
  wallet: WalletState;
}

export function ShieldPage({ wallet }: ShieldPageProps) {
  const [data, setData] = useState<SybilScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    getSybilScore().then((d) => {
      setData(d);
      setLoading(false);
    });
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const score = data?.total_score ?? 0;
  const maxScore = data?.max_score ?? 100;
  const grade = data?.grade ?? "?";
  const risk = data?.risk_level ?? "MED";
  const shields = Math.ceil((score / maxScore) * 5);

  const riskConfig = {
    LOW:      { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", icon: "🟢", text: "Low Risk — Shields Strong" },
    MED:      { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", icon: "🟡", text: "Medium Risk — Reinforce Shields" },
    HIGH:     { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)",  icon: "🔴", text: "High Risk — Shields Weakening" },
    CRITICAL: { color: "#dc2626", bg: "rgba(220,38,38,0.12)",  border: "rgba(220,38,38,0.25)",  icon: "⚠️", text: "Critical — Take Action!" },
  };
  const rc = riskConfig[risk];

  // Ring color
  const ringColor = score >= 80 ? "#10b981" : score >= 60 ? "#0ea5e9" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Header ═══════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: "rgba(9,9,11,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${ringColor}25`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" style={{ color: ringColor }} />
              <h1 className="text-[18px] font-extrabold text-white tracking-tight">Sybil Shield</h1>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mt-0.5" style={{ color: `${ringColor}99` }}>
              {loading ? "Scanning..." : "Anti-Detection Armor"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-6 w-2 rounded-full transition-all duration-500"
                style={{
                  background: i <= shields ? `linear-gradient(180deg, ${ringColor}, ${ringColor}99)` : "rgba(255,255,255,0.07)",
                  boxShadow: i <= shields ? `0 0 6px ${ringColor}80` : "none",
                  transitionDelay: `${i * 100}ms`,
                  opacity: animateIn ? 1 : 0,
                  transform: animateIn ? "scaleY(1)" : "scaleY(0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══ Body ═════════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Shield Ring */}
            <div
              className="relative overflow-hidden rounded-2xl py-8"
              style={{ background: `${ringColor}08`, border: `1px solid ${ringColor}20` }}
            >
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ringColor}80, transparent)` }} />

              <div className="relative flex flex-col items-center gap-4">
                {/* Ring */}
                <div className="relative flex items-center justify-center" style={{ width: 112, height: 112 }}>
                  <div className="absolute rounded-full blur-xl opacity-40"
                    style={{ width: 132, height: 132, background: `radial-gradient(circle, ${ringColor}, transparent)` }} />
                  <svg width={112} height={112} className="-rotate-90">
                    <circle cx={56} cy={56} r={48} stroke="rgba(255,255,255,0.06)" strokeWidth={8} fill="none" />
                    <circle
                      cx={56} cy={56} r={48}
                      stroke={ringColor} strokeWidth={8} fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - score / maxScore)}
                      style={{ transition: "stroke-dashoffset 1.5s ease", filter: `drop-shadow(0 0 6px ${ringColor})` }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[28px]">🛡️</span>
                    <span className="text-[26px] font-black text-white leading-none mt-1">{score}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">/ {maxScore}</span>
                  </div>
                </div>

                <div className="text-center">
                  <span
                    className="rounded-full px-3 py-1 text-[14px] font-extrabold"
                    style={{ background: `${ringColor}20`, color: ringColor, border: `1px solid ${ringColor}40` }}
                  >
                    Grade: {grade}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: rc.bg, border: `1px solid ${rc.border}` }}>
                  <span className="text-[14px]">{rc.icon}</span>
                  <span className="text-[12px] font-bold" style={{ color: rc.color }}>{rc.text}</span>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div>
              <button
                onClick={() => setExpanded((p) => !p)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 mb-2 transition-all active:scale-[0.98]"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-violet-400" />
                  <span className="text-[13px] font-bold text-white">Score Breakdown</span>
                </div>
                {expanded ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
              </button>

              {expanded && data?.breakdown && (
                <div className="space-y-2">
                  {data.breakdown.map((item, i) => {
                    const pct = (item.score / item.max) * 100;
                    const Icon = ICONS[i] || Activity;
                    const barColor = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";

                    return (
                      <div key={item.label} className="rounded-xl p-3"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5" style={{ color: barColor }} />
                            <span className="text-[12px] font-semibold text-zinc-300">{item.label}</span>
                          </div>
                          <span className="text-[12px] font-extrabold" style={{ color: barColor }}>
                            {item.score}/{item.max}
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 8px ${barColor}60` }} />
                        </div>
                        <p className="text-[10px] text-zinc-600 mt-1.5">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tips */}
            {data?.tips && (
              <div className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <p className="text-[12px] font-bold text-white">Shield Tips</p>
                </div>
                <div className="space-y-2">
                  {data.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                      style={{
                        background: tip.status === "good" ? "rgba(16,185,129,0.06)" : "rgba(245,158,11,0.06)",
                        border: `1px solid ${tip.status === "good" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)"}`,
                      }}>
                      <span className="text-[16px] shrink-0 mt-0.5">{tip.emoji}</span>
                      <p className="text-[12px] text-zinc-300 leading-relaxed flex-1">{tip.text}</p>
                      {tip.status === "good"
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        : <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wallet Status */}
            <div className="rounded-2xl p-4 text-center"
              style={{
                background: wallet.isConnected ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${wallet.isConnected ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.07)"}`,
              }}>
              {wallet.isConnected ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                  <p className="text-[12px] font-bold text-emerald-400">Wallet: {wallet.walletShort}</p>
                  <p className="text-[10px] text-zinc-600 mt-1">Score based on your real on-chain data</p>
                </>
              ) : (
                <>
                  <Wallet className="h-5 w-5 text-zinc-600 mx-auto mb-2" />
                  <p className="text-[12px] font-bold text-zinc-400">Connect wallet to get full score</p>
                  <p className="text-[10px] text-zinc-600 mt-1">Use the bot to link your Pacifica wallet</p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}