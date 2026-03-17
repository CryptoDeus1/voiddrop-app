export type TaskCategory = "Swap" | "Bridge" | "Liquidity" | "Stake" | "Mint" | "Vote";
export type TaskStatus = "pending" | "done" | "skipped";

export interface ScheduleTask {
  id: number;
  category: TaskCategory;
  categoryEmoji: string;
  categoryColor: string;
  categoryBg: string;
  categoryBorder: string;
  title: string;
  protocol: string;
  chain: string;
  chainEmoji: string;
  proTip: string;
  estimatedTime: string;
  estimatedReward: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: TaskStatus;
  projectGradientFrom: string;
  projectGradientTo: string;
  projectGlow: string;
  projectEmoji: string;
}

export interface DayEntry {
  id: string;
  dayShort: string;
  dayNum: number;
  isToday: boolean;
  isCompleted: boolean;
  hasTasks: boolean;
  taskCount: number;
}

export const WEEK_DAYS: DayEntry[] = [
  { id: "mon", dayShort: "Mon", dayNum: 12, isToday: false, isCompleted: true, hasTasks: true, taskCount: 3 },
  { id: "tue", dayShort: "Tue", dayNum: 13, isToday: false, isCompleted: true, hasTasks: true, taskCount: 4 },
  { id: "wed", dayShort: "Wed", dayNum: 14, isToday: false, isCompleted: true, hasTasks: true, taskCount: 2 },
  { id: "thu", dayShort: "Thu", dayNum: 15, isToday: true,  isCompleted: false, hasTasks: true, taskCount: 3 },
  { id: "fri", dayShort: "Fri", dayNum: 16, isToday: false, isCompleted: false, hasTasks: true, taskCount: 3 },
  { id: "sat", dayShort: "Sat", dayNum: 17, isToday: false, isCompleted: false, hasTasks: true, taskCount: 2 },
  { id: "sun", dayShort: "Sun", dayNum: 18, isToday: false, isCompleted: false, hasTasks: false, taskCount: 0 },
];

export const TODAY_TASKS: ScheduleTask[] = [
  {
    id: 1,
    category: "Swap",
    categoryEmoji: "🔄",
    categoryColor: "text-violet-400",
    categoryBg: "bg-violet-500/10",
    categoryBorder: "border-violet-500/25",
    title: "Swap ETH → USDC",
    protocol: "Pacifica DEX",
    chain: "Pacifica Ecosystem",
    chainEmoji: "🌊",
    proTip: "Use a random amount like $12.45 or $37.82 — avoid round numbers to reduce on-chain pattern detection.",
    estimatedTime: "~3 min",
    estimatedReward: "+15 XP",
    difficulty: "Easy",
    status: "done",
    projectGradientFrom: "#0ea5e9",
    projectGradientTo: "#0284c7",
    projectGlow: "rgba(14,165,233,0.35)",
    projectEmoji: "🌊",
  },
  {
    id: 2,
    category: "Bridge",
    categoryEmoji: "🌉",
    categoryColor: "text-amber-400",
    categoryBg: "bg-amber-500/10",
    categoryBorder: "border-amber-500/25",
    title: "Bridge USDC to Monad",
    protocol: "Monad Bridge",
    chain: "Ethereum → Monad",
    chainEmoji: "🟣",
    proTip: "Wait at least 2–4 hours between bridge transactions. Space your activity to mimic organic user behavior.",
    estimatedTime: "~8 min",
    estimatedReward: "+25 XP",
    difficulty: "Easy",
    status: "pending",
    projectGradientFrom: "#7c3aed",
    projectGradientTo: "#4f46e5",
    projectGlow: "rgba(124,58,237,0.35)",
    projectEmoji: "🟣",
  },
  {
    id: 3,
    category: "Liquidity",
    categoryEmoji: "💧",
    categoryColor: "text-cyan-400",
    categoryBg: "bg-cyan-500/10",
    categoryBorder: "border-cyan-500/25",
    title: "Add Liquidity ETH/USDC",
    protocol: "Linea Finance",
    chain: "Linea Mainnet",
    chainEmoji: "🔷",
    proTip: "Add liquidity for at least 48 hours before withdrawing. Short LP positions are flagged by Sybil filters.",
    estimatedTime: "~5 min",
    estimatedReward: "+35 XP",
    difficulty: "Medium",
    status: "pending",
    projectGradientFrom: "#3b82f6",
    projectGradientTo: "#1d4ed8",
    projectGlow: "rgba(59,130,246,0.35)",
    projectEmoji: "🔷",
  },
];

export const STREAK_DATA = {
  currentStreak: 7,
  longestStreak: 14,
  totalXP: 1_840,
  weeklyXP: 320,
  level: 12,
  levelName: "DeFi Ranger",
  xpToNextLevel: 500,
  xpProgress: 340,
};
