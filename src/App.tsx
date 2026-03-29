import { useState, useEffect } from "react";
import { BottomNav, type TabId } from "./components/BottomNav";
import { HomePage }        from "./components/HomePage";
import { VoidTerminal }    from "./components/VoidTerminal";
import { NetworksPage }    from "./components/NetworksPage";
import { ProfilePage }     from "./components/ProfilePage";
import { LearnPage }       from "./components/LearnPage";
import { SplashScreen }    from "./components/SplashScreen";
import { useWallet }       from "./hooks/useWallet";

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>("drophunt");
  const [showSplash, setShowSplash] = useState(true);
  const wallet = useWallet();

  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        tg.disableVerticalSwipes?.();
        tg.setHeaderColor?.("#09090b");
        tg.setBackgroundColor?.("#09090b");
      }
    } catch (_) {}
  }, []);

  // Сплэш: ждём загрузки + минимум 1.2 сек + 0.5 сек fade
  useEffect(() => {
    if (wallet.isLoaded) {
      const timer = setTimeout(() => setShowSplash(false), 1700);
      return () => clearTimeout(timer);
    }
  }, [wallet.isLoaded]);

  return (
    <div className="fixed inset-0 flex flex-col bg-zinc-950 text-zinc-100 antialiased overflow-hidden">

      {showSplash && (
        <div
          className="fixed inset-0 z-[100]"
          style={{
            opacity: wallet.isLoaded ? 0 : 1,
            transition: "opacity 0.5s ease-out",
            transitionDelay: wallet.isLoaded ? "1.2s" : "0s",
            pointerEvents: wallet.isLoaded ? "none" : "auto",
          }}
        >
          <SplashScreen />
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-600/[0.10] blur-[80px]" />
        <div className="absolute -right-20 top-16  h-64 w-64 rounded-full bg-indigo-600/[0.08] blur-[70px]" />
        <div className="absolute bottom-24 left-1/2 h-56 w-[500px] -translate-x-1/2 rounded-full bg-sky-600/[0.06] blur-[90px]" />
      </div>

      <div className="relative z-10 flex-1 overflow-hidden">
        {activeTab === "drophunt"  && <HomePage      wallet={wallet} onNavigate={setActiveTab} />}
        {activeTab === "terminal"  && <VoidTerminal  wallet={wallet} />}
        {activeTab === "networks"  && <NetworksPage  wallet={wallet} />}
        {activeTab === "profile"   && <ProfilePage   wallet={wallet} />}
        {activeTab === "education" && <LearnPage     />}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        positionsCount={wallet.positionsCount}
      />
    </div>
  );
}