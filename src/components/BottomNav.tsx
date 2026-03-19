import { Crosshair, CalendarDays, Radar, Shield, GraduationCap } from "lucide-react";

export type TabId = "drophunt" | "terminal" | "schedule" | "shield" | "education";

const NAV_ITEMS: {
  id: TabId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}[] = [
  { id: "drophunt",  label: "DropHunt",  icon: Crosshair,     badge: "9" },
  { id: "terminal",  label: "Terminal",  icon: Radar                     },
  { id: "schedule",  label: "Schedule",  icon: CalendarDays              },
  { id: "shield",    label: "Shield",    icon: Shield                    },
  { id: "education", label: "Learn",     icon: GraduationCap, badge: "3" },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 pb-safe"
      style={{ background: "rgba(9,9,11,0.97)" }}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />

      <div className="flex items-stretch" style={{ height: "var(--bottom-nav-h, 60px)" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const isTerminal = item.id === "terminal";

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 transition-transform duration-100 active:scale-90"
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-b-full"
                  style={{
                    width: 32,
                    background: isTerminal ? "#0ea5e9" : "#a78bfa",
                    boxShadow: isTerminal
                      ? "0 0 8px rgba(14,165,233,0.9), 0 0 20px rgba(14,165,233,0.5)"
                      : "0 0 8px rgba(167,139,250,0.9), 0 0 20px rgba(139,92,246,0.5)",
                  }}
                />
              )}

              <div
                className="relative flex items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  width: 40,
                  height: 34,
                  background: isActive
                    ? isTerminal ? "rgba(14,165,233,0.18)" : "rgba(139,92,246,0.18)"
                    : "transparent",
                  boxShadow: isActive
                    ? isTerminal ? "0 0 16px rgba(14,165,233,0.30)" : "0 0 16px rgba(139,92,246,0.30)"
                    : "none",
                }}
              >
                <item.icon
                  className="transition-colors duration-200"
                  style={{
                    width: 20,
                    height: 20,
                    color: isActive
                      ? isTerminal ? "#38bdf8" : "#a78bfa"
                      : "#52525b",
                    strokeWidth: isActive ? 2.2 : 1.8,
                  }}
                />

                {item.badge && (
                  <span
                    className="absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-violet-500 text-white font-bold"
                    style={{ fontSize: 9, minWidth: 16, height: 16, padding: "0 4px" }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className="font-semibold tracking-wide transition-colors duration-200"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.04em",
                  color: isActive
                    ? isTerminal ? "#38bdf8" : "#a78bfa"
                    : "#52525b",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}