import { Zap } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950">
      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />
      </div>

      {/* Logo */}
      <div className="relative flex flex-col items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg"
          style={{ boxShadow: "0 0 40px rgba(139,92,246,0.4)" }}
        >
          <Zap className="h-8 w-8 text-white" fill="white" />
        </div>

        <div className="text-center">
          <h1 className="text-[20px] font-extrabold text-white tracking-tight">
            VoidDrop
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400 mt-1">
            Explore the Void
          </p>
        </div>

        {/* Loading spinner */}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: "200ms" }} />
          <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: "400ms" }} />
        </div>
      </div>
    </div>
  );
}