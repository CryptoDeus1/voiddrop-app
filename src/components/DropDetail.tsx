import { useState, useEffect } from "react";
import {
  ArrowLeft, ExternalLink, CheckCircle2, Circle,
  Zap, Shield, Flame, Globe, Loader2, X,
} from "lucide-react";
import { completeTask, getUserProgress } from "../services/api";

interface DropDetailProps {
  drop: any;
  onBack: () => void;
}

export function DropDetail({ drop, onBack }: DropDetailProps) {
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [completing, setCompleting] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Загружаем прогресс юзера
  useEffect(() => {
    getUserProgress().then((progress) => {
      const dropProgress = progress[String(drop.id)] || [];
      setCompletedIds(dropProgress);
    });
  }, [drop.id]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const tasks: any[] = drop.tasks_list && drop.tasks_list.length > 0
    ? drop.tasks_list
    : generateFallbackTasks(drop);

  const completedCount = completedIds.length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleComplete = async (taskId: number, xp: number) => {
    if (completedIds.includes(taskId)) return;
    setCompleting(taskId);

    const result = await completeTask(drop.id, taskId);

    if (result.success) {
      setCompletedIds((prev) => [...prev, taskId]);
      setToast(`✅ +${xp} XP earned!`);
    } else {
      setToast(`❌ ${result.error || "Failed"}`);
    }

    setCompleting(null);
  };

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 left-4 right-4 z-50 flex items-center gap-2 rounded-2xl px-4 py-3"
          style={{
            background: toast.startsWith("✅") ? "rgba(16,185,129,0.95)" : "rgba(239,68,68,0.95)",
            boxShadow: toast.startsWith("✅")
              ? "0 4px 20px rgba(16,185,129,0.4)"
              : "0 4px 20px rgba(239,68,68,0.4)",
          }}
        >
          <span className="text-[13px] font-bold text-white flex-1">{toast}</span>
          <button onClick={() => setToast(null)}>
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>
      )}

      {/* ══ Header ═══════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: "rgba(9,9,11,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${drop.gradientFrom}25`,
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-xl transition-all active:scale-90"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <ArrowLeft className="h-4 w-4 text-zinc-400" />
          </button>
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl text-[16px]"
              style={{
                background: `linear-gradient(135deg, ${drop.gradientFrom}, ${drop.gradientTo})`,
                boxShadow: `0 0 12px ${drop.glowColor}`,
              }}
            >
              {drop.emoji}
            </div>
            <div>
              <h1 className="text-[15px] font-extrabold text-white">{drop.name}</h1>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em]" style={{ color: drop.gradientFrom }}>
                {drop.category}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Body ═════════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* Hero */}
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: `linear-gradient(135deg, ${drop.gradientFrom}15, ${drop.gradientTo}08)`,
            border: `1px solid ${drop.gradientFrom}25`,
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${drop.gradientFrom}80, transparent)` }} />

          <p className="text-[13px] text-zinc-300 leading-relaxed mb-4">
            {drop.description || "Explore this project and complete tasks to maximize your airdrop allocation."}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Funding", value: drop.funding || "—", icon: "💰" },
              { label: "Est. Reward", value: drop.reward || "—", icon: "🎁" },
              { label: "Chain", value: drop.chain || "—", icon: "⛓️" },
              { label: "Deadline", value: drop.endDate || "—", icon: "📅" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-[14px]">{item.icon}</span>
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase">{item.label}</p>
                  <p className="text-[12px] font-bold text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <ProbBadge probability={drop.probability} />
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
            style={
              drop.type === "Mainnet"
                ? { background: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.22)" }
                : { background: "rgba(59,130,246,0.12)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.22)" }
            }
          >
            {drop.type}
          </span>
          {drop.hot && (
            <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-orange-400"
              style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.22)" }}>
              <Flame className="h-3 w-3" /> Hot
            </span>
          )}
        </div>

        {/* Progress */}
        {totalCount > 0 && (
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-bold text-white">Task Progress</p>
              <p className="text-[12px] font-extrabold" style={{ color: progress === 100 ? "#34d399" : drop.gradientFrom }}>
                {progress}%
              </p>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: progress === 100
                    ? "linear-gradient(90deg, #059669, #10b981, #34d399)"
                    : `linear-gradient(90deg, ${drop.gradientFrom}, ${drop.gradientTo})`,
                  boxShadow: `0 0 10px ${progress === 100 ? "rgba(16,185,129,0.5)" : drop.glowColor}`,
                }}
              />
            </div>
            <p className="text-[10px] text-zinc-600 mt-1.5">
              {completedCount} of {totalCount} tasks completed
              {progress === 100 && " 🎉"}
            </p>
          </div>
        )}

        {/* Tasks */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">
            Tasks ({totalCount})
          </p>
          <div className="space-y-2">
            {tasks.map((task: any) => {
              const isDone = completedIds.includes(task.id);
              const isLoading = completing === task.id;

              return (
                <div
                  key={task.id}
                  className="overflow-hidden rounded-xl transition-all"
                  style={{
                    background: isDone ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isDone ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  <div className="flex items-center gap-3 px-3.5 py-3">
                    {/* Check icon */}
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-zinc-600 shrink-0" />
                    )}

                    {/* Task info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[13px] font-medium"
                        style={{
                          color: isDone ? "#6ee7b7" : "#e4e4e7",
                          textDecoration: isDone ? "line-through" : "none",
                          textDecorationColor: "rgba(110,231,183,0.4)",
                        }}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-[10px] text-zinc-500 mt-0.5">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[10px] font-semibold"
                          style={{
                            color: task.difficulty === "Easy" ? "#6ee7b7"
                              : task.difficulty === "Medium" ? "#fcd34d" : "#fca5a5",
                          }}
                        >
                          {task.difficulty}
                        </span>
                        <span className="text-[10px] text-violet-400 font-semibold flex items-center gap-0.5">
                          <Zap className="h-2.5 w-2.5" /> +{task.xp} XP
                        </span>
                      </div>
                    </div>

                    {/* Link button */}
                    {!isDone && task.url && (
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-90"
                        style={{ background: `${drop.gradientFrom}20`, border: `1px solid ${drop.gradientFrom}30` }}
                      >
                        <ExternalLink className="h-3.5 w-3.5" style={{ color: drop.gradientFrom }} />
                      </a>
                    )}
                  </div>

                  {/* Complete button */}
                  {!isDone && (
                    <button
                      onClick={() => handleComplete(task.id, task.xp || 15)}
                      disabled={isLoading}
                      className="flex w-full items-center justify-center gap-2 py-2.5 text-[12px] font-bold transition-all active:scale-[0.98] disabled:opacity-50"
                      style={{
                        background: "rgba(139,92,246,0.08)",
                        borderTop: "1px solid rgba(139,92,246,0.12)",
                        color: "#a78bfa",
                      }}
                    >
                      {isLoading ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Completing...</>
                      ) : (
                        <><CheckCircle2 className="h-3.5 w-3.5" /> Mark as Complete</>
                      )}
                    </button>
                  )}

                  {/* Done state */}
                  {isDone && (
                    <div
                      className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-emerald-400"
                      style={{ background: "rgba(16,185,129,0.06)", borderTop: "1px solid rgba(16,185,129,0.10)" }}
                    >
                      <CheckCircle2 className="h-3 w-3" /> Completed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Link */}
        {drop.project_url && (
          <a
            href={drop.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-bold text-white transition-all active:scale-[0.97]"
            style={{
              background: `linear-gradient(135deg, ${drop.gradientFrom}, ${drop.gradientTo})`,
              boxShadow: `0 4px 20px ${drop.glowColor}`,
            }}
          >
            <Globe className="h-4 w-4" />
            Open {drop.name}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}

        {/* Anti-Sybil Tip */}
        <div
          className="flex items-start gap-2.5 rounded-2xl p-3.5"
          style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)" }}
        >
          <Shield className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            <span className="text-violet-400 font-semibold">Anti-Sybil Tip:</span> Space your tasks across multiple days.
            Complete 1-2 tasks per day with randomized amounts.
          </p>
        </div>

      </div>
    </div>
  );
}

/* ── Helpers ──────────────────────── */

function ProbBadge({ probability }: { probability: string }) {
  const config: Record<string, { text: string; bg: string; border: string; dot: string }> = {
    Confirmed: { text: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30", dot: "bg-emerald-400" },
    High:      { text: "text-amber-400",   bg: "bg-amber-500/15",   border: "border-amber-500/30",   dot: "bg-amber-400" },
    Medium:    { text: "text-orange-400",  bg: "bg-orange-500/15",  border: "border-orange-500/30",  dot: "bg-orange-400" },
    Low:       { text: "text-slate-400",   bg: "bg-slate-500/15",   border: "border-slate-500/30",   dot: "bg-slate-400" },
  };
  const c = config[probability] || config.Medium;

  return (
    <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${c.text} ${c.bg} ${c.border} border`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${
        (probability === "Confirmed" || probability === "High") ? "animate-pulse" : ""
      }`} />
      {probability}
    </span>
  );
}

function generateFallbackTasks(drop: any) {
  const templates = [
    { title: "Connect wallet to protocol", difficulty: "Easy", xp: 10 },
    { title: "Make first transaction", difficulty: "Easy", xp: 15 },
    { title: "Interact with main features", difficulty: "Medium", xp: 25 },
    { title: "Use protocol for 3+ days", difficulty: "Medium", xp: 30 },
    { title: "Complete advanced actions", difficulty: "Hard", xp: 40 },
  ];

  const count = drop.tasks_count || drop.tasks || 3;
  return templates.slice(0, count).map((t, i) => ({
    ...t,
    id: i + 1,
    url: drop.project_url || "",
    description: "",
    completed: false,
  }));
}