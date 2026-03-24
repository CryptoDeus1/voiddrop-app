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
  content: ArticleSection[];
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
    subtitle: "A deep dive into Pacifica's dual restaking architecture, yield sources, and how to maximize your airdrop allocation.",
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
    content: [
      { title: "What is Pacifica?", text: "Pacifica is a next-generation perpetual DEX built on Solana. It offers decentralized derivatives trading with deep liquidity, low fees, and a unique builder program that rewards ecosystem participants." },
      { title: "The Builder Program", text: "Pacifica's builder code system lets projects and communities earn fee rebates. By using a builder code like AIRDROPHUB, traders get reduced fees while the builder earns a share of protocol revenue." },
      { type: "tip", title: "Pro Tip", text: "Always use a builder code when trading on Pacifica. It costs you nothing but gives you fee discounts and may count toward future airdrop eligibility." },
      { title: "Trading on Pacifica", text: "Pacifica supports perpetual futures with up to 20x leverage on major assets like BTC, ETH, SOL, SUI, and DOGE. Funding rates are calculated every 8 hours and directly impact your position costs." },
      { title: "Funding Rates Explained", text: "When funding is positive, longs pay shorts. When negative, shorts pay longs. Monitoring funding rates helps you understand market sentiment and optimize entry timing." },
      { type: "warning", title: "Risk Warning", text: "Leverage trading carries significant risk. Never trade with more than you can afford to lose. Start with low leverage (2-5x) until you understand the mechanics." },
      { title: "Airdrop Strategy", text: "To maximize your Pacifica airdrop allocation: 1) Trade consistently over time, 2) Use a builder code, 3) Maintain positions across multiple assets, 4) Keep your win rate healthy. The protocol rewards organic trading activity." },
      { type: "tip", text: "VoidDrop tracks your Pacifica stats automatically. Connect your wallet via the bot and check the Terminal tab for real-time P&L and edge calculations." },
    ],
  },
  {
    id: "revoke-permissions",
    emoji: "🔐",
    title: "Revoking Permissions: Why and How",
    subtitle: "Most airdrop farmers have dozens of open approvals. Learn how to audit and revoke risky smart contract permissions safely.",
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
    content: [
      { title: "Why Revoke?", text: "Every time you approve a token spend on a DEX or protocol, you grant that smart contract unlimited access to your tokens. If the contract gets exploited, attackers can drain your wallet." },
      { type: "warning", title: "Real Example", text: "In 2023, multiple DeFi protocols were exploited through unlimited approvals. Users who hadn't revoked lost millions collectively. One wallet lost $2.1M because of a single forgotten approval." },
      { title: "How to Check Approvals", text: "Use tools like Revoke.cash, Etherscan Token Approval Checker, or DeBank to see all your active approvals. You'll be surprised how many you have." },
      { title: "Step-by-Step Revocation", text: "1) Go to revoke.cash and connect your wallet. 2) Sort by 'Value at Risk' — highest first. 3) Revoke approvals for contracts you no longer use. 4) For active protocols, consider setting specific limits instead of unlimited." },
      { type: "tip", title: "Gas Saving Tip", text: "Batch your revocations during low gas periods (weekends, early UTC mornings). Each revocation costs a small gas fee, so doing 20+ at once during off-peak saves money." },
      { title: "Best Practices", text: "Revoke unused approvals monthly. Never approve unlimited amounts for unknown protocols. Use a separate farming wallet with limited funds. Bookmark revoke.cash — make it a habit." },
    ],
  },
  {
    id: "defillama-guide",
    emoji: "🦙",
    title: "How to Use DeFiLlama for Finding Safe DEXes",
    subtitle: "Navigate DeFiLlama like a pro. Filter by audits, TVL trends, and chain exposure to farm only battle-tested protocols.",
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
    content: [
      { title: "What is DeFiLlama?", text: "DeFiLlama is the #1 DeFi analytics dashboard. It tracks TVL (Total Value Locked), yields, bridges, and protocol data across all chains. It's completely free, open-source, and has no ads." },
      { title: "Finding Safe Protocols", text: "TVL is a key safety indicator. Higher TVL generally means more trust. Look for: consistent TVL growth (not sudden spikes), TVL > $10M for mainnet protocols, and multiple audit reports listed." },
      { title: "Using the Yields Page", text: "DeFiLlama's Yields page shows real-time APY across all protocols. Sort by TVL to find high-yield opportunities on established protocols. Avoid yields that seem too good to be true." },
      { type: "tip", title: "Research Workflow", text: "Before farming any protocol: 1) Check DeFiLlama TVL history. 2) Look at the audit section. 3) Check token holders on chain explorer. 4) Read the docs. 5) Start with small amounts." },
      { title: "Bridge Comparison", text: "DeFiLlama has a bridge comparison tool. When you need to bridge tokens between chains, compare fees, speed, and security across all available bridges in one place." },
      { type: "warning", text: "Never trust a protocol solely based on TVL. Some projects inflate TVL through incentives that dry up. Always check if the TVL is organic vs incentivized." },
    ],
  },
  {
    id: "wallet-segmentation",
    emoji: "🗂️",
    title: "Wallet Segmentation: The Multi-Wallet Strategy",
    subtitle: "Why top farmers use 3-5+ wallets, how to organize them by risk profile, and the exact setup that avoids cross-contamination.",
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
    content: [
      { title: "Why Multiple Wallets?", text: "Using a single wallet for everything is dangerous. If one protocol gets exploited, everything is at risk. Segmentation also helps with anti-sybil — each wallet builds its own organic history independently." },
      { title: "The 3-Wallet Minimum", text: "Wallet 1: Main — your identity wallet with main assets and ENS. Wallet 2: Farming — active airdrop farming with deposits, swaps, bridges. Wallet 3: Degen — high-risk experiments and new protocols." },
      { type: "warning", title: "Critical Rule", text: "NEVER transfer directly between your farming wallets. This creates on-chain links that sybil detectors flag instantly. Always go through a CEX or use different funding sources." },
      { title: "Advanced Setup (5 Wallets)", text: "Add Wallet 4: Long-term DeFi for staking and LP positions. Wallet 5: NFT/Social for Lens, Farcaster, NFT mints. Each wallet should have unique activity patterns." },
      { type: "tip", title: "Funding Strategy", text: "Fund each wallet from different CEX accounts or at different times (days apart). Use different amounts — $487 to one, $1,230 to another. Round numbers look automated." },
      { type: "code", title: "Example Naming Convention", text: "Main:    0x1a2b...  → Identity, ENS\nFarm-A:  0x3c4d...  → Monad, Scroll\nFarm-B:  0x5e6f...  → Linea, ZkSync\nDegen:   0x7g8h...  → New protocols\nLP:      0x9i0j...  → Long-term staking" },
    ],
  },
  {
    id: "monad-bridge-guide",
    emoji: "🟣",
    title: "The Complete Monad Testnet Bridge Guide",
    subtitle: "Step-by-step: fund your Monad wallet, use the official bridge, and complete the highest-value testnet interactions.",
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
    content: [
      { title: "Why Monad?", text: "Monad is a high-performance EVM-compatible L1 blockchain with parallel execution. It raised $225M and has a confirmed token. The testnet is live and early participants are likely to receive an airdrop." },
      { title: "Step 1: Get Testnet Tokens", text: "Visit the Monad faucet (linked in their Discord). Connect your wallet and request testnet MON tokens. The faucet refreshes daily." },
      { title: "Step 2: Bridge Assets", text: "Use the official Monad bridge to move testnet ETH from Sepolia to Monad testnet. Connect wallet, select amount, confirm." },
      { type: "tip", title: "Pro Tip", text: "Don't bridge the same amount every time. Vary between 0.01-0.05 ETH and bridge at different times of day. This builds a more organic-looking transaction history." },
      { title: "Step 3: Interact with DApps", text: "After bridging, interact with testnet dApps: swap on DEXes, provide liquidity, mint test NFTs. Each unique contract interaction counts toward your airdrop eligibility." },
      { type: "warning", text: "The Monad testnet may reset. Don't panic — your interaction history is recorded. Keep a log of what you've done." },
    ],
  },
  {
    id: "gas-optimization",
    emoji: "⛽",
    title: "Gas Optimization: Farm During Off-Peak Hours",
    subtitle: "Data-backed breakdown of the cheapest gas windows on Ethereum, Linea, and Base — save 40-70% on transaction fees.",
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
    content: [
      { title: "Why Gas Timing Matters", text: "On Ethereum mainnet, gas prices fluctuate 3-10x throughout the day. A swap that costs $15 at peak can cost $3-5 during off-peak. For airdrop farmers doing hundreds of transactions, this adds up fast." },
      { title: "Cheapest Gas Windows", text: "Based on historical data: Ethereum is cheapest Saturday/Sunday between 00:00-06:00 UTC. Weekday mornings 02:00-08:00 UTC are also low. Avoid 14:00-20:00 UTC when US and EU markets overlap." },
      { type: "code", title: "Typical Gas by Time (Ethereum)", text: "00:00-06:00 UTC  →  8-15 gwei  (cheapest)\n06:00-12:00 UTC  →  15-25 gwei\n12:00-18:00 UTC  →  25-60 gwei (expensive)\n18:00-00:00 UTC  →  20-40 gwei" },
      { title: "L2 Gas Optimization", text: "On L2s like Linea, Base, and Arbitrum, gas is much cheaper but still varies. L2 costs are driven by L1 calldata prices. The same off-peak windows apply." },
      { type: "tip", title: "Batch Strategy", text: "Plan your farming sessions during cheap windows. Queue up all your swaps, bridges, and interactions. Do them in one session during off-peak hours." },
    ],
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

// Добавь этот тип после существующих типов:
export interface ArticleSection {
  title?: string;
  text: string;
  type?: "text" | "tip" | "warning" | "code";
}