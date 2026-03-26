// src/components/ProfilePage.tsx
import { useState, useEffect } from "react";
import {
  User, Shield, Activity, Layers, Zap, ChevronDown, ChevronUp,
  Wallet, Copy, Check, RefreshCw, AlertTriangle, CheckCircle2,
  Search, X, Eye, Clock,
} from "lucide-react";
import {
  getSybilScore, scanWallet,
  type SybilScoreData, type ScanResult,
} from "../services/api";
import type { WalletState } from "../hooks/useWallet";

const CHAIN_CFG: Record<string, { emoji: string; color: string }> = {
  solana:    { emoji: "◎",  color: "#9945ff" },
  ethereum:  { emoji: "⟠",  color: "#627eea" },
  arbitrum:  { emoji: "🔵", color: "#28a0f0" },
  optimism:  { emoji: "🔴", color: "#ff0420" },
  base:      { emoji: "🔵", color: "#0052ff" },
  polygon:   { emoji: "🟣", color: "#8247e5" },
  linea:     { emoji: "🔷", color: "#61dfff" },
  scroll:    { emoji: "📜", color: "#ffeeda" },
  zksync:    { emoji: "⚡", color: "#8c8dfc" },
};

const LEVELS = [
  { name: "Newbie",      emoji: "🌑", min: 0,  color: "#71717a" },
  { name: "Explorer",    emoji: "🌘", min: 20, color: "#a78bfa" },
  { name: "Farmer",      emoji: "🌗", min: 40, color: "#38bdf8" },
  { name: "Pro Farmer",  emoji: "🌖", min: 60, color: "#34d399" },
  { name: "Void Master", emoji: "🌕", min: 80, color: "#fbbf24" },
];

function getLevel(score: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].min) return LEVELS[i];
  }
  return LEVELS[0];
}

interface ProfilePageProps {
  wallet: WalletState;
}

export function ProfilePage({ wallet }: ProfilePageProps) {
  const [sybil, setSybil] = useState<SybilScoreData | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [evmAddress, setEvmAddress] = useState(() => localStorage.getItem("vd_evm") || "");
  const [evmInput, setEvmInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showChains, setShowChains] = useState(true);
  const [copied, setCopied] = useState("");

  // Загрузка sybil score
  useEffect(() => {
    getSybilScore().then((d) => {
      setSybil(d);
      setLoading(false);
    });
  }, []);

  // Авто-скан при загрузке если есть адреса
  useEffect(() => {
    const sol = wallet.wallet;
    const evm = evmAddress;
    if (sol || evm) {
      doScan(sol, evm);
    }
  }, [wallet.wallet]);

  const doScan = async (sol?: string | null, evm?: string | null) => {
    if (!sol && !evm) return;
    setScanning(true);
    const result = await scanWallet(sol, evm || undefined);
    if (result) setScan(result);
    setScanning(false);
  };

  const saveEvmAddress = () => {
    const addr = evmInput.trim();
    if (!addr.startsWith("0x") || addr.length !== 42) return;
    setEvmAddress(addr);
    localStorage.setItem("vd_evm", addr);
    setEvmInput("");
    doScan(wallet.wallet, addr);
  };

  const removeEvm = () => {
    setEvmAddress("");
    localStorage.removeItem("vd_evm");
    // Ре-скан только с Solana
    if (wallet.wallet) doScan(wallet.wallet, null);
    else setScan(null);
  };

  const copyAddr = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(addr);
    setTimeout(() => setCopied(""), 2000);
  };

  // Общий скор = среднее из sybil + farming
  const sybilScore = sybil?.total_score ?? 0;
  const farmingScore = scan?.summary.farming_score ?? 0;
  const combinedScore = scan ? Math.round((sybilScore + farmingScore) / 2) : sybilScore;
  const level = getLevel(combinedScore);

  const ringColor = combinedScore >= 70 ? "#10b981" : combinedScore >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Header ═══════════════════════════ */}
      <div className="sticky top-0 z-30 px-4 py-3"
        style={{ background: "rgba(9,9,11,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${level.color}25` }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" style={{ color: level.color }} />
              <h1 className="text-[18px] font-extrabold text-white">Profile</h1>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mt-0.5" style={{ color: `${level.color}99` }}>
              {level.emoji} {level.name}
            </p>
          </div>
          <button onClick={() => doScan(wallet.wallet, evmAddress || null)}
            className="flex h-8 w-8 items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <RefreshCw className={`h-3.5 w-3.5 text-zinc-400 ${scanning ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ══ Body ══════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Score Ring + Level ───────────── */}
            <div className="relative overflow-hidden rounded-2xl py-6"
              style={{ background: `${ringColor}08`, border: `1px solid ${ringColor}20` }}>
              <div className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${ringColor}80, transparent)` }} />

              <div className="flex items-center justify-center gap-6">
                {/* Ring */}
                <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
                  <svg width={100} height={100} className="-rotate-90">
                    <circle cx={50} cy={50} r={42} stroke="rgba(255,255,255,0.06)" strokeWidth={7} fill="none" />
                    <circle cx={50} cy={50} r={42}
                      stroke={ringColor} strokeWidth={7} fill="none" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - combinedScore / 100)}
                      style={{ transition: "stroke-dashoffset 1.5s ease", filter: `drop-shadow(0 0 6px ${ringColor})` }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[24px] font-black text-white">{combinedScore}</span>
                    <span className="text-[8px] font-bold uppercase text-zinc-500">/100</span>
                  </div>
                </div>

                {/* Level info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[22px]">{level.emoji}</span>
                    <div>
                      <p className="text-[15px] font-extrabold" style={{ color: level.color }}>{level.name}</p>
                      <p className="text-[10px] text-zinc-600">Farming Level</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-zinc-600">Shield</span>
                      <span className="font-bold" style={{ color: ringColor }}>{sybilScore}/100</span>
                    </div>
                    {scan && (
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-600">Chains</span>
                        <span className="font-bold" style={{ color: ringColor }}>{farmingScore}/100</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Wallets ─────────────────────── */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Wallets</p>

              {/* Solana */}
              {wallet.isConnected && wallet.wallet ? (
                <div className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: "rgba(153,69,255,0.06)", border: "1px solid rgba(153,69,255,0.15)" }}>
                  <span className="text-[18px]">◎</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-white">Solana (Pacifica)</p>
                    <p className="text-[10px] font-mono text-zinc-500 truncate">{wallet.wallet}</p>
                  </div>
                  <button onClick={() => copyAddr(wallet.wallet!)} className="active:scale-90">
                    {copied === wallet.wallet
                      ? <Check className="h-3.5 w-3.5 text-emerald-400" />
                      : <Copy className="h-3.5 w-3.5 text-zinc-600" />}
                  </button>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"
                    style={{ boxShadow: "0 0 6px rgba(16,185,129,0.8)" }} />
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-[18px]">◎</span>
                  <div className="flex-1">
                    <p className="text-[12px] font-bold text-zinc-400">Solana — Not connected</p>
                    <p className="text-[10px] text-zinc-600">Connect via bot</p>
                  </div>
                  <button onClick={() => {
                    const tg = (window as any).Telegram?.WebApp;
                    if (tg) tg.openTelegramLink("https://t.me/web3scan_assistant_bot");
                  }}
                    className="rounded-lg px-2.5 py-1 text-[10px] font-bold text-violet-400 active:scale-95"
                    style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}>
                    Connect
                  </button>
                </div>
              )}

              {/* EVM */}
              {evmAddress ? (
                <div className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: "rgba(98,126,234,0.06)", border: "1px solid rgba(98,126,234,0.15)" }}>
                  <span className="text-[18px]">⟠</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-white">EVM Wallet</p>
                    <p className="text-[10px] font-mono text-zinc-500 truncate">{evmAddress}</p>
                  </div>
                  <button onClick={() => copyAddr(evmAddress)} className="active:scale-90">
                    {copied === evmAddress
                      ? <Check className="h-3.5 w-3.5 text-emerald-400" />
                      : <Copy className="h-3.5 w-3.5 text-zinc-600" />}
                  </button>
                  <button onClick={removeEvm} className="active:scale-90">
                    <X className="h-3.5 w-3.5 text-zinc-600" />
                  </button>
                </div>
              ) : (
                <div className="rounded-xl p-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-[11px] font-bold text-zinc-400 mb-2">Add EVM Wallet</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="0x..." value={evmInput}
                      onChange={(e) => setEvmInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEvmAddress()}
                      className="flex-1 h-8 rounded-lg px-3 text-[12px] font-mono text-zinc-200 placeholder-zinc-600"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }} />
                    <button onClick={saveEvmAddress}
                      className="rounded-lg px-3 py-1 text-[11px] font-bold text-white active:scale-95"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Quick Stats ─────────────────── */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1 rounded-2xl py-3"
                style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)" }}>
                <Layers className="h-4 w-4 text-violet-400" />
                <span className="text-[16px] font-extrabold text-violet-400">
                  {scan ? scan.summary.active_chains : "—"}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Chains</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-2xl py-3"
                style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.18)" }}>
                <Activity className="h-4 w-4 text-sky-400" />
                <span className="text-[16px] font-extrabold text-sky-400">
                  {scan ? scan.summary.total_tx : "—"}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Total TX</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-2xl py-3"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)" }}>
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-[16px] font-extrabold text-amber-400">
                  {sybil?.stats.tasks_completed ?? "—"}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">Tasks</span>
              </div>
            </div>

            {/* ── Chain Activity ───────────────── */}
            {scan && scan.chains.length > 0 && (
              <div>
                <button onClick={() => setShowChains(p => !p)}
                  className="flex w-full items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
                    Chain Activity
                  </p>
                  {showChains ? <ChevronUp className="h-3.5 w-3.5 text-zinc-600" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-600" />}
                </button>

                {showChains && (
                  <div className="space-y-1.5">
                    {scan.chains.map((chain) => {
                      const cfg = CHAIN_CFG[chain.chain] || { emoji: "⬡", color: "#71717a" };
                      return (
                        <div key={chain.chain}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                          style={{
                            background: chain.active ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                            border: `1px solid ${chain.active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
                            opacity: chain.active ? 1 : 0.45,
                          }}>
                          <span className="text-[16px] shrink-0">{cfg.emoji}</span>
                          <div className="flex-1">
                            <p className="text-[12px] font-bold capitalize text-white">{chain.chain}</p>
                            {chain.balance > 0 && (
                              <p className="text-[10px] text-zinc-600">{chain.balance.toFixed(4)} {chain.native}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-[14px] font-extrabold" style={{ color: chain.active ? cfg.color : "#3f3f46" }}>
                              {chain.tx_count}
                            </p>
                            <p className="text-[8px] text-zinc-600 uppercase">TX</p>
                          </div>
                          {chain.active && <div className="h-5 w-1 rounded-full" style={{ background: cfg.color }} />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Scan button если нет данных */}
            {!scan && !scanning && (wallet.wallet || evmAddress) && (
              <button onClick={() => doScan(wallet.wallet, evmAddress || null)}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-[13px] font-bold text-white active:scale-[0.97]"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
                <Search className="h-4 w-4" /> Scan All Chains
              </button>
            )}

            {scanning && (
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="h-5 w-5 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
                <span className="text-[12px] text-zinc-500">Scanning chains...</span>
              </div>
            )}

            {/* ── Shield Breakdown ─────────────── */}
            {sybil && (
              <div>
                <button onClick={() => setShowBreakdown(p => !p)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 mb-2 active:scale-[0.98]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-violet-400" />
                    <span className="text-[13px] font-bold text-white">Sybil Shield</span>
                    <span className="text-[11px] font-extrabold" style={{ color: ringColor }}>
                      {sybil.grade}
                    </span>
                  </div>
                  {showBreakdown ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
                </button>

                {showBreakdown && (
                  <div className="space-y-2">
                    {sybil.breakdown.map((item, i) => {
                      const pct = (item.score / item.max) * 100;
                      const barColor = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";
                      return (
                        <div key={item.label} className="rounded-xl p-3"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[12px] font-semibold text-zinc-300">{item.label}</span>
                            <span className="text-[12px] font-extrabold" style={{ color: barColor }}>{item.score}/{item.max}</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                            <div className="h-full rounded-full transition-all duration-1000"
                              style={{ width: `${pct}%`, background: barColor }} />
                          </div>
                          <p className="text-[10px] text-zinc-600 mt-1">{item.description}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Tips ────────────────────────── */}
            {sybil?.tips && (
              <div className="space-y-1.5">
                {sybil.tips.slice(0, 3).map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl px-3 py-2.5"
                    style={{
                      background: tip.status === "good" ? "rgba(16,185,129,0.05)" : "rgba(245,158,11,0.05)",
                      border: `1px solid ${tip.status === "good" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)"}`,
                    }}>
                    <span className="text-[14px] shrink-0">{tip.emoji}</span>
                    <p className="text-[11px] text-zinc-400 flex-1">{tip.text}</p>
                    {tip.status === "good"
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      : <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}