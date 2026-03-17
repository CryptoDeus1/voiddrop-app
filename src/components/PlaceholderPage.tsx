import { BarChart3, GraduationCap, Construction } from "lucide-react";

interface PlaceholderPageProps {
  tab: "portfolio" | "education";
}

const CONFIG = {
  portfolio: {
    icon: BarChart3,
    title: "Portfolio",
    subtitle: "Track your farming positions & PnL",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/[0.06]",
    glow: "bg-emerald-600/10",
    gradFrom: "#10b981",
    gradTo: "#059669",
    mockItems: [
      { label: "Monad Position",  value: "$1,240", sub: "+32% ROI", positive: true  },
      { label: "Linea Liquidity", value: "$880",   sub: "+18% ROI", positive: true  },
      { label: "Mitosis Vault",   value: "$210",   sub: "-4% ROI",  positive: false },
    ],
  },
  education: {
    icon: GraduationCap,
    title: "Education",
    subtitle: "Web3 farming guides & strategy videos",
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/[0.06]",
    glow: "bg-amber-600/10",
    gradFrom: "#f59e0b",
    gradTo: "#d97706",
    mockItems: [
      { label: "Anti-Sybil 101",           value: "12 min",  sub: "Beginner", positive: true },
      { label: "Bridge Strategies",         value: "8 min",   sub: "Advanced", positive: true },
      { label: "Wallet Segmentation Guide", value: "20 min",  sub: "Pro",      positive: true },
    ],
  },
};

export function PlaceholderPage({ tab }: PlaceholderPageProps) {
  const c = CONFIG[tab];
  const Icon = c.icon;

  return (
    <div className="flex flex-col gap-5 p-4 pb-28 lg:pb-8">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Icon className={`h-5 w-5 ${c.color}`} />
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">{c.title}</h1>
          <p className="text-sm text-zinc-500">{c.subtitle}</p>
        </div>
      </div>

      {/* Coming soon card */}
      <div className={`relative overflow-hidden rounded-2xl border ${c.border} ${c.bg} p-6 text-center`}>
        <div className={`pointer-events-none absolute inset-0 ${c.glow} blur-3xl opacity-40`} />
        <div className="relative space-y-3">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl"
            style={{ background: `linear-gradient(135deg, ${c.gradFrom}, ${c.gradTo})` }}
          >
            <Construction className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Coming Soon</h2>
            <p className="mt-1 text-sm text-zinc-500">
              This section is under construction. Check back soon!
            </p>
          </div>
        </div>
      </div>

      {/* Mock preview cards */}
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600">
          Preview
        </p>
        {c.mockItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 opacity-50"
          >
            <div>
              <p className="text-sm font-semibold text-zinc-300">{item.label}</p>
              <p className="text-xs text-zinc-600">{item.sub}</p>
            </div>
            <span
              className={`text-sm font-bold ${
                item.positive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Notify button */}
      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-sm font-semibold text-zinc-500 transition-all hover:bg-white/[0.06] hover:text-zinc-300">
        🔔 Notify me when it's ready
      </button>
    </div>
  );
}
