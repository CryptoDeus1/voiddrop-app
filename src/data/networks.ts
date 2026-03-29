// src/data/networks.ts

export interface ActionProvider {
  id: string;
  name: string;
  url: string;
  description?: string;
}

export interface ActionCategory {
  type: string;
  emoji: string;
  label: string;
  xp: number;
  difficulty: "Easy" | "Medium" | "Hard";
  providers: ActionProvider[];
}

// Добавь в интерфейс NetworkDef:
export interface NetworkDef {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradFrom: string;
  gradTo: string;
  type: "mainnet" | "testnet";
  native: string;
  description: string;
  explorer: string;
  // НОВЫЕ ПОЛЯ:
  funding?: string;        // сколько привлекли
  reward?: string;          // ожидаемый дроп
  probability?: string;     // шанс дропа
  tvl?: string;             // TVL если есть
  tags: string[];           // теги для поиска
  rpcUrl?: string;          // можно переопределить RPC
  actions: ActionCategory[];
}

export const NETWORKS: NetworkDef[] = [
  {
    id: "sonic",
    name: "Sonic",
    emoji: "🔵",
    color: "#0ea5e9",
    gradFrom: "#0ea5e9",
    gradTo: "#0284c7",
    type: "mainnet",
    native: "S",
    description: "High-speed EVM chain (ex-Fantom)",
    explorer: "https://sonicscan.org",
    funding: "$200M+",
    reward: "$500-3,000",
    probability: "Confirmed",
    tvl: "$1.2B",
    tags: ["evm", "l1", "defi", "confirmed"],
    actions: [
      {
        type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy",
        providers: [
          { id: "relay", name: "Relay", url: "https://relay.link/bridge/sonic", description: "Fast & cheap" },
          { id: "debridge", name: "deBridge", url: "https://app.debridge.finance", description: "Cross-chain" },
          { id: "sonic-gateway", name: "Sonic Gateway", url: "https://gateway.soniclabs.com", description: "Official bridge" },
        ],
      },
      {
        type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy",
        providers: [
          { id: "shadow", name: "Shadow Exchange", url: "https://app.shadow.so/swap", description: "Top Sonic DEX" },
          { id: "spacefi", name: "SpaceFi", url: "https://app.spacefi.io/#/swap", description: "Multi-chain DEX" },
          { id: "beethoven", name: "Beets", url: "https://beets.fi", description: "Balancer fork" },
        ],
      },
      {
        type: "stake", emoji: "💰", label: "Stake", xp: 25, difficulty: "Medium",
        providers: [
          { id: "beets-stake", name: "Beets Staking", url: "https://beets.fi/stake", description: "Liquid staking" },
          { id: "sonic-stake", name: "Sonic Staking", url: "https://my.soniclabs.com/stake", description: "Native staking" },
        ],
      },
      {
        type: "lend", emoji: "🏦", label: "Lend", xp: 25, difficulty: "Medium",
        providers: [
          { id: "aave-sonic", name: "Aave", url: "https://app.aave.com/?marketName=proto_sonic_v3", description: "Lending protocol" },
          { id: "silo", name: "Silo Finance", url: "https://app.silo.finance", description: "Isolated lending" },
        ],
      },
      {
        type: "nft", emoji: "🎨", label: "NFT", xp: 15, difficulty: "Easy",
        providers: [
          { id: "paintswap", name: "PaintSwap", url: "https://paintswap.io", description: "NFT marketplace" },
        ],
      },
      {
        type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard",
        providers: [
          { id: "remix", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy smart contract" },
        ],
      },
    ],
  },
  {
    id: "monad",
    name: "Monad",
    emoji: "🟣",
    color: "#7c3aed",
    gradFrom: "#7c3aed",
    gradTo: "#4f46e5",
    type: "testnet",
    native: "MON",
    description: "Parallel execution EVM L1",
    explorer: "https://testnet.monadexplorer.com",
    funding: "$225M",
    reward: "$800-4,000",
    probability: "Confirmed",
    tags: ["evm", "l1", "testnet", "confirmed", "hot"],
    actions: [
      {
        type: "faucet", emoji: "🚰", label: "Faucet", xp: 10, difficulty: "Easy",
        providers: [
          { id: "monad-faucet", name: "Monad Faucet", url: "https://faucet.monad.xyz", description: "Get testnet MON" },
          { id: "monad-discord", name: "Discord Faucet", url: "https://discord.gg/monad", description: "Via Discord bot" },
        ],
      },
      {
        type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy",
        providers: [
          { id: "monad-bridge", name: "Monad Bridge", url: "https://bridge.monad.xyz", description: "Official testnet bridge" },
          { id: "orbiter-monad", name: "Orbiter", url: "https://orbiter.finance", description: "Cross-chain bridge" },
        ],
      },
      {
        type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy",
        providers: [
          { id: "kuru", name: "Kuru", url: "https://kuru.io", description: "Monad DEX" },
          { id: "ambient-monad", name: "Ambient", url: "https://ambient.finance", description: "DEX" },
        ],
      },
      {
        type: "nft", emoji: "🎨", label: "NFT", xp: 15, difficulty: "Easy",
        providers: [
          { id: "monad-nft", name: "Monad NFTs", url: "https://magiceden.io/monad", description: "Mint & trade" },
        ],
      },
      {
        type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard",
        providers: [
          { id: "remix-monad", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy to Monad testnet" },
        ],
      },
    ],
  },
  {
    id: "scroll",
    name: "Scroll",
    emoji: "📜",
    color: "#e5c07b",
    gradFrom: "#e5c07b",
    gradTo: "#d4a843",
    type: "mainnet",
    native: "ETH",
    description: "zkEVM L2 by Scroll team",
    explorer: "https://scrollscan.com",
    funding: "$83M",
    reward: "$150-700",
    probability: "High",
    tvl: "$800M",
    tags: ["evm", "l2", "zk", "defi"],
    actions: [
      {
        type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy",
        providers: [
          { id: "scroll-bridge", name: "Scroll Bridge", url: "https://scroll.io/bridge", description: "Official bridge" },
          { id: "relay-scroll", name: "Relay", url: "https://relay.link/bridge/scroll", description: "Fast bridge" },
          { id: "orbiter-scroll", name: "Orbiter", url: "https://orbiter.finance", description: "Cheap bridge" },
        ],
      },
      {
        type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy",
        providers: [
          { id: "ambient-scroll", name: "Ambient", url: "https://ambient.finance", description: "Native Scroll DEX" },
          { id: "syncswap-scroll", name: "SyncSwap", url: "https://syncswap.xyz", description: "Popular DEX" },
        ],
      },
      {
        type: "lend", emoji: "🏦", label: "Lend", xp: 25, difficulty: "Medium",
        providers: [
          { id: "aave-scroll", name: "Aave", url: "https://app.aave.com/?marketName=proto_scroll_v3", description: "Lending" },
          { id: "layerbank-scroll", name: "LayerBank", url: "https://layerbank.finance", description: "Scroll lending" },
        ],
      },
      {
        type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard",
        providers: [
          { id: "remix-scroll", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
        ],
      },
    ],
  },
  {
    id: "linea",
    name: "Linea",
    emoji: "🔷",
    color: "#61dfff",
    gradFrom: "#61dfff",
    gradTo: "#3b9ec7",
    type: "mainnet",
    native: "ETH",
    description: "ConsenSys zkEVM rollup",
    explorer: "https://lineascan.build",
    funding: "$725M",
    reward: "$300-1,800",
    probability: "High",
    tvl: "$1.5B",
    tags: ["evm", "l2", "zk", "defi"],
    actions: [
      {
        type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy",
        providers: [
          { id: "linea-bridge", name: "Linea Bridge", url: "https://bridge.linea.build", description: "Official bridge" },
          { id: "relay-linea", name: "Relay", url: "https://relay.link/bridge/linea", description: "Fast bridge" },
        ],
      },
      {
        type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy",
        providers: [
          { id: "syncswap-linea", name: "SyncSwap", url: "https://syncswap.xyz", description: "Top Linea DEX" },
          { id: "izumi-linea", name: "iZUMi", url: "https://izumi.finance/trade/swap", description: "DEX" },
        ],
      },
      {
        type: "lend", emoji: "🏦", label: "Lend", xp: 25, difficulty: "Medium",
        providers: [
          { id: "zerolend", name: "ZeroLend", url: "https://app.zerolend.xyz", description: "Linea lending" },
        ],
      },
      {
        type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard",
        providers: [
          { id: "remix-linea", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
        ],
      },
    ],
  },
  {
    id: "base",
    name: "Base",
    emoji: "🔵",
    color: "#0052ff",
    gradFrom: "#0052ff",
    gradTo: "#003cc7",
    type: "mainnet",
    native: "ETH",
    description: "Coinbase L2 (OP Stack)",
    explorer: "https://basescan.org",
    funding: "Coinbase",
    reward: "$100-500",
    probability: "Medium",
    tvl: "$8B",
    tags: ["evm", "l2", "op", "defi"],
    actions: [
      {
        type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy",
        providers: [
          { id: "base-bridge", name: "Base Bridge", url: "https://bridge.base.org", description: "Official bridge" },
          { id: "relay-base", name: "Relay", url: "https://relay.link/bridge/base", description: "Fast bridge" },
        ],
      },
      {
        type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy",
        providers: [
          { id: "aerodrome", name: "Aerodrome", url: "https://aerodrome.finance/swap", description: "Top Base DEX" },
          { id: "uniswap-base", name: "Uniswap", url: "https://app.uniswap.org", description: "Uniswap on Base" },
        ],
      },
      {
        type: "nft", emoji: "🎨", label: "NFT", xp: 15, difficulty: "Easy",
        providers: [
          { id: "mint-fun", name: "mint.fun", url: "https://mint.fun", description: "Easy minting" },
          { id: "zora-base", name: "Zora", url: "https://zora.co", description: "Create & collect" },
        ],
      },
      {
        type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard",
        providers: [
          { id: "remix-base", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
        ],
      },
    ],
  },
];