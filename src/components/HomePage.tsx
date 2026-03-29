// src/components/HomePage.tsx
import { useState, useEffect } from "react";
import {
  Zap, ArrowRight, ExternalLink, Activity, Globe,
  Shield, Layers, TrendingUp, Users, Star,
  Sparkles, ChevronRight, BookOpen, Radar,
} from "lucide-react";
import { PacificaBanner } from "./PacificaBanner";
import {
  getDropsStats, getActionHistory, getSybilScore,
  type DropsStats,
} from "../services/api";
import { NETWORKS } from "../data/networks";
import type { WalletState } from "../hooks/useWallet";
import type { TabId } from "./BottomNav";

interface HomePageProps {
  wallet: WalletState;
  onNavigate: (tab: TabId) => void;
}

/* ── Animated Particles ── */
function VoidParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            background: `rgba(139,92,246,${0.15 + Math.random() * 0.2})`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

export function HomePage({ wallet, onNavigate }: HomePageProps) {
  const [stats, setStats] = useState<DropsStats | null>(null);
  const [totalActions, setTotalActions] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [sybilScore, setSybilScore] = useState(0);

  useEffect(() => {
    getDropsStats().then(setStats);
    getActionHistory().then((d) => {
      if (d) {
        setTotalActions(d.total_actions);
        setTotalXP(d.total_xp);
      }
    });
    getSybilScore().then((d) => {
      if (d) setSybilScore(d.total_score);
    });
  }, []);

  const greeting = wallet.isConnected
    ? `Welcome back, ${wallet.firstName} 👋`
    : "Welcome to VoidDrop 🚀";

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Header ═══════════════════════════ */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: "rgba(9,9,11,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg"
              style={{ boxShadow: "0 0 16px rgba(139,92,246,0.40)" }}
            >
              <Zap className="h-4 w-4 text-white" fill="white" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
            </div>
            <div>
              <span className="block text-[13px] font-bold tracking-tight text-white">VoidDrop</span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.15em] text-violet-400">
                Explore the Void
              </span>
            </div>
          </div>

          {wallet.isConnected && (
            <div
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
              style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.30)",
              }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400"
                style={{ boxShadow: "0 0 6px rgba(16,185,129,0.8)" }} />
              <span className="text-[12px] font-semibold text-emerald-300">{wallet.walletShort}</span>
            </div>
          )}
        </div>
      </div>

      {/* ══ Body ══════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* ── Hero Banner ────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(88,28,135,0.50) 0%, rgba(30,27,75,0.70) 50%, rgba(9,9,11,0.90) 100%)",
            border: "1px solid rgba(139,92,246,0.20)",
            boxShadow: "0 0 40px -10px rgba(139,92,246,0.20)",
          }}
        >
          <VoidParticles />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="relative">
            <p className="text-[14px] font-bold text-zinc-300">{greeting}</p>
            <h1 className="text-[22px] font-black text-white mt-1 leading-tight">
              Simplify Your
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #38bdf8, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Airdrop Farming
              </span>
            </h1>
            <p className="text-[12px] text-zinc-400 mt-2 leading-relaxed">
              Farm airdrops from your phone. Bridge, swap, stake — verify everything in one place.
            </p>

            <button
              onClick={() => onNavigate("networks")}
              className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold text-white active:scale-95 transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                boxShadow: "0 4px 16px rgba(124,58,237,0.40)",
              }}
            >
              <Globe className="h-4 w-4" />
              Start Farming
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ── Quick Stats ────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onNavigate("networks")}
            className="flex flex-col items-center gap-1 rounded-2xl py-3 active:scale-95 transition-all"
            style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)" }}
          >
            <Layers className="h-4 w-4 text-violet-400" />
            <span className="text-[16px] font-extrabold text-violet-400">{NETWORKS.length}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Networks</span>
          </button>
          <button
            onClick={() => onNavigate("profile")}
            className="flex flex-col items-center gap-1 rounded-2xl py-3 active:scale-95 transition-all"
            style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.18)" }}
          >
            <Activity className="h-4 w-4 text-sky-400" />
            <span className="text-[16px] font-extrabold text-sky-400">{totalActions}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Actions</span>
          </button>
          <button
            onClick={() => onNavigate("profile")}
            className="flex flex-col items-center gap-1 rounded-2xl py-3 active:scale-95 transition-all"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)" }}
          >
            <Shield className="h-4 w-4 text-amber-400" />
            <span className="text-[16px] font-extrabold text-amber-400">{sybilScore}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Score</span>
          </button>
        </div>

        {/* ── Hot Networks ───────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
              🔥 Hot Networks
            </p>
            <button onClick={() => onNavigate("networks")}
              className="flex items-center gap-1 text-[11px] font-semibold text-violet-400 active:scale-95">
              View All <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 snap-x">
            {NETWORKS.slice(0, 4).map((net) => (
              <button
                key={net.id}
                onClick={() => onNavigate("networks")}
                className="snap-start shrink-0 flex flex-col items-center gap-2 rounded-2xl p-3.5 active:scale-95 transition-all"
                style={{
                  width: 100,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-[20px]"
                  style={{
                    background: `linear-gradient(135deg, ${net.gradFrom}, ${net.gradTo})`,
                    boxShadow: `0 4px 12px ${net.color}40`,
                  }}
                >
                  {net.emoji}
                </div>
                <span className="text-[12px] font-bold text-white">{net.name}</span>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase"
                  style={
                    net.type === "mainnet"
                      ? { background: "rgba(16,185,129,0.12)", color: "#6ee7b7" }
                      : { background: "rgba(59,130,246,0.12)", color: "#93c5fd" }
                  }
                >
                  {net.type}
                </span>
                {net.probability && (
                  <span className="text-[9px] font-semibold"
                    style={{ color: net.probability === "Confirmed" ? "#6ee7b7" : "#fcd34d" }}>
                    {net.probability}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Pacifica Banner ────────────── */}
        <PacificaBanner />

        {/* ── Quick Actions ──────────────── */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">
            ⚡ Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigate("networks")}
              className="flex items-center gap-3 rounded-2xl p-3.5 active:scale-[0.97] transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Globe className="h-5 w-5 text-violet-400" />
              <div className="text-left">
                <p className="text-[12px] font-bold text-white">Farm</p>
                <p className="text-[9px] text-zinc-600">Networks</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate("terminal")}
              className="flex items-center gap-3 rounded-2xl p-3.5 active:scale-[0.97] transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Radar className="h-5 w-5 text-sky-400" />
              <div className="text-left">
                <p className="text-[12px] font-bold text-white">Trade</p>
                <p className="text-[9px] text-zinc-600">Pacifica</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate("education")}
              className="flex items-center gap-3 rounded-2xl p-3.5 active:scale-[0.97] transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <div className="text-left">
                <p className="text-[12px] font-bold text-white">Learn</p>
                <p className="text-[9px] text-zinc-600">Academy</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate("profile")}
              className="flex items-center gap-3 rounded-2xl p-3.5 active:scale-[0.97] transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Shield className="h-5 w-5 text-amber-400" />
              <div className="text-left">
                <p className="text-[12px] font-bold text-white">Score</p>
                <p className="text-[9px] text-zinc-600">Anti-Sybil</p>
              </div>
            </button>
          </div>
        </div>

        {/* ── Community Links ────────────── */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">
            🌐 Community
          </p>
          <div className="flex gap-2">
            <a
              href="https://t.me/DropVoid1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center gap-2.5 rounded-2xl p-3.5 active:scale-[0.97] transition-all"
              style={{
                background: "rgba(56,189,248,0.06)",
                border: "1px solid rgba(56,189,248,0.15)",
              }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[16px]"
                style={{ background: "rgba(56,189,248,0.15)" }}
              >
                📢
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-bold text-white">Telegram</p>
                <p className="text-[9px] text-zinc-500">@DropVoid1</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-sky-400" />
            </a>

            <a
              href="https://x.com/CryptoDeus01"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center gap-2.5 rounded-2xl p-3.5 active:scale-[0.97] transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[16px]"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                𝕏
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-bold text-white">Twitter</p>
                <p className="text-[9px] text-zinc-500">@CryptoDeus01</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
            </a>
          </div>
        </div>

        {/* ── About ──────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background: "rgba(139,92,246,0.05)",
            border: "1px solid rgba(139,92,246,0.12)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] font-extrabold text-white mb-1">What is VoidDrop?</p>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                VoidDrop turns complex airdrop farming into simple daily tasks you can do from your phone.
                Bridge, swap, stake across multiple chains — we verify everything and track your anti-sybil score automatically.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { emoji: "🌉", text: "Multi-chain farming" },
                  { emoji: "🛡️", text: "Anti-sybil protection" },
                  { emoji: "✅", text: "TX verification" },
                  { emoji: "📊", text: "Pacifica integration" },
                ].map((item) => (
                  <span
                    key={item.text}
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold text-zinc-400"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {item.emoji} {item.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Version Badge ──────────────── */}
        <div className="flex items-center justify-center gap-2 py-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)" }}
          >
            <Zap className="h-3 w-3 text-white" fill="white" />
          </div>
          <span className="text-[10px] font-semibold text-zinc-600">
            VoidDrop v1.0 • Hackathon Edition
          </span>
        </div>
      </div>
    </div>
  );
}