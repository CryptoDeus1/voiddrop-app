import { Flame, Sparkles, ExternalLink, CheckCircle2, Circle } from "lucide-react";
import type { Drop } from "../data/mockDrops";
import { PROBABILITY_CONFIG } from "../data/mockDrops";

interface DropCardProps {
  drop: Drop;
}

export function DropCard({ drop }: DropCardProps) {
  const prob    = PROBABILITY_CONFIG[drop.probability];
  const progress = Math.round((drop.completedTasks / drop.tasks) * 100);

  return (
    <div
      className="relative flex items-center gap-3 overflow-hidden rounded-2xl p-3.5 transition-all duration-200 active:scale-[0.98]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Top gradient accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${drop.gradientFrom}aa, transparent)`,
        }}
      />

      {/* HOT/NEW badge — top right corner */}
      {(drop.hot || drop.new) && (
        <div className="absolute right-3 top-3 z-10">
          {drop.hot ? (
            <span
              className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase text-orange-400"
              style={{ background: "rgba(249,115,22,0.18)", border: "1px solid rgba(249,115,22,0.28)" }}
            >
              <Flame className="h-2 w-2 fill-orange-400" /> Hot
            </span>
          ) : (
            <span
              className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase text-purple-400"
              style={{ background: "rgba(168,85,247,0.18)", border: "1px solid rgba(168,85,247,0.28)" }}
            >
              <Sparkles className="h-2 w-2" /> New
            </span>
          )}
        </div>
      )}

      {/* Project icon */}
      <div
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${drop.gradientFrom}, ${drop.gradientTo})`,
          boxShadow: `0 4px 16px ${drop.glowColor}40`,
        }}
      >
        {drop.emoji}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0 pr-12">
        {/* Name + network type */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-bold text-white truncate">{drop.name}</span>
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
            style={
              drop.type === "Mainnet"
                ? { background: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.25)" }
                : { background: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.25)" }
            }
          >
            {drop.type}
          </span>
        </div>

        {/* Chain + funding row */}
        <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-zinc-500">{drop.chain}</span>
          {drop.funding && (
            <>
              <span className="h-1 w-1 rounded-full bg-zinc-700" />
              <span className="text-[11px] font-semibold text-zinc-400">{drop.funding}</span>
            </>
          )}
        </div>

        {/* Task progress bar */}
        <div className="mt-2 flex items-center gap-2">
          <div
            className="flex-1 rounded-full overflow-hidden"
            style={{ height: 4, background: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${drop.gradientFrom}, ${drop.gradientTo})`,
                boxShadow: `0 0 6px ${drop.glowColor}60`,
              }}
            />
          </div>
          <span className="text-[10px] font-semibold text-zinc-500">
            {drop.completedTasks}/{drop.tasks}
          </span>
        </div>
      </div>

      {/* Right column: probability + action */}
      <div className="absolute right-3 bottom-3 flex flex-col items-end gap-2">
        {/* Probability badge */}
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${prob.text} ${prob.bg} ${prob.border} border`}
        >
          {drop.probability === "Confirmed" || drop.probability === "High" ? (
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          ) : null}
          {drop.probability}
        </span>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-xl text-zinc-500 transition-all active:scale-90"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
            title="Open project"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-xl text-emerald-500 transition-all active:scale-90"
            style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.20)" }}
            title="Mark complete"
          >
            {drop.completedTasks === drop.tasks
              ? <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-500" />
              : <Circle className="h-3.5 w-3.5" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}
