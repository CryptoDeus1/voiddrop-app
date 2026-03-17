/* ─────────────────────────────────────────────────────────────
   Mock Portfolio Data — Crypto Farm Assistant
   ───────────────────────────────────────────────────────────── */

export interface WalletInfo {
  address: string;
  addressShort: string;
  ensName: string;
  network: string;
  networkColor: string;
  totalAssets: number;
  totalAssetsFormatted: string;
  change24h: number;
  change24hFormatted: string;
  isPositive: boolean;
  avatarGradientFrom: string;
  avatarGradientTo: string;
}

export interface StatCard {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  emoji: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  glowClass: string;
}

export interface ActivityItem {
  id: number;
  emoji: string;
  title: string;
  protocol: string;
  chain: string;
  chainEmoji: string;
  timeAgo: string;
  xpGained: number;
  txHash: string;
  status: "success" | "pending" | "failed";
  category: string;
  categoryColor: string;
}

export interface ScoreBreakdown {
  label: string;
  score: number;
  maxScore: number;
  color: string;
  bg: string;
  description: string;
}

export interface ChainActivity {
  chain: string;
  emoji: string;
  txCount: number;
  volumeUSD: number;
  gradientFrom: string;
  gradientTo: string;
  pct: number;
}

/* ── Wallet ──────────────────────────────────────────────── */
export const MOCK_WALLET: WalletInfo = {
  address: "0x71F4a832C3e7B9d2F048a5F3cD4e8901dB3a3A9b",
  addressShort: "0x71F...3A9b",
  ensName: "farmoor.eth",
  network: "Ethereum",
  networkColor: "text-indigo-400",
  totalAssets: 450.0,
  totalAssetsFormatted: "$450.00",
  change24h: 12.4,
  change24hFormatted: "+$12.40",
  isPositive: true,
  avatarGradientFrom: "#7c3aed",
  avatarGradientTo: "#6366f1",
};

/* ── Stat Grid ───────────────────────────────────────────── */
export const STAT_CARDS: StatCard[] = [
  {
    id: "chains",
    label: "Active Chains",
    value: "5",
    subValue: "Ethereum, Linea, Monad…",
    emoji: "⛓️",
    colorClass: "text-sky-400",
    bgClass: "bg-sky-500/[0.07]",
    borderClass: "border-sky-500/20",
    glowClass: "rgba(14,165,233,0.15)",
  },
  {
    id: "tasks",
    label: "Total Tasks Done",
    value: "84",
    subValue: "↑ 6 this week",
    emoji: "✅",
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-500/[0.07]",
    borderClass: "border-emerald-500/20",
    glowClass: "rgba(16,185,129,0.15)",
  },
  {
    id: "streak",
    label: "Longest Streak",
    value: "12",
    subValue: "Days 🔥",
    emoji: "🔥",
    colorClass: "text-orange-400",
    bgClass: "bg-orange-500/[0.07]",
    borderClass: "border-orange-500/20",
    glowClass: "rgba(249,115,22,0.15)",
  },
  {
    id: "volume",
    label: "Volume Generated",
    value: "$1,250",
    subValue: "Across all chains",
    emoji: "💸",
    colorClass: "text-violet-400",
    bgClass: "bg-violet-500/[0.07]",
    borderClass: "border-violet-500/20",
    glowClass: "rgba(139,92,246,0.15)",
  },
];

/* ── Sybil Score ─────────────────────────────────────────── */
export const SYBIL_SCORE = {
  total: 85,
  maxTotal: 100,
  grade: "A",
  label: "Excellent",
  percentile: 15,
  statusText:
    "Your organic behavior pattern puts you in the top 15% of wallets. Keep diversifying your on-chain activity!",
  pacificaBoost: 10,
  pacificaBoostedScore: 85,
  breakdown: [
    {
      label: "Tx Diversity",
      score: 22,
      maxScore: 25,
      color: "bg-violet-500",
      bg: "bg-violet-500/10",
      description: "Variety of contract types interacted with",
    },
    {
      label: "Time Spacing",
      score: 20,
      maxScore: 25,
      color: "bg-sky-500",
      bg: "bg-sky-500/10",
      description: "Gap between transactions (organic timing)",
    },
    {
      label: "Volume Pattern",
      score: 18,
      maxScore: 25,
      color: "bg-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Randomness of transaction amounts",
    },
    {
      label: "Wallet Age",
      score: 25,
      maxScore: 25,
      color: "bg-amber-500",
      bg: "bg-amber-500/10",
      description: "Account maturity & first-tx date",
    },
  ] satisfies ScoreBreakdown[],
};

/* ── Chain Activity ──────────────────────────────────────── */
export const CHAIN_ACTIVITY: ChainActivity[] = [
  {
    chain: "Ethereum",
    emoji: "⟠",
    txCount: 38,
    volumeUSD: 580,
    gradientFrom: "#6366f1",
    gradientTo: "#4f46e5",
    pct: 46,
  },
  {
    chain: "Linea",
    emoji: "🔷",
    txCount: 22,
    volumeUSD: 320,
    gradientFrom: "#3b82f6",
    gradientTo: "#1d4ed8",
    pct: 26,
  },
  {
    chain: "Monad",
    emoji: "🟣",
    txCount: 14,
    volumeUSD: 210,
    gradientFrom: "#7c3aed",
    gradientTo: "#5b21b6",
    pct: 17,
  },
  {
    chain: "Base",
    emoji: "🔵",
    txCount: 7,
    volumeUSD: 95,
    gradientFrom: "#0ea5e9",
    gradientTo: "#0284c7",
    pct: 8,
  },
  {
    chain: "Scroll",
    emoji: "📜",
    txCount: 3,
    volumeUSD: 45,
    gradientFrom: "#10b981",
    gradientTo: "#059669",
    pct: 3,
  },
];

/* ── Recent Activity ─────────────────────────────────────── */
export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    emoji: "🔄",
    title: "Swapped ETH → USDC",
    protocol: "Pacifica DEX",
    chain: "Pacifica",
    chainEmoji: "🌊",
    timeAgo: "2h ago",
    xpGained: 15,
    txHash: "0xab3f…9d12",
    status: "success",
    category: "Swap",
    categoryColor: "text-violet-400",
  },
  {
    id: 2,
    emoji: "🌉",
    title: "Bridged USDC to Linea",
    protocol: "Linea Bridge",
    chain: "Linea",
    chainEmoji: "🔷",
    timeAgo: "6h ago",
    xpGained: 25,
    txHash: "0xf77e…2c41",
    status: "success",
    category: "Bridge",
    categoryColor: "text-amber-400",
  },
  {
    id: 3,
    emoji: "💧",
    title: "Added Liquidity ETH/USDC",
    protocol: "Uniswap V3",
    chain: "Base",
    chainEmoji: "🔵",
    timeAgo: "1d ago",
    xpGained: 35,
    txHash: "0xc22a…88be",
    status: "success",
    category: "Liquidity",
    categoryColor: "text-cyan-400",
  },
  {
    id: 4,
    emoji: "⚡",
    title: "Staked MON on Monad",
    protocol: "Monad Staking",
    chain: "Monad",
    chainEmoji: "🟣",
    timeAgo: "2d ago",
    xpGained: 20,
    txHash: "0x44d1…f09c",
    status: "success",
    category: "Stake",
    categoryColor: "text-emerald-400",
  },
  {
    id: 5,
    emoji: "🗳️",
    title: "Voted on Governance Proposal",
    protocol: "Linea DAO",
    chain: "Linea",
    chainEmoji: "🔷",
    timeAgo: "3d ago",
    xpGained: 30,
    txHash: "0xbe90…12ef",
    status: "success",
    category: "Vote",
    categoryColor: "text-pink-400",
  },
];
