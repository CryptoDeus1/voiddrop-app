import { useState, useEffect } from "react";
import {
  CalendarDays, Flame, Zap, Shield, Trophy,
  CheckCircle2, ExternalLink, Loader2, X,
  Lightbulb, Sparkles, Filter, Rocket,
} from "lucide-react";
import {
  getSchedule, generateSchedule, completeTask,
  type ScheduleTaskLive, type ScheduleDay, type GeneratedSchedule,
} from "../services/api";

export function SchedulePage() {
  const [allTasks, setAllTasks] = useState<ScheduleTaskLive[]>([]);
  const [chains, setChains] = useState<string[]>([]);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<GeneratedSchedule | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [stats, setStats] = useState({ total: 0, completed: 0, total_xp: 0, streak: 0 });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [completing, setCompleting] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showChainPicker, setShowChainPicker] = useState(false);

  const fetchData = async () => {
    const data = await getSchedule();
    if (data) {
      setAllTasks(data.tasks);
      setChains(data.chains);
      setStats(data.stats);
      if (data.schedule) {
        setSchedule(data.schedule);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleGenerate = async () => {
    setGenerating(true);
    const result = await generateSchedule(selectedChains, 7, 3);
    if (result) {
      setSchedule(result);
      setActiveDay(0);
      setToast("✅ Schedule generated! Tasks distributed across 7 days");
    } else {
      setToast("❌ Failed to generate schedule");
    }
    setGenerating(false);
  };

  const handleComplete = async (task: any) => {
    setCompleting(task.id);
    const result = await completeTask(task.drop_id, task.task_id);
    if (result.success) {
      // Обновляем задачу в schedule
      if (schedule) {
        setSchedule((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            days: prev.days.map((day) => ({
              ...day,
              tasks: day.tasks.map((t: any) =>
                t.id === task.id ? { ...t, completed: true } : t
              ),
            })),
          };
        });
      }
      setStats((p) => ({ ...p, completed: p.completed + 1, total_xp: p.total_xp + task.xp }));
      setToast(`✅ +${task.xp} XP earned!`);
    } else {
      setToast(`❌ ${result.error || "Failed"}`);
    }
    setCompleting(null);
  };

  const toggleChain = (chain: string) => {
    setSelectedChains((prev) =>
      prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]
    );
  };

  const todayTasks = schedule?.days[activeDay]?.tasks || [];
  const currentDay = schedule?.days[activeDay];
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

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
              <h1 className="text-[18px] font-extrabold tracking-tight text-white">Mission Control</h1>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Navigate your void exploration path</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)" }}>
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="text-[13px] font-extrabold text-orange-300">{stats.streak}</span>
            <span className="text-[10px] font-semibold text-orange-500">day</span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 rounded-2xl p-2.5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 flex-1">
            <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-zinc-500">{stats.completed}/{stats.total} tasks</span>
                <span className="text-[10px] font-bold text-violet-400">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg,#8b5cf6,#6366f1)" }} />
              </div>
            </div>
          </div>
          <div className="shrink-0 text-center px-2">
            <span className="text-[14px] font-black text-amber-300">{stats.total_xp}</span>
            <span className="text-[8px] text-zinc-600 block uppercase">XP</span>
          </div>
        </div>
      </div>

      {/* ══ Body ══════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
          </div>
        ) : !schedule ? (
          /* ── No schedule yet — Generate ─────────── */
          <>
            {/* Chain picker */}
            <div className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-violet-400" />
                <p className="text-[12px] font-bold text-white">Select Ecosystems</p>
                <span className="text-[10px] text-zinc-600">(optional)</span>
              </div>

              {chains.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {chains.map((chain) => {
                    const isSelected = selectedChains.includes(chain);
                    return (
                      <button
                        key={chain}
                        onClick={() => toggleChain(chain)}
                        className="rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-95"
                        style={isSelected
                          ? { background: "rgba(139,92,246,0.20)", border: "1px solid rgba(139,92,246,0.40)", color: "#c4b5fd" }
                          : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#71717a" }
                        }
                      >
                        {chain}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-zinc-600">No chains available — add drops with tasks first</p>
              )}

              {selectedChains.length > 0 && (
                <button onClick={() => setSelectedChains([])}
                  className="mt-2 text-[11px] text-violet-400 font-semibold">
                  Clear selection (use all)
                </button>
              )}
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={generating || allTasks.length === 0}
              className="relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold text-white transition-all active:scale-[0.97] disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
              }}
            >
              {generating ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Calculating trajectory...</>
              ) : (
                <><Rocket className="h-5 w-5" /> Generate Mission Plan</>
              )}
            </button>

            {allTasks.length === 0 && (
              <p className="text-center text-[12px] text-zinc-600">
                Add drops with tasks in DropHunt first ☝️
              </p>
            )}

            {/* Info card */}
            <div className="flex items-start gap-2.5 rounded-2xl p-3.5"
              style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)" }}>
              <Sparkles className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                <span className="text-violet-400 font-semibold">Anti-Sybil Mode:</span> Tasks will be randomly distributed across 7 days with varied timing.
                This mimics organic behavior and maximizes your airdrop allocation.
              </p>
            </div>
          </>
        ) : (
          /* ── Schedule exists — Show calendar ─────── */
          <>
            {/* Day strip */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x pb-1">
              {schedule.days.map((day, i) => {
                const isActive = activeDay === i;
                const dayDone = day.tasks.every((t: any) => t.completed);
                const dayHasTasks = day.tasks.length > 0;

                return (
                  <button
                    key={day.date}
                    onClick={() => setActiveDay(i)}
                    className="snap-start shrink-0 flex flex-col items-center gap-1 rounded-2xl px-3 py-2.5 transition-all active:scale-95"
                    style={
                      isActive
                        ? { background: "rgba(139,92,246,0.20)", border: "1px solid rgba(139,92,246,0.40)", boxShadow: "0 0 14px rgba(139,92,246,0.25)" }
                        : dayDone && dayHasTasks
                        ? { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)" }
                        : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }
                    }
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: isActive ? "#c4b5fd" : dayDone ? "#6ee7b7" : "#52525b" }}>
                      {day.day_short}
                    </span>
                    <span className="text-[15px] font-extrabold leading-none"
                      style={{ color: isActive ? "#fff" : dayDone ? "#a7f3d0" : "#71717a" }}>
                      {day.day_num}
                    </span>
                    <span className="text-[8px] font-semibold uppercase text-zinc-600">{day.month}</span>
                    {day.is_today && (
                      <span className="rounded-full px-1.5 py-0.5 text-[7px] font-bold uppercase"
                        style={{ background: "rgba(139,92,246,0.25)", color: "#a78bfa" }}>
                        Today
                      </span>
                    )}
                    {!day.is_today && dayDone && dayHasTasks && (
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    )}
                    {!day.is_today && !dayDone && dayHasTasks && (
                      <span className="rounded-full text-[8px] font-bold text-zinc-600 px-1"
                        style={{ background: "rgba(255,255,255,0.06)" }}>
                        {day.tasks.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Current day header */}
            {currentDay && (
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-widest">
                  {currentDay.is_today ? "🚀 Today's Missions" : `${currentDay.day_short} ${currentDay.day_num} ${currentDay.month}`}
                </p>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-violet-300"
                  style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}>
                  {todayTasks.length} tasks
                </span>
              </div>
            )}

            {/* Tasks for selected day */}
            {todayTasks.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl py-10"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="text-3xl">🌌</span>
                <p className="text-[13px] font-semibold text-zinc-500">Rest day — recharge your shields</p>
                <p className="text-[11px] text-zinc-600">No missions scheduled for this orbit</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map((task: any) => {
                  const isDone = task.completed;
                  const isLoading = completing === task.id;

                  return (
                    <div key={task.id} className="overflow-hidden rounded-2xl transition-all"
                      style={{
                        background: isDone ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isDone ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.08)"}`,
                      }}>
                      <div className="p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                              style={{ background: `${task.gradient_from}20`, border: `1px solid ${task.gradient_from}35`, color: task.gradient_from }}>
                              {task.drop_emoji} {task.drop_name}
                            </span>
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                              style={{
                                background: task.difficulty === "Easy" ? "rgba(16,185,129,0.12)" : task.difficulty === "Medium" ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)",
                                color: task.difficulty === "Easy" ? "#6ee7b7" : task.difficulty === "Medium" ? "#fcd34d" : "#fca5a5",
                              }}>
                              {task.difficulty}
                            </span>
                          </div>
                          {isDone
                            ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            : <span className="text-[10px] text-violet-400 font-semibold flex items-center gap-0.5"><Zap className="h-3 w-3" />+{task.xp} XP</span>
                          }
                        </div>
                        <p className="text-[14px] font-bold" style={{
                          color: isDone ? "#6ee7b7" : "#f4f4f5",
                          textDecoration: isDone ? "line-through" : "none",
                          textDecorationColor: "rgba(110,231,183,0.4)",
                        }}>
                          {task.title}
                        </p>
                        {task.drop_chain && (
                          <p className="text-[10px] text-zinc-600 mt-1">⛓️ {task.drop_chain}</p>
                        )}
                      </div>

                      {!isDone && (
                        <div className="flex border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                          {task.url && (
                            <a href={task.url} target="_blank" rel="noopener noreferrer"
                              className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold transition-all active:scale-[0.98]"
                              style={{ color: task.gradient_from, borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                              <ExternalLink className="h-3.5 w-3.5" /> Open
                            </a>
                          )}
                          <button onClick={() => handleComplete(task)} disabled={isLoading}
                            className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold text-violet-400 transition-all active:scale-[0.98] disabled:opacity-50">
                            {isLoading
                              ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> ...</>
                              : <><CheckCircle2 className="h-3.5 w-3.5" /> Complete</>
                            }
                          </button>
                        </div>
                      )}

                      {isDone && (
                        <div className="flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-emerald-400"
                          style={{ background: "rgba(16,185,129,0.06)", borderTop: "1px solid rgba(16,185,129,0.10)" }}>
                          <CheckCircle2 className="h-3 w-3" /> Mission Complete
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Regenerate button */}
            <button
              onClick={() => setSchedule(null)}
              className="flex items-center justify-center gap-2 rounded-2xl py-3 text-[12px] font-semibold text-zinc-500 transition-all active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <Rocket className="h-3.5 w-3.5" /> Recalculate Trajectory
            </button>

            {/* Tip */}
            <div className="flex items-start gap-2.5 rounded-2xl p-3.5"
              style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)" }}>
              <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                <span className="text-amber-400 font-semibold">Void Navigator Tip:</span> Follow the schedule — completing tasks across multiple days
                creates organic patterns that maximize your airdrop eligibility.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
