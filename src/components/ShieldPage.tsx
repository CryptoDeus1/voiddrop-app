import { useState, useEffect } from "react";
import {
  CalendarDays, Flame, Zap, Shield, Trophy,
  CheckCircle2, Clock, ExternalLink, Loader2,
  Lightbulb, X,
} from "lucide-react";
import { getSchedule, completeTask, type ScheduleTaskLive } from "../services/api";

export function SchedulePage() {
  const [tasks, setTasks] = useState<ScheduleTaskLive[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, total_xp: 0, streak: 0 });
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  const fetchData = async () => {
    const data = await getSchedule();
    if (data) {
      setTasks(data.tasks);
      setStats(data.stats);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleComplete = async (task: ScheduleTaskLive) => {
    if (task.completed) return;
    setCompleting(task.id);

    const result = await completeTask(task.drop_id, task.task_id);
    if (result.success) {
      setTasks((prev) =>
        prev.map((t) => t.id === task.id ? { ...t, completed: true } : t)
      );
      setStats((prev) => ({
        ...prev,
        completed: prev.completed + 1,
        total_xp: prev.total_xp + task.xp,
      }));
      setToast(`✅ +${task.xp} XP earned!`);
    } else {
      setToast(`❌ ${result.error || "Failed"}`);
    }

    setCompleting(null);
  };

  const filtered = filter === "pending" ? tasks.filter((t) => !t.completed)
    : filter === "done" ? tasks.filter((t) => t.completed)
    : tasks;

  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 left-4 right-4 z-50 flex items-center gap-2 rounded-2xl px-4 py-3"
          style={{
            background: toast.startsWith("✅") ? "rgba(16,185,129,0.95)" : "rgba(239,68,68,0.95)",
            boxShadow: toast.startsWith("✅") ? "0 4px 20px rgba(16,185,129,0.4)" : "0 4px 20px rgba(239,68,68,0.4)",
          }}
        >
          <span className="text-[13px] font-bold text-white flex-1">{toast}</span>
          <button onClick={() => setToast(null)}><X className="h-4 w-4 text-white/70" /></button>
        </div>
      )}

      {/* ══ Header ═══════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 px-4 pt-3 pb-3"
        style={{
          background: "rgba(9,9,11,0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-violet-400" />
              <h1 className="text-[18px] font-extrabold tracking-tight text-white">My Schedule</h1>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Tasks from your active drops</p>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)" }}
          >
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="text-[13px] font-extrabold text-orange-300">{stats.streak}</span>
            <span className="text-[10px] font-semibold text-orange-500">day</span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="flex items-center gap-4 rounded-2xl p-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Ring */}
          <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
            <svg width={56} height={56} className="-rotate-90">
              <circle cx={28} cy={28} r={23} stroke="rgba(255,255,255,0.07)" strokeWidth={5} fill="none" />
              <circle
                cx={28} cy={28} r={23}
                stroke={pct === 100 ? "#10b981" : "#8b5cf6"}
                strokeWidth={5} fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 23}
                strokeDashoffset={2 * Math.PI * 23 * (1 - pct / 100)}
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[13px] font-black text-white">{stats.completed}/{stats.total}</span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-[11px] font-semibold text-zinc-400">Progress</p>
            <p className="text-[13px] font-extrabold text-white">{pct}% Complete</p>
            <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: pct === 100
                    ? "linear-gradient(90deg,#10b981,#059669)"
                    : "linear-gradient(90deg,#8b5cf6,#6366f1)",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0">
            <Trophy className="h-5 w-5 text-amber-400" />
            <span className="text-[12px] font-extrabold text-amber-300">{stats.total_xp}</span>
            <span className="text-[8px] font-bold text-zinc-600 uppercase">XP</span>
          </div>
        </div>
      </div>

      {/* ══ Body ══════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Shield, label: "Score", value: pct >= 80 ? "A+" : pct >= 60 ? "A" : pct >= 40 ? "B" : "C", color: "text-emerald-400", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.22)" },
            { icon: Zap, label: "Total XP", value: String(stats.total_xp), color: "text-violet-400", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.22)" },
            { icon: Flame, label: "Streak", value: `${stats.streak}d`, color: "text-orange-400", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.22)" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 rounded-2xl py-3"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className={`text-[16px] font-extrabold ${s.color}`}>{s.value}</span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {([
            { id: "all", label: `All (${tasks.length})` },
            { id: "pending", label: `Pending (${tasks.filter((t) => !t.completed).length})` },
            { id: "done", label: `Done (${tasks.filter((t) => t.completed).length})` },
          ] as const).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-95"
              style={filter === f.id
                ? { background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.40)", color: "#c4b5fd" }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#71717a" }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl py-10"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-3xl">{filter === "done" ? "🎉" : "📭"}</span>
            <p className="text-[13px] font-semibold text-zinc-500">
              {filter === "done" ? "No completed tasks yet" : filter === "pending" ? "All done! 🎉" : "No tasks available"}
            </p>
            <p className="text-[11px] text-zinc-600">
              {tasks.length === 0 ? "Add drops with tasks to see them here" : ""}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((task) => {
              const isDone = task.completed;
              const isLoading = completing === task.id;

              return (
                <div
                  key={task.id}
                  className="overflow-hidden rounded-2xl transition-all"
                  style={{
                    background: isDone ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isDone ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  {/* Top accent */}
                  <div className="absolute inset-x-0 top-0 h-px opacity-50"
                    style={{ background: `linear-gradient(90deg, transparent, ${task.gradient_from}, transparent)` }} />

                  <div className="p-3.5">
                    {/* Drop badge + difficulty */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{ background: `${task.gradient_from}20`, border: `1px solid ${task.gradient_from}35`, color: task.gradient_from }}
                        >
                          {task.drop_emoji} {task.drop_name}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: task.difficulty === "Easy" ? "rgba(16,185,129,0.12)"
                              : task.difficulty === "Medium" ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
                            color: task.difficulty === "Easy" ? "#6ee7b7"
                              : task.difficulty === "Medium" ? "#fcd34d" : "#fca5a5",
                          }}
                        >
                          {task.difficulty}
                        </span>
                      </div>
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] text-violet-400 font-semibold">
                          <Zap className="h-3 w-3" /> +{task.xp} XP
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <p
                      className="text-[14px] font-bold mb-1"
                      style={{
                        color: isDone ? "#6ee7b7" : "#f4f4f5",
                        textDecoration: isDone ? "line-through" : "none",
                        textDecorationColor: "rgba(110,231,183,0.4)",
                      }}
                    >
                      {task.title}
                    </p>

                    {task.description && (
                      <p className="text-[11px] text-zinc-500 mb-2">{task.description}</p>
                    )}

                    {/* Chain info */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] text-zinc-600">{task.drop_chain}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isDone && (
                    <div className="flex border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      {task.url && (
                        <a
                          href={task.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold transition-all active:scale-[0.98]"
                          style={{ color: task.gradient_from, borderRight: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Open
                        </a>
                      )}
                      <button
                        onClick={() => handleComplete(task)}
                        disabled={isLoading}
                        className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold text-violet-400 transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {isLoading ? (
                          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> ...</>
                        ) : (
                          <><CheckCircle2 className="h-3.5 w-3.5" /> Complete</>
                        )}
                      </button>
                    </div>
                  )}

                  {isDone && (
                    <div className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-emerald-400"
                      style={{ background: "rgba(16,185,129,0.06)", borderTop: "1px solid rgba(16,185,129,0.10)" }}>
                      <CheckCircle2 className="h-3 w-3" /> Completed · +{task.xp} XP
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Anti-Sybil tip */}
        <div className="flex items-start gap-2.5 rounded-2xl p-3.5"
          style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)" }}>
          <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            <span className="text-amber-400 font-semibold">Pro Tip:</span> Complete 2-3 tasks per day max.
            Spacing activity across days looks more organic and increases your airdrop allocation.
          </p>
        </div>
      </div>
    </div>
  );
}