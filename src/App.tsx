import { useState, useEffect } from "react";
import { BottomNav, type TabId } from "./components/BottomNav";
import { DropHuntPage }  from "./components/DropHuntPage";
import { SchedulePage }  from "./components/SchedulePage";
import { PortfolioPage } from "./components/PortfolioPage";
import { LearnPage }     from "./components/LearnPage";

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>("drophunt");

  /* ── Telegram WebApp SDK init ───────────────────────────────────── */
  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();                     // Full-screen mode
        tg.disableVerticalSwipes?.();   // Prevent swipe-to-close on Android
        tg.setHeaderColor?.("#09090b");
        tg.setBackgroundColor?.("#09090b");
      }
    } catch (_) { /* Not inside Telegram — dev browser mode */ }
  }, []);

  return (
    /*
     * Root shell:
     * - position:fixed, fills the entire viewport (inset-0)
     * - flex column: content area (flex-1) + fixed bottom nav
     * - overflow:hidden on root — each page manages its own scroll
     */
    <div className="fixed inset-0 flex flex-col bg-zinc-950 text-zinc-100 antialiased overflow-hidden">

      {/* ── Static ambient background glows (decorative, pointer-events:none) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-600/[0.10] blur-[80px]" />
        <div className="absolute -right-20 top-16  h-64 w-64 rounded-full bg-indigo-600/[0.08] blur-[70px]" />
        <div className="absolute bottom-24 left-1/2 h-56 w-[500px] -translate-x-1/2 rounded-full bg-sky-600/[0.06] blur-[90px]" />
      </div>

      {/* ── Page content (fills all space above bottom nav) ── */}
      <div className="relative z-10 flex-1 overflow-hidden">
        {activeTab === "drophunt"  && <DropHuntPage  />}
        {activeTab === "schedule"  && <SchedulePage  />}
        {activeTab === "portfolio" && <PortfolioPage />}
        {activeTab === "education" && <LearnPage     />}
      </div>

      {/* ── Fixed Bottom Navigation ── */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
