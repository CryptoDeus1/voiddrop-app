/* ─────────────────────────────────────────────────────────────────────────
   Mock Learn / Academy Data — Crypto Farm Assistant
   ───────────────────────────────────────────────────────────────────────── */

export type ArticleDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Pro";
export type ArticleTag =
  | "Anti-Sybil"
  | "Security"
  | "Bridging"
  | "DeFi"
  | "Basics"
  | "Wallets"
  | "Research"
  | "Restaking"
  | "Tools"
  | "Advanced";

export interface FeaturedArticle {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  tag: ArticleTag;
  difficulty: ArticleDifficulty;
  readTime: string;
  glowFrom: string;
  glowTo: string;
  gradFrom: string;
  gradTo: string;
  isNew: boolean;
  views: string;
}

export interface Category {
  id: string;
  emoji: string;
  label: string;
  count: number;
  gradFrom: string;
  gradTo: string;
  borderColor: string;
  glowColor: string;
  textColor: string;
  bgColor: string;
}

export interface Article {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  categoryBorder: string;
  difficulty: ArticleDifficulty;
  difficultyColor: string;
  readTime: string;
  xpReward: number;
  isBookmarked: boolean;
  isNew: boolean;
  views: string;
  gradFrom: string;
  gradTo: string;
  tags: ArticleTag[];
}

export interface QuickTip {
  id: string;
  emoji: string;
  tip: string;
  category: string;
  color: string;
  bg: string;
  border: string;
}

export interface VideoLesson {
  id: string;
  emoji: string;
  title: string;
  duration: string;
  level: ArticleDifficulty;
  views: string;
  gradFrom: string;
  gradTo: string;
  isLocked: boolean;
}

/* ── Featured / Must-Read Banner ────────────────────────────────────── */
export const FEATURED_ARTICLE: FeaturedArticle = {
  id: "beginner-sybil-guide-2025",
  emoji: "🛡️",
  title: "Beginner's Guide: How to Avoid Sybil Detection in 2025",
  subtitle:
    "Learn the exact on-chain patterns that get wallets flagged — and how to build an authentic farming profile that passes every filter.",
  tag: "Anti-Sybil",
  difficulty: "Beginner",
  readTime: "8 min read",
  glowFrom: "rgba(139,92,246,0.25)",
  glowTo: "rgba(99,102,241,0.15)",
  gradFrom: "#7c3aed",
  gradTo: "#6366f1",
  isNew: true,
  views: "12.4k",
};

/* ── Category Pills / Cards ─────────────────────────────────────────── */
export const CATEGORIES: Category[] = [
  {
    id: "basics",
    emoji: "📖",
    label: "Basics",
    count: 14,
    gradFrom: "#6366f1",
    gradTo: "#4f46e5",
    borderColor: "border-indigo-500/25",
    glowColor: "rgba(99,102,241,0.2)",
    textColor: "text-indigo-300",
    bgColor: "bg-indigo-500/[0.08]",
  },
  {
    id: "security",
    emoji: "🔒",
    label: "Security",
    count: 9,
    gradFrom: "#ef4444",
    gradTo: "#dc2626",
    borderColor: "border-red-500/25",
    glowColor: "rgba(239,68,68,0.2)",
    textColor: "text-red-300",
    bgColor: "bg-red-500/[0.08]",
  },
  {
    id: "bridging",
    emoji: "🌉",
    label: "Bridging",
    count: 11,
    gradFrom: "#f59e0b",
    gradTo: "#d97706",
    borderColor: "border-amber-500/25",
    glowColor: "rgba(245,158,11,0.2)",
    textColor: "text-amber-300",
    bgColor: "bg-amber-500/[0.08]",
  },
  {
    id: "advanced-defi",
    emoji: "⚡",
    label: "Advanced DeFi",
    count: 18,
    gradFrom: "#10b981",
    gradTo: "#059669",
    borderColor: "border-emerald-500/25",
    glowColor: "rgba(16,185,129,0.2)",
    textColor: "text-emerald-300",
    bgColor: "bg-emerald-500/[0.08]",
  },
  {
    id: "wallets",
    emoji: "👛",
    label: "Wallets",
    count: 7,
    gradFrom: "#0ea5e9",
    gradTo: "#0284c7",
    borderColor: "border-sky-500/25",
    glowColor: "rgba(14,165,233,0.2)",
    textColor: "text-sky-300",
    bgColor: "bg-sky-500/[0.08]",
  },
  {
    id: "research",
    emoji: "🔭",
    label: "Research",
    count: 6,
    gradFrom: "#ec4899",
    gradTo: "#db2777",
    borderColor: "border-pink-500/25",
    glowColor: "rgba(236,72,153,0.2)",
    textColor: "text-pink-300",
    bgColor: "bg-pink-500/[0.08]",
  },
];

/* ── Articles List ───────────────────────────────────────────────────── */
export const ARTICLES: Article[] = [
  {
    id: "pacifica-restaking",
    emoji: "🌊",
    title: "Understanding Pacifica Network & Restaking",
    subtitle:
      "A deep dive into Pacifica's dual restaking architecture, yield sources, and how to maximize your airdrop allocation.",
    category: "DeFi",
    categoryColor: "text-sky-400",
    categoryBg: "bg-sky-500/[0.08]",
    categoryBorder: "border-sky-500/20",
    difficulty: "Intermediate",
    difficultyColor: "text-amber-400",
    readTime: "11 min",
    xpReward: 40,
    isBookmarked: false,
    isNew: true,
    views: "3.2k",
    gradFrom: "#0ea5e9",
    gradTo: "#0284c7",
    tags: ["DeFi", "Restaking"],
  },
  {
    id: "revoke-permissions",
    emoji: "🔐",
    title: "Revoking Permissions: Why and How",
    subtitle:
      "Most airdrop farmers have dozens of open approvals. Learn how to audit and revoke risky smart contract permissions safely.",
    category: "Security",
    categoryColor: "text-red-400",
    categoryBg: "bg-red-500/[0.08]",
    categoryBorder: "border-red-500/20",
    difficulty: "Beginner",
    difficultyColor: "text-emerald-400",
    readTime: "6 min",
    xpReward: 20,
    isBookmarked: true,
    isNew: false,
    views: "8.9k",
    gradFrom: "#ef4444",
    gradTo: "#dc2626",
    tags: ["Security", "Wallets"],
  },
  {
    id: "defillama-guide",
    emoji: "🦙",
    title: "How to Use DeFiLlama for Finding Safe DEXes",
    subtitle:
      "Navigate DeFiLlama like a pro. Filter by audits, TVL trends, and chain exposure to farm only battle-tested protocols.",
    category: "Tools",
    categoryColor: "text-violet-400",
    categoryBg: "bg-violet-500/[0.08]",
    categoryBorder: "border-violet-500/20",
    difficulty: "Beginner",
    difficultyColor: "text-emerald-400",
    readTime: "9 min",
    xpReward: 25,
    isBookmarked: false,
    isNew: false,
    views: "5.7k",
    gradFrom: "#7c3aed",
    gradTo: "#6366f1",
    tags: ["Research", "DeFi", "Tools"],
  },
  {
    id: "wallet-segmentation",
    emoji: "🗂️",
    title: "Wallet Segmentation: The Multi-Wallet Strategy",
    subtitle:
      "Why top farmers use 3-5+ wallets, how to organize them by risk profile, and the exact setup that avoids cross-contamination.",
    category: "Advanced",
    categoryColor: "text-pink-400",
    categoryBg: "bg-pink-500/[0.08]",
    categoryBorder: "border-pink-500/20",
    difficulty: "Advanced",
    difficultyColor: "text-red-400",
    readTime: "14 min",
    xpReward: 60,
    isBookmarked: false,
    isNew: false,
    views: "11.1k",
    gradFrom: "#ec4899",
    gradTo: "#db2777",
    tags: ["Anti-Sybil", "Wallets", "Advanced"],
  },
  {
    id: "monad-bridge-guide",
    emoji: "🟣",
    title: "The Complete Monad Testnet Bridge Guide",
    subtitle:
      "Step-by-step: fund your Monad wallet, use the official bridge, and complete the highest-value testnet interactions.",
    category: "Bridging",
    categoryColor: "text-amber-400",
    categoryBg: "bg-amber-500/[0.08]",
    categoryBorder: "border-amber-500/20",
    difficulty: "Beginner",
    difficultyColor: "text-emerald-400",
    readTime: "7 min",
    xpReward: 30,
    isBookmarked: true,
    isNew: true,
    views: "6.4k",
    gradFrom: "#7c3aed",
    gradTo: "#4f46e5",
    tags: ["Bridging", "Basics"],
  },
  {
    id: "gas-optimization",
    emoji: "⛽",
    title: "Gas Optimization: Farm During Off-Peak Hours",
    subtitle:
      "Data-backed breakdown of the cheapest gas windows on Ethereum, Linea, and Base — save 40-70% on transaction fees.",
    category: "Advanced DeFi",
    categoryColor: "text-emerald-400",
    categoryBg: "bg-emerald-500/[0.08]",
    categoryBorder: "border-emerald-500/20",
    difficulty: "Intermediate",
    difficultyColor: "text-amber-400",
    readTime: "5 min",
    xpReward: 35,
    isBookmarked: false,
    isNew: false,
    views: "4.1k",
    gradFrom: "#10b981",
    gradTo: "#059669",
    tags: ["Advanced", "DeFi"],
  },
];

/* ── Quick Tips (rotating bite-sized tips) ───────────────────────────── */
export const QUICK_TIPS: QuickTip[] = [
  {
    id: "tip-1",
    emoji: "🎲",
    tip: "Never use round numbers. $50.00 screams bot. $47.83 looks human.",
    category: "Anti-Sybil",
    color: "text-violet-300",
    bg: "bg-violet-500/[0.07]",
    border: "border-violet-500/20",
  },
  {
    id: "tip-2",
    emoji: "⏰",
    tip: "Space your transactions 2–6 hours apart. Bots act every 30 seconds.",
    category: "Timing",
    color: "text-sky-300",
    bg: "bg-sky-500/[0.07]",
    border: "border-sky-500/20",
  },
  {
    id: "tip-3",
    emoji: "🔗",
    tip: "Never bridge from the same wallet you used for CEX withdrawal. Fund wallets separately.",
    category: "Security",
    color: "text-red-300",
    bg: "bg-red-500/[0.07]",
    border: "border-red-500/20",
  },
  {
    id: "tip-4",
    emoji: "📅",
    tip: "Consistency beats volume. 5 txs/day for 30 days beats 150 txs in one day.",
    category: "Strategy",
    color: "text-emerald-300",
    bg: "bg-emerald-500/[0.07]",
    border: "border-emerald-500/20",
  },
];

/* ── Video Lessons ───────────────────────────────────────────────────── */
export const VIDEO_LESSONS: VideoLesson[] = [
  {
    id: "v1",
    emoji: "🎬",
    title: "Airdrop Farming 101: From Zero to First Claim",
    duration: "18:42",
    level: "Beginner",
    views: "24k",
    gradFrom: "#6366f1",
    gradTo: "#4f46e5",
    isLocked: false,
  },
  {
    id: "v2",
    emoji: "🛡️",
    title: "The Anti-Sybil Masterclass (Full Course)",
    duration: "41:15",
    level: "Intermediate",
    views: "9.8k",
    gradFrom: "#7c3aed",
    gradTo: "#6366f1",
    isLocked: false,
  },
  {
    id: "v3",
    emoji: "⚡",
    title: "Advanced DeFi: Leverage Loops & Yield Stacking",
    duration: "32:07",
    level: "Pro",
    views: "4.2k",
    gradFrom: "#10b981",
    gradTo: "#059669",
    isLocked: true,
  },
];

/* ── Learning Path / Progress ────────────────────────────────────────── */
export const LEARNING_PATH = {
  currentModule: "Anti-Sybil Fundamentals",
  currentPath: "Anti-Sybil Fundamentals",
  modulesCompleted: 3,
  totalModules: 8,
  xpEarned: 185,
  totalXP: 185,
  nextLesson: "Understanding Clustering Algorithms",
  streak: 4,
  streakDays: 4,
};