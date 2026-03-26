// src/components/WalletPortfolio.tsx
import { useState, useEffect } from "react";
import {
  Wallet, Activity, Layers, TrendingUp, RefreshCw,
  Search, ChevronRight, Shield, Zap, X, Copy, Check,
} from "lucide-react";
import { getWalletPortfolio, type WalletPortfolio as PortfolioType } from "../services/api";

const CHAIN_CONFIG: Record<string, { emoji: string; color: string; native: string }> = {
  ethereum:  { emoji: "⟠",  color: "#627eea", native: "ETH" },
  arbitrum:  { emoji: "🔵", color: "#28a0f0", native: "ETH" },
  optimism:  { emoji: "🔴", color: "#ff0420", native: "ETH" },
  base:      { emoji: "🔵", color: "#0052ff", native: "ETH" },
  polygon:   { emoji: "🟣", color: "#8247e5", native: "MATIC" },
  linea:     { emoji: "🔷", color: "#61dfff", native: "ETH" },
  scroll:    { emoji: "📜", color: "#ffeeda", native: "ETH" },
  zksync:    { emoji: "⚡", color: "#8c8dfc", native: "ETH" },
};

interface WalletPortfolioProps {
  onClose: () => void;
}

export function WalletPortfolioView({ onClose }: WalletPortfolioProps) {
  const [address, setAddress] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Загружаем сохранённый адрес
  useEffect(() => {
    const saved = localStorage.getItem("vd_evm_wallet");
    if (saved) {
      setAddress(saved);
      loadPortfolio(saved);
    }
  }, []);

  const loadPortfolio = async (addr: string) => {
    if (!addr || addr.length !== 42 || !addr.startsWith("0x")) {
      setError("Enter valid EVM address (0x...)");
      return;
    }
    setLoading(true);
    setError("");
    localStorage.setItem("vd_evm_wallet", addr);
    
    const data = await getWalletPortfolio(addr);
    if (data) {
      setPortfolio(data);
    } else {
      setError("Failed to load portfolio");
    }
    setLoading(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const s = portfolio?.summary;
  const scoreColor = !s ? "#71717a"
    : s.farming_score >= 70 ? "#10b981"
    : s.farming_score >= 40 ? "#f59e0b"
    : "#ef4444";

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Header ══════════════════════════ */}
      <div className="sticky top-0 z-30 px-4 py-3"
        style={{ background: "rgba(9,9,11,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-violet-400" />
              <h1 className="text-[16px] font-extrabold text-white">Chain Scanner</h1>
            </div>
            <p className="text-[9px] text-violet-400 font-semibold uppercase tracking-[0.15em]">
              Multi-Chain Portfolio
            </p>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <X className="h-4 w-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* ══ Body ═══════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* ── Address Input ── */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="0x... Enter EVM wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadPortfolio(address)}
            className="h-10 w-full rounded-xl pl-9 pr-20 text-[13px] text-zinc-200 placeholder-zinc-600 font-mono"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
          />
          <button
            onClick={() => loadPortfolio(address)}
            disabled={loading}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white active:scale-95 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}
          >
            {loading ? "..." : "Scan"}
          </button>
        </div>

        {error && (
          <p className="text-[12px] text-red-400 text-center">{error}</p>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
            <p className="text-[12px] text-zinc-500">Scanning 8 chains...</p>
          </div>
        )}

        {portfolio && !loading && (
          <>
            {/* ── Farming Score Ring ── */}
            <div className="relative overflow-hidden rounded-2xl p-5"
              style={{ background: `${scoreColor}08`, border: `1px solid ${scoreColor}20` }}>
              <div className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${scoreColor}80, transparent)` }} />

              <div className="flex items-center gap-4">
                {/* Score Ring */}
                <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
                  <svg width={80} height={80} className="-rotate-90">
                    <circle cx={40} cy={40} r={34} stroke="rgba(255,255,255,0.06)" strokeWidth={6} fill="none" />
                    <circle cx={40} cy={40} r={34}
                      stroke={scoreColor} strokeWidth={6} fill="none" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 34}
                      strokeDashoffset={2 * Math.PI * 34 * (1 - s!.farming_score / 100)}
                      style={{ transition: "stroke-dashoffset 1.5s ease", filter: `drop-shadow(0 0 4px ${scoreColor})` }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[20px] font-black text-white">{s!.farming_score}</span>
                    <span className="text-[8px] font-bold uppercase text-zinc-500">score</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Layers className="h-3 w-3" /> Active Chains
                    </span>
                    <span className="text-[13px] font-extrabold text-white">
                      {s!.active_chains}/{s!.total_chains}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Activity className="h-3 w-3" /> Total TX
                    </span>
                    <span className="text-[13px] font-extrabold text-white">{s!.total_transactions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Total Balance
                    </span>
                    <span className="text-[13px] font-extrabold text-white">
                      {s!.total_balance_eth.toFixed(4)} ETH
                    </span>
                  </div>
                </div>
              </div>

              {/* Address bar */}
              <div className="flex items-center gap-2 mt-3 rounded-xl px-3 py-2"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="text-[11px] font-mono text-zinc-400 flex-1 truncate">
                  {portfolio.address}
                </span>
                <button onClick={copyAddress} className="shrink-0 active:scale-90">
                  {copied
                    ? <Check className="h-3.5 w-3.5 text-emerald-400" />
                    : <Copy className="h-3.5 w-3.5 text-zinc-600" />
                  }
                </button>
              </div>
            </div>

            {/* ── Chain List ── */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">
                Chain Activity
              </p>
              <div className="space-y-2">
                {portfolio.chains.map((chain) => {
                  const cfg = CHAIN_CONFIG[chain.chain] || { emoji: "⬡", color: "#71717a", native: "ETH" };
                  return (
                    <div key={chain.chain}
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={{
                        background: chain.active ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${chain.active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
                        opacity: chain.active ? 1 : 0.5,
                      }}
                    >
                      <span className="text-[18px] shrink-0">{cfg.emoji}</span>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold capitalize" style={{ color: chain.active ? "#fff" : "#52525b" }}>
                          {chain.chain}
                        </p>
                        <p className="text-[10px] text-zinc-600">
                          {chain.balance > 0 ? `${chain.balance.toFixed(4)} ${cfg.native}` : "No balance"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-extrabold" style={{ color: chain.active ? cfg.color : "#3f3f46" }}>
                          {chain.tx_count}
                        </p>
                        <p className="text-[9px] text-zinc-600 uppercase">TX</p>
                      </div>
                      {chain.active && (
                        <div className="h-6 w-1 rounded-full" style={{ background: cfg.color }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Refresh ── */}
            <button onClick={() => loadPortfolio(address)}
              className="flex items-center justify-center gap-2 rounded-2xl py-3 text-[12px] font-semibold text-zinc-500 active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>

            {/* ── Tip ── */}
            <div className="flex items-start gap-2.5 rounded-2xl p-3.5"
              style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)" }}>
              <Shield className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                <span className="text-violet-400 font-semibold">Farming Tip:</span> Be active on 5+ chains
                with 20+ transactions each. Diversity = higher airdrop allocation.
              </p>
            </div>
          </>
        )}

        {/* ── No portfolio yet ── */}
        {!portfolio && !loading && !error && (
          <div className="flex flex-col items-center gap-3 rounded-2xl py-12"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-[40px]">🔍</span>
            <p className="text-[14px] font-bold text-zinc-400">Scan Your Wallet</p>
            <p className="text-[12px] text-zinc-600 text-center px-8">
              Enter your EVM address to see activity across 8 chains instantly
            </p>
          </div>
        )}
      </div>
    </div>
  );
}