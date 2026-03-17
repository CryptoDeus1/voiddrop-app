import { useState } from "react";
import {
  CalendarDays, Flame, Zap, ExternalLink,
  CheckCircle2, Shield, Trophy, Clock,
  Lightbulb, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  TODAY_TASKS, WEEK_DAYS, STREAK_DATA, type ScheduleTask,
} from "../data/mockSchedule";

/* ══════════════════════════════════════════════════════════════════
   Progress Ring — compact 80px version for TMA header
══════════════════════════════════════════════════════════════════ */
function ProgressRing({ total, completed }: { total: number; completed: number }) {
  const r   = 34;
  const sw  = 5;
  const nr  = r - sw / 2;
  const c   = 2 * Math.PI * nr;
  const pct = total === 0 ? 0 : completed / total;
  const off = c - pct * c;
  const done = completed === total;

  return (
    <div className="relative flex items-center justify-center" style={{ width: r * 2, height: r * 2 }}>
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-md"
        style={{ background: done ? "radial-gradient(circle,#10b981,transparent)" : "radial-gradient(circle,#8b5cf6,transparent)" }}
      />
      <svg width={r * 2} height={r * 2} className="-rotate-90" overflow="visible">
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={done ? "#10b981" : "#8b5cf6"} />
            <stop offset="100%" stopColor={done ? "#059669" : "#6366f1"} />
          </linearGradient>
        </defs>
        <circle cx={r} cy={r} r={nr} stroke="rgba(255,255,255,0.07)" strokeWidth={sw} fill="none" />
        <circle
          cx={r} cy={r} r={nr}
          stroke="url(#rg)" strokeWidth={sw} fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[15px] font-black text-white leading-none">{completed}/{total}</span>
        <span className="text-[8px] font-semibold uppercase tracking-widest text-zinc-500">tasks</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Day Selector Strip
══════════════════════════════════════════════════════════════════ */
function DayStrip({ activeDay, onDayChange }: { activeDay: string; onDayChange: (id: string) => void }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto px-4 py-1 scrollbar-hide snap-x"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {WEEK_DAYS.map((d) => {
        const isActive = activeDay === d.id;
        return (
          <button
            key={d.id}
            onClick={() => onDayChange(d.id)}
            className="snap-start shrink-0 flex flex-col items-center gap-1 rounded-2xl px-3 py-2.5 transition-all duration-200 active:scale-95"
            style={
              isActive
                ? {
                    background: "rgba(139,92,246,0.20)",
                    border: "1px solid rgba(139,92,246,0.40)",
                    boxShadow: "0 0 14px rgba(139,92,246,0.25)",
                  }
                : d.isCompleted
                ? {
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.18)",
                  }
                : {
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }
            }
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: isActive ? "#c4b5fd" : d.isCompleted ? "#6ee7b7" : "#52525b" }}
            >
              {d.dayShort}
            </span>
            <span
              className="text-[15px] font-extrabold leading-none"
              style={{ color: isActive ? "#fff" : d.isCompleted ? "#a7f3d0" : "#71717a" }}
            >
              {d.dayNum}
            </span>
            {d.isToday && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase"
                style={{ background: "rgba(139,92,246,0.25)", color: "#a78bfa" }}
              >
                Today
              </span>
            )}
            {!d.isToday && d.isCompleted && (
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            )}
            {!d.isToday && !d.isCompleted && d.hasTasks && (
              <span
                className="rounded-full text-[8px] font-bold text-zinc-600 px-1"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                {d.taskCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Task Card
══════════════════════════════════════════════════════════════════ */
function TaskCard({
  task,
  onToggleDone,
}: {
  task: ScheduleTask;
  onToggleDone: (id: number) => void;
}) {
  const [tipOpen, setTipOpen] = useState(false);
  const isDone = task.status === "done";

  return (
    <div
      className="relative overflow-hidden rounded-2xl transition-all duration-200"
      style={{
        background: isDone ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.04)",
        border: isDone
          ? "1px solid rgba(16,185,129,0.20)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: isDone ? "0 0 20px rgba(16,185,129,0.08)" : "none",
      }}
    >
      {/* Top accent gradient line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: isDone
            ? "linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent)"
            : `linear-gradient(90deg, transparent, ${task.projectGradientFrom}99, transparent)`,
        }}
      />

      <div className="p-4">
        {/* Row 1: Category badge + difficulty + done tick */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${task.categoryColor} ${task.categoryBg} ${task.categoryBorder} border`}
            >
              {task.categoryEmoji} {task.category}
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background:
                  task.difficulty === "Easy"   ? "rgba(16,185,129,0.12)" :
                  task.difficulty === "Medium" ? "rgba(245,158,11,0.12)" :
                                                 "rgba(239,68,68,0.12)",
                color:
                  task.difficulty === "Easy"   ? "#6ee7b7" :
                  task.difficulty === "Medium" ? "#fcd34d" :
                                                 "#fca5a5",
                border:
                  task.difficulty === "Easy"   ? "1px solid rgba(16,185,129,0.22)" :
                  task.difficulty === "Medium" ? "1px solid rgba(245,158,11,0.22)" :
                                                 "1px solid rgba(239,68,68,0.22)",
              }}
            >
              {task.difficulty}
            </span>
          </div>

          {/* Mark-done circular button */}
          <button
            onClick={() => onToggleDone(task.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 active:scale-90"
            style={
              isDone
                ? { background: "rgba(16,185,129,0.20)", border: "1.5px solid rgba(16,185,129,0.50)" }
                : { background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.15)" }
            }
          >
            <CheckCircle2
              className="h-4.5 w-4.5"
              style={{ color: isDone ? "#34d399" : "#52525b", width: 18, height: 18 }}
            />
          </button>
        </div>

        {/* Row 2: Protocol icon + title */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
            style={{
              background: `linear-gradient(135deg, ${task.projectGradientFrom}, ${task.projectGradientTo})`,
              boxShadow: `0 4px 12px ${task.projectGlow}`,
            }}
          >
            {task.projectEmoji}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-[14px] font-bold leading-tight"
              style={{ color: isDone ? "#6ee7b7" : "#f4f4f5", textDecoration: isDone ? "line-through" : "none", textDecorationColor: "rgba(110,231,183,0.5)" }}
            >
              {task.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-zinc-500">{task.chainEmoji} {task.chain}</span>
              <span className="text-zinc-700">→</span>
              <span className="text-[11px] font-semibold text-zinc-400">{task.protocol}</span>
            </div>
          </div>
        </div>

        {/* Row 3: Meta — time + XP */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-[11px] text-zinc-600">
            <Clock className="h-3 w-3" />
            {task.estimatedTime}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-violet-400">
            <Zap className="h-3 w-3" />
            {task.estimatedReward}
          </div>
        </div>

        {/* Row 4: Pro Tip accordion */}
        <button
          onClick={() => setTipOpen((p) => !p)}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all active:scale-[0.98]"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)" }}
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] font-semibold text-amber-400">Anti-Sybil Pro Tip</span>
          </div>
          {tipOpen
            ? <ChevronUp className="h-3.5 w-3.5 text-amber-500/60 shrink-0" />
            : <ChevronDown className="h-3.5 w-3.5 text-amber-500/60 shrink-0" />
          }
        </button>
        {tipOpen && (
          <p className="mt-2 px-3 text-[12px] leading-relaxed text-zinc-400">
            {task.proTip}
          </p>
        )}

        {/* Row 5: Actions or "Done" bar */}
        {isDone ? (
          <div
            className="mt-3 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[12px] font-bold text-emerald-400"
            style={{ background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.20)" }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Task Completed!
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <a
              href="#"
              className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl py-2.5 text-[13px] font-bold text-white transition-all active:scale-[0.97]"
              style={{
                background: `linear-gradient(135deg, ${task.projectGradientFrom}, ${task.projectGradientTo})`,
                boxShadow: `0 4px 16px ${task.projectGlow}`,
              }}
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full animate-shimmer" />
              <ExternalLink className="h-3.5 w-3.5" />
              Start Task
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN SchedulePage
══════════════════════════════════════════════════════════════════ */
export function SchedulePage() {
  const todayEntry   = WEEK_DAYS.find((d) => d.isToday)!;
  const [activeDay, setActiveDay]   = useState(todayEntry.id);
  const [tasks,     setTasks]       = useState(TODAY_TASKS);

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const totalCount     = tasks.length;

  const toggleDone = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => t.id === id ? { ...t, status: t.status === "done" ? "pending" : "done" } : t)
    );
  };

  const xpPct = Math.round((STREAK_DATA.xpProgress / STREAK_DATA.xpToNextLevel) * 100);

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Sticky Page Header ═══════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 px-4 pt-3 pb-3"
        style={{
          background: "rgba(9,9,11,0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-violet-400" />
              <h1 className="text-[18px] font-extrabold tracking-tight text-white">My Schedule</h1>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Anti-Sybil Task Tracker</p>
          </div>
          {/* Streak pill */}
          <div
            className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)" }}
          >
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="text-[13px] font-extrabold text-orange-300">{STREAK_DATA.currentStreak}</span>
            <span className="text-[10px] font-semibold text-orange-500">day streak</span>
          </div>
        </div>

        {/* Progress + stats row */}
        <div
          className="flex items-center gap-4 rounded-2xl p-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Progress ring */}
          <ProgressRing total={totalCount} completed={completedCount} />

          {/* Stats */}
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-[11px] font-semibold text-zinc-400">Today's Progress</p>
              <p className="text-[13px] font-extrabold text-white">
                {completedCount}/{totalCount} Tasks Completed
              </p>
            </div>
            {/* Linear bar */}
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${totalCount === 0 ? 0 : (completedCount / totalCount) * 100}%`,
                  background: completedCount === totalCount
                    ? "linear-gradient(90deg,#10b981,#059669)"
                    : "linear-gradient(90deg,#8b5cf6,#6366f1)",
                  boxShadow: completedCount === totalCount
                    ? "0 0 8px rgba(16,185,129,0.50)"
                    : "0 0 8px rgba(139,92,246,0.50)",
                }}
              />
            </div>
          </div>

          {/* XP + Level badge */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 0 14px rgba(245,158,11,0.35)" }}
            >
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
              style={{ background: "rgba(245,158,11,0.18)", color: "#fcd34d" }}
            >
              Lv.{STREAK_DATA.level}
            </span>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] text-zinc-600 shrink-0">{STREAK_DATA.levelName}</span>
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${xpPct}%`,
                background: "linear-gradient(90deg,#f59e0b,#a78bfa)",
              }}
            />
          </div>
          <span className="text-[10px] text-zinc-600 shrink-0">{STREAK_DATA.xpProgress}/{STREAK_DATA.xpToNextLevel} XP</span>
        </div>
      </div>

      {/* ══ Scrollable body ══════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 pb-nav">

        {/* Quick stats strip */}
        <div className="grid grid-cols-3 gap-2 px-4 pt-4">
          {[
            { icon: Shield, label: "Sybil Score", value: "A+", color: "text-emerald-400", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.22)" },
            { icon: Zap,    label: "Total XP",    value: STREAK_DATA.totalXP.toLocaleString(), color: "text-violet-400", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.22)" },
            { icon: Flame,  label: "Best Streak", value: `${STREAK_DATA.longestStreak}d`, color: "text-orange-400", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.22)" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-2xl py-3"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className={`text-[16px] font-extrabold ${s.color}`}>{s.value}</span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Day selector */}
        <div>
          <div className="flex items-center justify-between px-4 mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">This Week</p>
            <button className="text-[11px] text-violet-400 font-semibold">Full Calendar →</button>
          </div>
          <DayStrip activeDay={activeDay} onDayChange={setActiveDay} />
        </div>

        {/* Task cards */}
        <div className="flex flex-col gap-3 px-4">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-widest">Today's Tasks</p>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold text-violet-300"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}
            >
              {totalCount} tasks
            </span>
          </div>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggleDone={toggleDone} />
          ))}
        </div>

        {/* Bottom note */}
        <div
          className="mx-4 flex items-start gap-2 rounded-2xl p-3"
          style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)" }}
        >
          <Shield className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            <span className="text-violet-400 font-semibold">Anti-Sybil Mode:</span> Randomize amounts, space your transactions, and vary your protocols. Organic behaviour = higher drop allocation.
          </p>
        </div>
      </div>
    </div>
  );
}
