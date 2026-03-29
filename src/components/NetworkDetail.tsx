// src/components/NetworkDetail.tsx
import { useState, useEffect } from "react";
import {
  ArrowLeft, ExternalLink, RefreshCw, CheckCircle2,
  Activity, Zap, Clock, Shield, Loader2, X, Search,
} from "lucide-react";
import type { NetworkDef, ActionCategory } from "../data/networks";
import {
  checkChain, saveAction, getActionHistory,
  type ActionRecord,
} from "../services/api";
import type { WalletState } from "../hooks/useWallet";

interface Props {
  network: NetworkDef;
  wallet: WalletState;
  onBack: () => void;
}

export function NetworkDetail({ network, wallet, onBack }: Props) {
  const [txCount, setTxCount] = useState<number | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ActionRecord[]>([]);
  const [totalXP, setTotalXP] = useState(0);

  // Текущее открытое действие
  const [openAction, setOpenAction] = useState<string | null>(null);
  // Снапшот TX count до действия
  const [snapshot, setSnapshot] = useState<number | null>(null);
  // Статус верификации
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<"success" | "fail" | null>(null);
  const [toast, setToast] = useState<string | null>(null);

// Solana кошелёк из бота, EVM из localStorage
const evmAddress = localStorage.getItem("vd_evm") || "";
const solAddress = wallet.wallet || "";

// Выбираем правильный адрес для этой сети
const address = network.id === "solana" ? solAddress : evmAddress;

  useEffect(() => {
    loadChainData();
    loadHistory();
  }, []);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  const loadChainData = async () => {
    if (!address) { setLoading(false); return; }
    setLoading(true);
    const data = await checkChain(network.id, address);
    if (data) {
      setTxCount(data.tx_count);
      setBalance(data.balance);
    }
    setLoading(false);
  };

  const loadHistory = async () => {
    const data = await getActionHistory(network.id);
    if (data) {
      setHistory(data.actions);
      setTotalXP(data.total_xp);
    }
  };

  // Открыть категорию → сохранить снапшот TX
  const handleOpenAction = async (type: string) => {
    if (openAction === type) {
      setOpenAction(null);
      setSnapshot(null);
      setVerifyResult(null);
      return;
    }
    setOpenAction(type);
    setVerifyResult(null);

    // Сохраняем текущий TX count как снапшот
    if (address) {
      const data = await checkChain(network.id, address);
      if (data) {
        setSnapshot(data.tx_count);
        setTxCount(data.tx_count);
        setBalance(data.balance);
      }
    }
  };

  // Верификация — проверяем вырос ли TX count
  const handleVerify = async (action: ActionCategory) => {
    if (!address || snapshot === null) {
      setToast("❌ Connect wallet in Profile first");
      return;
    }

    setVerifying(true);
    setVerifyResult(null);

    // Ждём немного (транзакция может ещё не подтвердиться)
    await new Promise((r) => setTimeout(r, 1000));

    const data = await checkChain(network.id, address);

    if (data && data.tx_count > snapshot) {
      // ✅ TX count вырос!
      setVerifyResult("success");
      setTxCount(data.tx_count);
      setBalance(data.balance);

      // Находим последний использованный провайдер (берём первый)
      const providerName = action.providers[0]?.name || action.label;

      await saveAction(network.id, action.type, providerName, action.xp, data.tx_count);
      await loadHistory();

      setToast(`✅ Verified! +${action.xp} XP`);
      setSnapshot(data.tx_count);
    } else {
      setVerifyResult("fail");
      setToast("❌ No new transaction found. Try again after confirming TX.");
    }

    setVerifying(false);
  };

  const timeAgo = (ts: number) => {
    const diff = Date.now() / 1000 - ts;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 z-50 flex items-center gap-2 rounded-2xl px-4 py-3"
          style={{
            background: toast.startsWith("✅") ? "rgba(16,185,129,0.95)" : "rgba(239,68,68,0.95)",
            boxShadow: toast.startsWith("✅") ? "0 4px 20px rgba(16,185,129,0.4)" : "0 4px 20px rgba(239,68,68,0.4)",
          }}>
          <span className="text-[13px] font-bold text-white flex-1">{toast}</span>
          <button onClick={() => setToast(null)}><X className="h-4 w-4 text-white/70" /></button>
        </div>
      )}

      {/* ══ Header ══════════════════════════ */}
      <div className="sticky top-0 z-30 px-4 py-3"
        style={{ background: "rgba(9,9,11,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${network.color}25` }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <ArrowLeft className="h-4 w-4 text-zinc-400" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl text-[16px]"
            style={{ background: `linear-gradient(135deg, ${network.gradFrom}, ${network.gradTo})` }}>
            {network.emoji}
          </div>
          <div className="flex-1">
            <h1 className="text-[15px] font-extrabold text-white">{network.name}</h1>
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em]" style={{ color: network.color }}>
              {network.type}
            </p>
          </div>
          <button onClick={loadChainData}
            className="flex h-8 w-8 items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <RefreshCw className={`h-3.5 w-3.5 text-zinc-400 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ══ Body ════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* ── Status Card ──────────────── */}
        <div className="relative overflow-hidden rounded-2xl p-4"
          style={{ background: `${network.color}08`, border: `1px solid ${network.color}20` }}>
          <div className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${network.color}80, transparent)` }} />

          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-violet-400 animate-spin" />
            </div>
          ) : !address ? (
            <p className="text-[12px] text-zinc-500 text-center py-2">
              Connect wallet in Profile to see stats
            </p>
          ) : (
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[22px] font-black" style={{ color: network.color }}>
                  {txCount ?? 0}
                </p>
                <p className="text-[9px] font-semibold uppercase text-zinc-600">Transactions</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-[16px] font-extrabold text-white">
                  {balance > 0 ? balance.toFixed(4) : "0"}
                </p>
                <p className="text-[9px] font-semibold uppercase text-zinc-600">{network.native}</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-[16px] font-extrabold text-emerald-400">{history.length}</p>
                <p className="text-[9px] font-semibold uppercase text-zinc-600">Actions</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Actions ──────────────────── */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">
            Actions
          </p>

          <div className="space-y-2">
            {network.actions.map((action) => {
              const isOpen = openAction === action.type;

              return (
                <div key={action.type} className="rounded-2xl overflow-hidden"
                  style={{
                    background: isOpen ? `${network.color}08` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isOpen ? `${network.color}25` : "rgba(255,255,255,0.07)"}`,
                  }}>

                  {/* Action Header — кликабельный */}
                  <button
                    onClick={() => handleOpenAction(action.type)}
                    className="flex items-center gap-3 w-full p-3.5 transition-all active:scale-[0.99]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[18px]"
                      style={{ background: `${network.color}15`, border: `1px solid ${network.color}30` }}>
                      {action.emoji}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[14px] font-bold text-white">{action.label}</p>
                      <p className="text-[10px] text-zinc-600">
                        {action.providers.length} provider{action.providers.length > 1 ? "s" : ""} • {action.difficulty} • +{action.xp} XP
                      </p>
                    </div>
                    <Zap className="h-4 w-4" style={{ color: network.color, opacity: isOpen ? 1 : 0.4 }} />
                  </button>

                  {/* Expanded: провайдеры + verify */}
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 space-y-2"
                      style={{ borderTop: `1px solid ${network.color}15` }}>

                      {action.providers.map((provider) => (
                        <a
                          key={provider.id}
                          href={provider.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl p-3 transition-all active:scale-[0.98]"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                          <div className="flex-1">
                            <p className="text-[13px] font-semibold text-white">{provider.name}</p>
                            {provider.description && (
                              <p className="text-[10px] text-zinc-600">{provider.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                            style={{ background: `${network.color}15`, color: network.color }}>
                            Go <ExternalLink className="h-3 w-3" />
                          </div>
                        </a>
                      ))}

                      {/* Verify Button */}
                      <button
                        onClick={() => handleVerify(action)}
                        disabled={verifying || !address}
                        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold transition-all active:scale-[0.97] disabled:opacity-50"
                        style={
                          verifyResult === "success"
                            ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.30)", color: "#34d399" }
                            : verifyResult === "fail"
                            ? { background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }
                            : { background: `${network.color}12`, border: `1px solid ${network.color}30`, color: network.color }
                        }
                      >
                        {verifying ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Checking...</>
                        ) : verifyResult === "success" ? (
                          <><CheckCircle2 className="h-4 w-4" /> Verified! +{action.xp} XP</>
                        ) : verifyResult === "fail" ? (
                          <><Search className="h-4 w-4" /> No TX found — Try again</>
                        ) : (
                          <><Shield className="h-4 w-4" /> Verify Transaction</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── History ──────────────────── */}
        {history.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">
              History
            </p>
            <div className="space-y-1.5">
              {history.slice(0, 15).map((action, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.10)" }}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-zinc-300 capitalize">
                      {action.action_type} via {action.provider}
                    </p>
                    <p className="text-[10px] text-zinc-600 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {timeAgo(action.timestamp)}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">+{action.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Explorer Link ───────────── */}
        {address && (
          <a href={`${network.explorer}/address/${address}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl py-3 text-[12px] font-semibold text-zinc-500 active:scale-[0.98]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <Activity className="h-3.5 w-3.5" /> View on Explorer <ExternalLink className="h-3 w-3" />
          </a>
        )}

        {/* ── Tip ─────────────────────── */}
        <div className="flex items-start gap-2.5 rounded-2xl p-3.5"
          style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)" }}>
          <Shield className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            <span className="text-violet-400 font-semibold">Anti-Sybil:</span> Use different amounts and timing.
            Don't do all actions in one session — spread across days.
          </p>
        </div>
      </div>
    </div>
  );
}