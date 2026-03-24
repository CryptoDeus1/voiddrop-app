// src/components/LearnPage.tsx
import { useState, useEffect } from "react";
import {
  BookOpen, Search, ArrowRight, Clock, Zap,
  Bookmark, BookmarkCheck,
  Eye, GraduationCap, Trophy,
  Flame, ChevronDown, ChevronUp, X,
} from "lucide-react";
import {
  CATEGORIES, ARTICLES,
  QUICK_TIPS,
  type Article,
} from "../data/mockLearn";
import { ArticleDetail } from "./ArticleDetail";

/* ═══════ LocalStorage ═══════ */
function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}
function saveSet(key: string, s: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...s]));
}
function loadNum(key: string): number {
  try { return Number(localStorage.getItem(key)) || 0; } catch { return 0; }
}

/* ═══════ Badge ═══════ */
function DiffBadge({ level }: { level: string }) {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    Beginner:     { color: "#6ee7b7", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.22)" },
    Intermediate: { color: "#fcd34d", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.22)" },
    Advanced:     { color: "#fca5a5", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.22)" },
    Pro:          { color: "#c4b5fd", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.22)" },
  };
  const s = map[level] ?? { color: "#71717a", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.10)" };
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {level}
    </span>
  );
}

/* ═══════ Quick Tips ═══════ */
function QuickTips() {
  const [idx, setIdx] = useState(0);
  const tip = QUICK_TIPS[idx];
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">⚡ Quick Tip</p>
      <div className="relative overflow-hidden rounded-2xl p-4"
        style={{ background: tip.bg, border: `1px solid ${tip.border}` }}>
        <div className="flex items-start gap-3">
          <span className="text-[22px] shrink-0">{tip.emoji}</span>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: tip.color }}>{tip.category}</p>
            <p className="text-[13px] text-zinc-300 leading-relaxed">{tip.tip}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {QUICK_TIPS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className="rounded-full transition-all"
              style={{ width: i === idx ? 16 : 6, height: 6, background: i === idx ? tip.color : "rgba(255,255,255,0.15)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN LearnPage
═══════════════════════════════════════ */
export function LearnPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // ═══ Главное: выбранная статья ═══
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // ═══ Persistent state ═══
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => loadSet("vd_bookmarks"));
  const [readArticles, setReadArticles] = useState<Set<string>>(() => loadSet("vd_read"));
  const [totalXP, setTotalXP] = useState(() => loadNum("vd_xp"));

  // Сохраняем при изменении
  useEffect(() => { saveSet("vd_bookmarks", bookmarks); }, [bookmarks]);
  useEffect(() => { saveSet("vd_read", readArticles); }, [readArticles]);
  useEffect(() => { localStorage.setItem("vd_xp", String(totalXP)); }, [totalXP]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  // ═══ Функции ═══
  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const markAsRead = (id: string, xp: number) => {
    if (readArticles.has(id)) return;
    setReadArticles((prev) => new Set(prev).add(id));
    setTotalXP((prev) => prev + xp);
    setToast(`✅ +${xp} XP earned!`);
  };

  const openNextUnread = () => {
    const next = ARTICLES.find((a) => !readArticles.has(a.id));
    if (next) setSelectedArticle(next);
    else setToast("🎉 All articles completed!");
  };

  // ═══ Фильтрация ═══
  const filtered = ARTICLES.filter((a) => {
    const q = search.toLowerCase();
    const matchQ = !q || a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q));
    const matchCat = !activeCategory || a.category === activeCategory;
    return matchQ && matchCat;
  });
  const visible = showAll ? filtered : filtered.slice(0, 4);

  // ═══════════════════════════════════════════
  // ЕСЛИ ВЫБРАНА СТАТЬЯ → ПОКАЗЫВАЕМ ДЕТАЛИ
  // ═══════════════════════════════════════════
  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        isRead={readArticles.has(selectedArticle.id)}
        isBookmarked={bookmarks.has(selectedArticle.id)}
        onBack={() => setSelectedArticle(null)}
        onMarkRead={markAsRead}
        onToggleBookmark={toggleBookmark}
      />
    );
  }

  // ═══════════════════════════════════════════
  // ОСНОВНОЙ СПИСОК
  // ═══════════════════════════════════════════
  return (
    <div className="tma-scroll h-full flex flex-col">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 z-50 flex items-center gap-2 rounded-2xl px-4 py-3"
          style={{ background: "rgba(16,185,129,0.95)", boxShadow: "0 4px 20px rgba(16,185,129,0.4)" }}>
          <span className="text-[13px] font-bold text-white flex-1">{toast}</span>
          <button onClick={() => setToast(null)}><X className="h-4 w-4 text-white/70" /></button>
        </div>
      )}

      {/* ══ Header ══════════════════════════ */}
      <div className="sticky top-0 z-30 px-4 pt-3 pb-3"
        style={{ background: "rgba(9,9,11,0.90)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-violet-400" />
              <h1 className="text-[18px] font-extrabold tracking-tight text-white">Void Academy 📚</h1>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">Learn to survive the Void</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-2xl px-2.5 py-1.5"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)" }}>
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px] font-extrabold text-amber-300">{totalXP}</span>
            <span className="text-[9px] text-amber-600">XP</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
          <input type="text" placeholder="Search guides..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl pl-8 pr-9 text-[13px] text-zinc-200 placeholder-zinc-600 focus:ring-1 focus:ring-violet-500/30"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }} />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 active:scale-90">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ══ Body ════════════════════════════ */}
      <div className="flex flex-col gap-4 px-4 pb-nav pt-4">

        {/* ── Progress Banner ────────────── */}
        <div className="relative overflow-hidden rounded-2xl p-4"
          style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.20)" }}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}>
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-extrabold text-white">
                  {readArticles.size === 0 ? "Start Your Journey" : readArticles.size >= ARTICLES.length ? "All Complete! 🎉" : "Keep Learning"}
                </p>
                <div className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-400" />
                  <span className="text-[11px] font-bold text-orange-300">{readArticles.size}✓</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.round((readArticles.size / ARTICLES.length) * 100)}%`,
                      background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                    }} />
                </div>
                <span className="text-[10px] font-semibold text-indigo-400 shrink-0">
                  {readArticles.size}/{ARTICLES.length}
                </span>
              </div>
            </div>
            <button onClick={openNextUnread}
              className="flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-bold text-white active:scale-95 transition-all"
              style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)", boxShadow: "0 0 14px rgba(99,102,241,0.35)" }}>
              {readArticles.size === 0 ? "Start" : "Next"}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* ── Quick Tips ──────────────────── */}
        <QuickTips />

        {/* ── Categories ──────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Categories</p>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)}
                className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 active:scale-95">
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 snap-x">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <button key={cat.id} onClick={() => setActiveCategory(isActive ? null : cat.label)}
                  className="snap-start shrink-0 flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 transition-all active:scale-95"
                  style={isActive
                    ? { background: cat.bgColor, border: `1px solid ${cat.borderColor}`, boxShadow: `0 0 14px ${cat.glowColor}` }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
                  }>
                  <span className="text-[20px]">{cat.emoji}</span>
                  <span className="text-[11px] font-semibold whitespace-nowrap"
                    style={{ color: isActive ? cat.textColor : "#71717a" }}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Articles List ───────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Articles</p>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-violet-300"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.22)" }}>
              {filtered.length}
            </span>
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl py-10"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-3xl">🔍</span>
              <p className="text-[13px] font-semibold text-zinc-500">No articles found</p>
              <button onClick={() => { setSearch(""); setActiveCategory(null); }}
                className="text-[12px] font-semibold text-violet-400">Clear filters</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {visible.map((article) => {
                const isRead = readArticles.has(article.id);
                const isBookmarked = bookmarks.has(article.id);

                return (
                  <div
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="flex items-center gap-3 rounded-2xl p-3.5 transition-all active:scale-[0.98] cursor-pointer"
                    style={{
                      background: isRead ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isRead ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    {/* Emoji */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[20px]"
                      style={{ background: `linear-gradient(135deg,${article.gradFrom},${article.gradTo})` }}>
                      {article.emoji}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        {isRead && (
                          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-300"
                            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.20)" }}>
                            ✓ Read
                          </span>
                        )}
                        {!isRead && article.isNew && (
                          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-300"
                            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.20)" }}>
                            New
                          </span>
                        )}
                        <DiffBadge level={article.difficulty} />
                      </div>
                      <p className="text-[13px] font-semibold text-zinc-200 leading-snug line-clamp-2">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-zinc-600 flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" /> {article.readTime}
                        </span>
                        <span className="text-[10px] font-semibold text-violet-400 flex items-center gap-0.5">
                          <Zap className="h-2.5 w-2.5" /> {isRead ? "✓" : "+"}{article.xpReward} XP
                        </span>
                      </div>
                    </div>

                    {/* Bookmark */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(article.id); }}
                      className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all active:scale-90"
                      style={{
                        background: isBookmarked ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {isBookmarked
                        ? <BookmarkCheck className="h-4 w-4 text-violet-400" />
                        : <Bookmark className="h-4 w-4 text-zinc-600" />
                      }
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show more */}
          {filtered.length > 4 && (
            <button onClick={() => setShowAll(p => !p)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl py-3 text-[12px] font-semibold text-zinc-500 transition-all active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {showAll
                ? <><ChevronUp className="h-3.5 w-3.5" /> Show Less</>
                : <><ChevronDown className="h-3.5 w-3.5" /> Show All ({filtered.length})</>
              }
            </button>
          )}
        </div>

        {/* ── Bottom CTA ──────────────────── */}
        <div className="relative overflow-hidden rounded-2xl p-4 text-center"
          style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.18)" }}>
          <p className="text-[14px] font-extrabold text-white mb-1">
            {readArticles.size === 0 ? "📚 Start Learning" : `🎓 ${readArticles.size}/${ARTICLES.length} Mastered`}
          </p>
          <p className="text-[11px] text-zinc-500 mb-3">
            {readArticles.size < ARTICLES.length
              ? `${ARTICLES.length - readArticles.size} articles left • ${totalXP} XP earned`
              : `All done! ${totalXP} XP total`
            }
          </p>
          <button onClick={openNextUnread}
            className="w-full rounded-xl py-3 text-[13px] font-bold text-white active:scale-[0.98] transition-all"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}>
            {readArticles.size < ARTICLES.length ? "Continue Learning →" : "Review Articles →"}
          </button>
        </div>
      </div>
    </div>
  );
}