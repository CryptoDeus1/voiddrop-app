import { useState, useEffect } from "react";
import { ArrowRight, Star, Zap, TrendingUp } from "lucide-react";

interface PacificaStats {
  total_markets: number;
  avg_funding_rate: string;
  btc_price: string;
  builder_code: string;
  fee_rate: string;
  status: string;
}

const API_URL = "https://api.voiddrop.space";

export function PacificaBanner() {
  const [stats, setStats] = useState<PacificaStats | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/pacifica/stats`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch(() => {});

    const interval = setInterval(() => {
      fetch(`${API_URL}/api/pacifica/stats`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setStats(data.data);
        })
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(8,47,73,0.95) 0%, rgba(12,74,110,0.85) 50%, rgba(30,27,75,0.95) 100%)",
        border: "1px solid rgba(56,189,248,0.25)",
        boxShadow: "0 0 30px -8px rgba(56,189,248,0.20), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      {/* Glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-sky-500/25 blur-2xl" />
        <div className="absolute -right-8 -bottom-4 h-28 w-28 rounded-full bg-indigo-600/25 blur-2xl" />
      </div>

      {/* Dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle, #38bdf8 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Left accent line */}
      <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-sky-400/80 to-transparent" />

      <div className="relative flex flex-col gap-3 p-4">
        {/* Top row: icon + text + button */}
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="relative shrink-0">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-[22px]"
              style={{
                background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                boxShadow: "0 0 20px rgba(56,189,248,0.40)",
              }}
            >
              🌊
            </div>
            {/* Live ping */}
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-400" />
            </span>
          </div>

          {/* Text block */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300"
                style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.25)" }}
              >
                <Star className="h-2.5 w-2.5 fill-sky-300" />
                VIP Partner
              </span>
              <span
                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300"
                style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.22)" }}
              >
                <Zap className="h-2.5 w-2.5 fill-emerald-300" />
                Exclusive
              </span>
            </div>
            <p className="text-[13px] font-bold text-white leading-tight">
              🌊{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #7dd3fc, #c7d2fe)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Pacifica Ecosystem Partner
              </span>
            </p>
            {stats ? (
              <p className="mt-0.5 text-[11px] text-zinc-400 leading-snug">
                <span className="text-sky-300 font-semibold">{stats.total_markets} markets</span>
                {" · "}
                <span className="text-cyan-300 font-semibold">BTC ${Number(stats.btc_price).toLocaleString()}</span>
                {" · "}
                <span className="text-emerald-300 font-semibold">{stats.fee_rate} fees</span>
              </p>
            ) : (
              <p className="mt-0.5 text-[11px] text-zinc-400 leading-snug">
                Farm with <span className="text-sky-300 font-semibold">0% Fees</span> &{" "}
                <span className="text-cyan-300 font-semibold">+25% Boosted Rewards</span>
              </p>
            )}
          </div>

          {/* CTA button */}
          <button
            className="relative shrink-0 overflow-hidden flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold text-white transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              boxShadow: "0 0 16px rgba(14,165,233,0.40)",
            }}
            onClick={() => window.open("https://app.pacifica.fi", "_blank")}
          >
            <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            Start
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Bottom row: live stats (only if data loaded) */}
        {stats && (
          <div className="flex items-center gap-2">
            <div
              className="flex-1 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] text-zinc-500">Funding:</span>
              <span className="text-[10px] font-bold text-emerald-400">
                {(Number(stats.avg_funding_rate) * 100).toFixed(4)}%
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5"
              style={{ background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.20)" }}
            >
              <span className="text-[10px] text-zinc-500">Builder:</span>
              <span className="text-[10px] font-bold text-violet-400">{stats.builder_code}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}