import { useState } from "react";
import {
  BookOpen, Search, ArrowRight, Clock, Zap,
  Bookmark, BookmarkCheck, Play, Lock,
  Eye, GraduationCap, Trophy,
  Flame, ChevronDown, ChevronUp, X,
} from "lucide-react";
import {
  FEATURED_ARTICLE, CATEGORIES, ARTICLES,
  QUICK_TIPS, VIDEO_LESSONS, LEARNING_PATH,
  type Article,
} from "../data/mockLearn";

/* ══════════════════════════════════════════════════════════════════
   Difficulty Badge
══════════════════════════════════════════════════════════════════ */
function DiffBadge({ level }: { level: string }) {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    Beginner:     { color: "#6ee7b7", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.22)"  },
    Intermediate: { color: "#fcd34d", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.22)"  },
    Advanced:     { color: "#fca5a5", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.22)"   },
    Pro:          { color: "#c4b5fd", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.22)"  },
  };
  const s = map[level] ?? { color: "#71717a", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.10)" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {level}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Learning Path Banner
══════════════════════════════════════════════════════════════════ */
function LearningPathBanner() {
  const lp  = LEARNING_PATH;
  const pct = Math.round((lp.modulesCompleted / lp.totalModules) * 100);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-4"
      style={{
        background: "rgba(99,102,241,0.07)",
        border: "1px solid rgba(99,102,241,0.20)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-600/15 blur-2xl" />

      <div className="relative flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
        >
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-extrabold text-white">{lp.currentPath}</p>
            <div className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-400" />
              <span className="text-[11px] font-bold text-orange-300">{lp.streakDays}d</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mb-2">{lp.nextLesson}</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }}
              />
            </div>
            <span className="text-[10px] font-semibold text-indigo-400 shrink-0">{lp.modulesCompleted}/{lp.totalModules}</span>
          </div>
        </div>
        <button
          className="flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-bold text-white active:scale-95 transition-all"
          style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)", boxShadow: "0 0 14px rgba(99,102,241,0.35)" }}
        >
          Continue
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Featured / Must-Read Banner
══════════════════════════════════════════════════════════════════ */
function FeaturedBanner() {
  const f = FEATURED_ARTICLE;
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-4"
      style={{
        background: `linear-gradient(135deg, rgba(88,28,135,0.70) 0%, rgba(30,27,75,0.90) 100%)`,
        border: "1px solid rgba(139,92,246,0.28)",
        boxShadow: "0 0 30px -8px rgba(139,92,246,0.25)",
      }}
    >
      {/* Texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(circle,#a78bfa 1px,transparent 1px)", backgroundSize: "18px 18px" }} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
      <div className="pointer-events-none absolute -right-8 -bottom-6 h-32 w-32 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative">
        <div className="flex items-start gap-3 mb-3">
          {/* Big emoji */}
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[22px]"
            style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.35)" }}
          >
            {f.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-violet-200"
                style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.35)" }}
              >
                ✦ Must Read
              </span>
              {f.isNew && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}
                >
                  New
                </span>
              )}
              <DiffBadge level={f.difficulty} />
            </div>
            <p className="text-[13px] font-extrabold text-white leading-snug">{f.title}</p>
          </div>
        </div>

        <p className="text-[12px] text-zinc-400 leading-relaxed mb-3">{f.subtitle}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Clock className="h-3 w-3" /> {f.readTime}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Eye className="h-3 w-3" /> {f.views}
            </div>
          </div>
          <button
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[12px] font-bold text-white active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", boxShadow: "0 0 16px rgba(124,58,237,0.40)" }}
          >
            Read Now <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Quick Tips Carousel
══════════════════════════════════════════════════════════════════ */
function QuickTips() {
  const [idx, setIdx] = useState(0);
  const tip = QUICK_TIPS[idx];

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">⚡ Quick Tip</p>
      <div
        className="relative overflow-hidden rounded-2xl p-4"
        style={{ background: tip.bg, border: `1px solid ${tip.border}` }}
      >
        <div className="flex items-start gap-3">
          <span className="text-[22px] shrink-0">{tip.emoji}</span>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: tip.color }}>{tip.category}</p>
            <p className="text-[13px] text-zinc-300 leading-relaxed">{tip.tip}</p>
          </div>
        </div>
        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {QUICK_TIPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 16 : 6,
                height: 6,
                background: i === idx ? tip.color : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Article Card — compact mobile row
══════════════════════════════════════════════════════════════════ */
function ArticleRow({
  article,
  bookmarked,
  onToggleBookmark,
}: {
  article: Article;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl p-3.5 transition-all active:scale-[0.98]"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Emoji icon */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[20px]"
        style={{ background: `linear-gradient(135deg,${article.gradFrom},${article.gradTo})` }}
      >
        {article.emoji}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          {article.isNew && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-300"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.20)" }}
            >
              New
            </span>
          )}
          <DiffBadge level={article.difficulty} />
        </div>
        <p className="text-[13px] font-semibold text-zinc-200 leading-snug line-clamp-2">{article.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-zinc-600 flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5" /> {article.readTime}
          </span>
          <span className="text-[10px] font-semibold text-violet-400 flex items-center gap-0.5">
            <Zap className="h-2.5 w-2.5" /> +{article.xpReward} XP
          </span>
        </div>
      </div>

      {/* Bookmark */}
      <button
        onClick={() => onToggleBookmark(article.id)}
        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all active:scale-90"
        style={{ background: bookmarked ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {bookmarked
          ? <BookmarkCheck className="h-4 w-4 text-violet-400" />
          : <Bookmark className="h-4 w-4 text-zinc-600" />
        }
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN LearnPage
══════════════════════════════════════════════════════════════════ */
export function LearnPage() {
  const [search,       setSearch]       = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [bookmarks,    setBookmarks]    = useState<Set<string>>(new Set());
  const [showAll,      setShowAll]      = useState(false);

  const toggleBookmark = (id: string) =>
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered = ARTICLES.filter((a) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.subtitle.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q));
    const matchCat = !activeCategory || a.category === activeCategory;
    return matchQ && matchCat;
  });

  const visible = showAll ? filtered : filtered.slice(0, 4);

  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* ══ Sticky TMA Header ════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 px-4 pt-3 pb-3"
        style={{
          background: "rgba(9,9,11,0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Title */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-violet-400" />
              <h1 className="text-[18px] font-extrabold tracking-tight text-white">
                Airdrop Academy 📚
              </h1>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Web3 learning hub for farmers</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl px-2.5 py-1.5"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)" }}>
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] font-extrabold text-amber-300">{LEARNING_PATH.totalXP.toLocaleString()}</span>
            <span className="text-[9px] text-amber-600">XP</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Search guides, tips, protocols…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl pl-8 pr-9 text-[13px] text-zinc-200 placeholder-zinc-600 transition-all focus:ring-1 focus:ring-violet-500/30"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 active:scale-90 transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ══ Scrollable body ══════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* ── Learning Path Banner ──────────────────────────────── */}
        <LearningPathBanner />

        {/* ── Featured Must-Read ────────────────────────────────── */}
        <FeaturedBanner />

        {/* ── Quick Tip Carousel ────────────────────────────────── */}
        <QuickTips />

        {/* ── Categories horizontal scroll ──────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Categories</p>
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 active:scale-95"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 snap-x">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? null : cat.label)}
                  className="snap-start shrink-0 flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 transition-all active:scale-95"
                  style={
                    isActive
                      ? {
                          background: cat.bgColor,
                          border: `1px solid ${cat.borderColor}`,
                          boxShadow: `0 0 14px ${cat.glowColor}`,
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }
                  }
                >
                  <span className="text-[20px]">{cat.emoji}</span>
                  <span
                    className="text-[11px] font-semibold whitespace-nowrap"
                    style={{ color: isActive ? cat.textColor : "#71717a" }}
                  >
                    {cat.label}
                  </span>
                  <span
                    className="rounded-full px-1.5 text-[9px] font-bold"
                    style={{ background: "rgba(255,255,255,0.08)", color: "#52525b" }}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Articles list ──────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
              Latest Articles
            </p>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold text-violet-300"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.22)" }}
            >
              {filtered.length}
            </span>
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl py-10"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-3xl">🔍</span>
              <p className="text-[13px] font-semibold text-zinc-500">No articles found</p>
              <button onClick={() => { setSearch(""); setActiveCategory(null); }}
                className="text-[12px] font-semibold text-violet-400">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {visible.map((a) => (
                <ArticleRow
                  key={a.id}
                  article={a}
                  bookmarked={bookmarks.has(a.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          )}

          {filtered.length > 4 && (
            <button
              onClick={() => setShowAll((p) => !p)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl py-3 text-[12px] font-semibold text-zinc-500 transition-all active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {showAll
                ? <><ChevronUp className="h-3.5 w-3.5" /> Show Less</>
                : <><ChevronDown className="h-3.5 w-3.5" /> Show All ({filtered.length})</>
              }
            </button>
          )}
        </div>

        {/* ── Video Lessons ──────────────────────────────────────── */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">🎬 Video Lessons</p>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 snap-x">
            {VIDEO_LESSONS.map((v) => (
              <div
                key={v.id}
                className="snap-start shrink-0 relative overflow-hidden rounded-2xl"
                style={{ width: 160, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Thumbnail */}
                <div
                  className="relative flex h-24 items-center justify-center text-[32px]"
                  style={{ background: `linear-gradient(135deg,${v.gradFrom},${v.gradTo})` }}
                >
                  {v.emoji}
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    {v.isLocked ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50">
                        <Lock className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                        <Play className="h-4 w-4 text-white" fill="white" />
                      </div>
                    )}
                  </div>
                  {/* PRO badge */}
                  {v.isLocked && (
                    <span
                      className="absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold text-amber-300"
                      style={{ background: "rgba(245,158,11,0.30)" }}
                    >
                      PRO
                    </span>
                  )}
                </div>
                {/* Info */}
                <div className="p-2.5">
                  <p className="text-[11px] font-semibold text-zinc-200 leading-snug line-clamp-2 mb-1.5">{v.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-zinc-600 flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" /> {v.duration}
                    </span>
                    <DiffBadge level={v.level} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ─────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl p-4 text-center"
          style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)" }}
        >
          <p className="text-[14px] font-extrabold text-white mb-1">🎓 Get Your Custom Plan</p>
          <p className="text-[11px] text-zinc-500 mb-3 leading-relaxed">
            Answer 5 questions and get a personalized farming roadmap built for your wallet level.
          </p>
          <button
            className="relative overflow-hidden w-full rounded-xl py-3 text-[13px] font-bold text-white active:scale-[0.98] transition-all"
            style={{ background: "linear-gradient(135deg,#d97706,#b45309)", boxShadow: "0 4px 16px rgba(217,119,6,0.35)" }}
          >
            <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            Start My Learning Path →
          </button>
        </div>

      </div>
    </div>
  );
}
