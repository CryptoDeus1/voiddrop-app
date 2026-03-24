import { useState, useEffect } from "react";
import {
  ArrowLeft, Clock, Eye, Zap, Bookmark, BookmarkCheck,
  CheckCircle2, ChevronRight, Lightbulb, AlertTriangle, Code,
  Share2, GraduationCap,
} from "lucide-react";
import type { Article, ArticleSection } from "../data/mockLearn";

interface ArticleDetailProps {
  article: Article;
  isRead: boolean;
  isBookmarked: boolean;
  onBack: () => void;
  onMarkRead: (id: string, xp: number) => void;
  onToggleBookmark: (id: string) => void;
}

/* ── Section Renderer ─────────────────── */
function SectionBlock({ section }: { section: ArticleSection }) {
  if (section.type === "tip") {
    return (
      <div
        className="flex items-start gap-2.5 rounded-2xl p-3.5 my-3"
        style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.15)" }}
      >
        <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
        <div>
          {section.title && (
            <p className="text-[12px] font-bold text-amber-400 mb-1">{section.title}</p>
          )}
          <p className="text-[12px] text-zinc-300 leading-relaxed">{section.text}</p>
        </div>
      </div>
    );
  }

  if (section.type === "warning") {
    return (
      <div
        className="flex items-start gap-2.5 rounded-2xl p-3.5 my-3"
        style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}
      >
        <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
        <div>
          {section.title && (
            <p className="text-[12px] font-bold text-red-400 mb-1">{section.title}</p>
          )}
          <p className="text-[12px] text-zinc-300 leading-relaxed">{section.text}</p>
        </div>
      </div>
    );
  }

  if (section.type === "code") {
    return (
      <div className="my-3">
        {section.title && (
          <p className="text-[12px] font-bold text-zinc-300 mb-1.5">{section.title}</p>
        )}
        <div
          className="rounded-xl p-3 font-mono text-[11px] text-emerald-300 leading-relaxed overflow-x-auto"
          style={{ background: "rgba(0,0,0,0.40)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Code className="h-3 w-3 text-zinc-600 float-right" />
          {section.text}
        </div>
      </div>
    );
  }

  // Default: text
  return (
    <div className="my-3">
      {section.title && (
        <h3 className="text-[14px] font-extrabold text-white mb-2 flex items-center gap-2">
          <span className="h-1 w-4 rounded-full bg-violet-500" />
          {section.title}
        </h3>
      )}
      <p className="text-[13px] text-zinc-400 leading-relaxed">{section.text}</p>
    </div>
  );
}

/* ── Main Component ──────────────────── */
export function ArticleDetail({
  article,
  isRead,
  isBookmarked,
  onBack,
  onMarkRead,
  onToggleBookmark,
}: ArticleDetailProps) {
  const [readProgress, setReadProgress] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  // Simulate read progress on scroll
  useEffect(() => {
    const el = document.getElementById("article-scroll");
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      setReadProgress(Math.min(pct, 100));
      if (pct > 80 && !isRead) setShowComplete(true);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [isRead]);

  // Show complete button after 5 seconds for short articles
  useEffect(() => {
    if (!isRead && (article.content?.length || 0) <= 3) {
      const t = setTimeout(() => setShowComplete(true), 5000);
      return () => clearTimeout(t);
    }
  }, [isRead, article.content]);

  const handleShare = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(
        `https://t.me/share/url?url=VoidDrop Academy&text=📚 ${article.title}`
      );
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* ══ Header ═══════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: "rgba(9,9,11,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-all active:scale-90"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              <ArrowLeft className="h-4 w-4 text-zinc-400" />
            </button>
            <div>
              <p className="text-[13px] font-bold text-white truncate max-w-[200px]">
                {article.title}
              </p>
              <p className="text-[9px] text-violet-400 font-semibold uppercase tracking-[0.15em]">
                Void Academy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex h-8 w-8 items-center justify-center rounded-xl active:scale-90"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Share2 className="h-3.5 w-3.5 text-zinc-500" />
            </button>
            <button
              onClick={() => onToggleBookmark(article.id)}
              className="flex h-8 w-8 items-center justify-center rounded-xl active:scale-90"
              style={{
                background: isBookmarked ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${isBookmarked ? "rgba(139,92,246,0.30)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {isBookmarked
                ? <BookmarkCheck className="h-3.5 w-3.5 text-violet-400" />
                : <Bookmark className="h-3.5 w-3.5 text-zinc-500" />}
            </button>
          </div>
        </div>

        {/* Read progress bar */}
        <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${readProgress}%`,
              background: "linear-gradient(90deg, #8b5cf6, #6366f1)",
              boxShadow: "0 0 8px rgba(139,92,246,0.5)",
            }}
          />
        </div>
      </div>

      {/* ══ Content ══════════════════════════════════ */}
      <div id="article-scroll" className="tma-scroll flex-1">
        <div className="flex flex-col gap-0 px-4 pb-nav pt-4">

          {/* Hero */}
          <div
            className="relative overflow-hidden rounded-2xl p-5 mb-4"
            style={{
              background: `linear-gradient(135deg, ${article.gradFrom}20, ${article.gradTo}10)`,
              border: `1px solid ${article.gradFrom}30`,
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${article.gradFrom}80, transparent)` }} />

            <div className="flex items-start gap-3 mb-3">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[28px]"
                style={{
                  background: `linear-gradient(135deg, ${article.gradFrom}, ${article.gradTo})`,
                  boxShadow: `0 4px 16px ${article.gradFrom}50`,
                }}
              >
                {article.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  {article.isNew && (
                    <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-300"
                      style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.20)" }}>
                      New
                    </span>
                  )}
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                    style={{
                      background: article.categoryBg.replace("bg-", "").includes("/")
                        ? undefined : "rgba(139,92,246,0.12)",
                      color: article.categoryColor.replace("text-", ""),
                      border: `1px solid ${article.categoryBorder.replace("border-", "")}`,
                    }}
                  >
                    {article.category}
                  </span>
                </div>
                <h1 className="text-[16px] font-extrabold text-white leading-snug">
                  {article.title}
                </h1>
              </div>
            </div>

            <p className="text-[12px] text-zinc-400 leading-relaxed mb-3">
              {article.subtitle}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                <Clock className="h-3 w-3" /> {article.readTime}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                <Eye className="h-3 w-3" /> {article.views}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-violet-400 font-semibold">
                <Zap className="h-3 w-3" /> +{article.xpReward} XP
              </div>
              {isRead && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Read
                </div>
              )}
            </div>
          </div>

          {/* Sections */}
          {article.content && article.content.length > 0 ? (
            <div className="space-y-1">
              {article.content.map((section, i) => (
                <SectionBlock key={i} section={section} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl py-10"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <GraduationCap className="h-8 w-8 text-zinc-600" />
              <p className="text-[13px] font-semibold text-zinc-500">Content coming soon</p>
              <p className="text-[11px] text-zinc-600">This article is being written by Void Academy</p>
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap mt-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-zinc-500"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Complete / Already Read */}
          {isRead ? (
            <div
              className="flex items-center justify-center gap-2 rounded-2xl py-4 mt-4"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-[14px] font-bold text-emerald-400">
                Completed — +{article.xpReward} XP earned
              </span>
            </div>
          ) : showComplete ? (
            <button
              onClick={() => onMarkRead(article.id, article.xpReward)}
              className="relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl py-4 mt-4 text-[14px] font-bold text-white transition-all active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #6366f1)",
                boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
              }}
            >
              <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <CheckCircle2 className="h-5 w-5" />
              Mark as Read — Earn +{article.xpReward} XP
            </button>
          ) : (
            <div
              className="flex items-center justify-center gap-2 rounded-2xl py-3 mt-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-[12px] text-zinc-600">
                📖 Keep reading to unlock completion...
              </span>
            </div>
          )}

          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 rounded-2xl py-3 mt-2 text-[13px] font-semibold text-zinc-500 transition-all active:scale-[0.98]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Academy
          </button>
        </div>
      </div>
    </div>
  );
}