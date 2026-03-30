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
    {
    id: "arbitrum",
    name: "Arbitrum",
    emoji: "🔵",
    color: "#28a0f0",
    gradFrom: "#28a0f0",
    gradTo: "#1a6fc4",
    type: "mainnet",
    native: "ETH",
    description: "Leading Optimistic Rollup L2",
    explorer: "https://arbiscan.io",
    funding: "$123M",
    reward: "$200-1,500",
    probability: "Medium",
    tvl: "$3.5B",
    tags: ["evm", "l2", "op", "defi"],
    actions: [
      { type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy", providers: [
        { id: "arb-bridge", name: "Arbitrum Bridge", url: "https://bridge.arbitrum.io", description: "Official bridge" },
        { id: "relay-arb", name: "Relay", url: "https://relay.link/bridge/arbitrum", description: "Fast bridge" },
        { id: "stargate-arb", name: "Stargate", url: "https://stargate.finance", description: "LayerZero bridge" },
      ]},
      { type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy", providers: [
        { id: "uniswap-arb", name: "Uniswap", url: "https://app.uniswap.org", description: "Top DEX" },
        { id: "camelot", name: "Camelot", url: "https://app.camelot.exchange", description: "Native Arbitrum DEX" },
        { id: "sushiswap-arb", name: "SushiSwap", url: "https://www.sushi.com/swap", description: "Multi-chain DEX" },
      ]},
      { type: "lend", emoji: "🏦", label: "Lend", xp: 25, difficulty: "Medium", providers: [
        { id: "aave-arb", name: "Aave", url: "https://app.aave.com/?marketName=proto_arbitrum_v3", description: "Lending" },
        { id: "radiant", name: "Radiant", url: "https://app.radiant.capital", description: "Cross-chain lending" },
      ]},
      { type: "stake", emoji: "💰", label: "Stake", xp: 25, difficulty: "Medium", providers: [
        { id: "gmx", name: "GMX", url: "https://app.gmx.io/#/earn", description: "GLP/GM staking" },
        { id: "pendle-arb", name: "Pendle", url: "https://app.pendle.finance", description: "Yield trading" },
      ]},
      { type: "nft", emoji: "🎨", label: "NFT", xp: 15, difficulty: "Easy", providers: [
        { id: "opensea-arb", name: "OpenSea", url: "https://opensea.io", description: "NFT marketplace" },
      ]},
      { type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard", providers: [
        { id: "remix-arb", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
      ]},
    ],
  },
  {
    id: "optimism",
    name: "Optimism",
    emoji: "🔴",
    color: "#ff0420",
    gradFrom: "#ff0420",
    gradTo: "#cc0318",
    type: "mainnet",
    native: "ETH",
    description: "OP Stack L2 with retroactive funding",
    explorer: "https://optimistic.etherscan.io",
    funding: "$175M",
    reward: "$100-800",
    probability: "Medium",
    tvl: "$800M",
    tags: ["evm", "l2", "op", "defi", "governance"],
    actions: [
      { type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy", providers: [
        { id: "op-bridge", name: "OP Bridge", url: "https://app.optimism.io/bridge", description: "Official bridge" },
        { id: "relay-op", name: "Relay", url: "https://relay.link/bridge/optimism", description: "Fast bridge" },
      ]},
      { type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy", providers: [
        { id: "velodrome", name: "Velodrome", url: "https://velodrome.finance/swap", description: "Top OP DEX" },
        { id: "uniswap-op", name: "Uniswap", url: "https://app.uniswap.org", description: "Uniswap on OP" },
      ]},
      { type: "lend", emoji: "🏦", label: "Lend", xp: 25, difficulty: "Medium", providers: [
        { id: "aave-op", name: "Aave", url: "https://app.aave.com/?marketName=proto_optimism_v3", description: "Lending" },
        { id: "sonne", name: "Sonne Finance", url: "https://sonne.finance", description: "OP lending" },
      ]},
      { type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard", providers: [
        { id: "remix-op", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
      ]},
    ],
  },
  {
    id: "zksync",
    name: "zkSync Era",
    emoji: "⚡",
    color: "#8c8dfc",
    gradFrom: "#8c8dfc",
    gradTo: "#6366f1",
    type: "mainnet",
    native: "ETH",
    description: "ZK rollup by Matter Labs",
    explorer: "https://explorer.zksync.io",
    funding: "$458M",
    reward: "$200-1,200",
    probability: "High",
    tvl: "$150M",
    tags: ["evm", "l2", "zk", "defi"],
    actions: [
      { type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy", providers: [
        { id: "zk-bridge", name: "zkSync Bridge", url: "https://portal.zksync.io/bridge", description: "Official bridge" },
        { id: "relay-zk", name: "Relay", url: "https://relay.link/bridge/zksync", description: "Fast bridge" },
        { id: "orbiter-zk", name: "Orbiter", url: "https://orbiter.finance", description: "Cheap bridge" },
      ]},
      { type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy", providers: [
        { id: "syncswap-zk", name: "SyncSwap", url: "https://syncswap.xyz", description: "Top zkSync DEX" },
        { id: "mute", name: "Mute.io", url: "https://app.mute.io/swap", description: "zkSync DEX" },
      ]},
      { type: "lend", emoji: "🏦", label: "Lend", xp: 25, difficulty: "Medium", providers: [
        { id: "zerolend-zk", name: "ZeroLend", url: "https://app.zerolend.xyz", description: "Lending" },
        { id: "eralend", name: "EraLend", url: "https://eralend.com", description: "zkSync lending" },
      ]},
      { type: "nft", emoji: "🎨", label: "NFT", xp: 15, difficulty: "Easy", providers: [
        { id: "element-zk", name: "Element", url: "https://element.market/collections?chain=zksync", description: "NFT market" },
      ]},
      { type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard", providers: [
        { id: "remix-zk", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
      ]},
    ],
  },
  {
    id: "polygon",
    name: "Polygon",
    emoji: "🟣",
    color: "#8247e5",
    gradFrom: "#8247e5",
    gradTo: "#6b3abf",
    type: "mainnet",
    native: "MATIC",
    description: "Leading sidechain & L2 ecosystem",
    explorer: "https://polygonscan.com",
    funding: "$450M",
    reward: "$50-300",
    probability: "Low",
    tvl: "$1B",
    tags: ["evm", "l2", "defi", "gaming"],
    actions: [
      { type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy", providers: [
        { id: "polygon-bridge", name: "Polygon Bridge", url: "https://portal.polygon.technology/bridge", description: "Official" },
        { id: "relay-poly", name: "Relay", url: "https://relay.link/bridge/polygon", description: "Fast bridge" },
      ]},
      { type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy", providers: [
        { id: "quickswap", name: "QuickSwap", url: "https://quickswap.exchange/#/swap", description: "Top Polygon DEX" },
        { id: "uniswap-poly", name: "Uniswap", url: "https://app.uniswap.org", description: "Uniswap on Polygon" },
      ]},
      { type: "lend", emoji: "🏦", label: "Lend", xp: 25, difficulty: "Medium", providers: [
        { id: "aave-poly", name: "Aave", url: "https://app.aave.com/?marketName=proto_polygon_v3", description: "Lending" },
      ]},
      { type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard", providers: [
        { id: "remix-poly", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
      ]},
    ],
  },
  {
    id: "mantle",
    name: "Mantle",
    emoji: "🟤",
    color: "#000000",
    gradFrom: "#65b3ae",
    gradTo: "#3d8b86",
    type: "mainnet",
    native: "MNT",
    description: "Modular L2 with MNT gas token",
    explorer: "https://mantlescan.xyz",
    funding: "$200M",
    reward: "$100-600",
    probability: "High",
    tvl: "$400M",
    tags: ["evm", "l2", "modular", "defi"],
    actions: [
      { type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy", providers: [
        { id: "mantle-bridge", name: "Mantle Bridge", url: "https://bridge.mantle.xyz", description: "Official bridge" },
        { id: "relay-mantle", name: "Relay", url: "https://relay.link/bridge/mantle", description: "Fast bridge" },
      ]},
      { type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy", providers: [
        { id: "agni", name: "Agni Finance", url: "https://agni.finance/swap", description: "Mantle DEX" },
        { id: "merchant-moe", name: "Merchant Moe", url: "https://merchantmoe.com/trade", description: "Trader Joe fork" },
      ]},
      { type: "lend", emoji: "🏦", label: "Lend", xp: 25, difficulty: "Medium", providers: [
        { id: "lendle", name: "Lendle", url: "https://lendle.xyz", description: "Mantle lending" },
      ]},
      { type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard", providers: [
        { id: "remix-mantle", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
      ]},
    ],
  },
  {
    id: "taiko",
    name: "Taiko",
    emoji: "🥁",
    color: "#e81899",
    gradFrom: "#e81899",
    gradTo: "#b81477",
    type: "mainnet",
    native: "ETH",
    description: "Type 1 ZK-EVM (fully Ethereum-equivalent)",
    explorer: "https://taikoscan.io",
    funding: "$37M",
    reward: "$100-500",
    probability: "High",
    tvl: "$200M",
    tags: ["evm", "l2", "zk", "defi"],
    actions: [
      { type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy", providers: [
        { id: "taiko-bridge", name: "Taiko Bridge", url: "https://bridge.taiko.xyz", description: "Official bridge" },
        { id: "relay-taiko", name: "Relay", url: "https://relay.link/bridge/taiko", description: "Fast bridge" },
      ]},
      { type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy", providers: [
        { id: "panko", name: "Panko", url: "https://panko.finance", description: "Taiko DEX" },
        { id: "kim-taiko", name: "Kim Exchange", url: "https://app.kim.exchange/swap", description: "DEX" },
      ]},
      { type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard", providers: [
        { id: "remix-taiko", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
      ]},
    ],
  },
  {
    id: "blast",
    name: "Blast",
    emoji: "💥",
    color: "#fcfc03",
    gradFrom: "#fcfc03",
    gradTo: "#c9c902",
    type: "mainnet",
    native: "ETH",
    description: "L2 with native yield for ETH & stables",
    explorer: "https://blastscan.io",
    funding: "$25M",
    reward: "$100-800",
    probability: "Medium",
    tvl: "$500M",
    tags: ["evm", "l2", "yield", "defi"],
    actions: [
      { type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy", providers: [
        { id: "blast-bridge", name: "Blast Bridge", url: "https://blast.io/bridge", description: "Official bridge" },
        { id: "relay-blast", name: "Relay", url: "https://relay.link/bridge/blast", description: "Fast bridge" },
      ]},
      { type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy", providers: [
        { id: "thruster", name: "Thruster", url: "https://app.thruster.finance/swap", description: "Top Blast DEX" },
        { id: "ring-blast", name: "Ring Protocol", url: "https://ring.exchange", description: "DEX" },
      ]},
      { type: "lend", emoji: "🏦", label: "Lend", xp: 25, difficulty: "Medium", providers: [
        { id: "juice", name: "Juice Finance", url: "https://app.juice.finance", description: "Blast lending" },
      ]},
      { type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard", providers: [
        { id: "remix-blast", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
      ]},
    ],
  },
  {
    id: "manta",
    name: "Manta Pacific",
    emoji: "🌊",
    color: "#219ebc",
    gradFrom: "#219ebc",
    gradTo: "#1a7d96",
    type: "mainnet",
    native: "ETH",
    description: "Modular L2 for ZK applications",
    explorer: "https://pacific-explorer.manta.network",
    funding: "$60M",
    reward: "$50-400",
    probability: "Medium",
    tvl: "$100M",
    tags: ["evm", "l2", "zk", "modular"],
    actions: [
      { type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy", providers: [
        { id: "manta-bridge", name: "Manta Bridge", url: "https://pacific-bridge.manta.network", description: "Official bridge" },
        { id: "relay-manta", name: "Relay", url: "https://relay.link/bridge/manta", description: "Fast bridge" },
      ]},
      { type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy", providers: [
        { id: "aperture", name: "Aperture Swap", url: "https://app.aperture.finance/swap", description: "Manta DEX" },
      ]},
      { type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard", providers: [
        { id: "remix-manta", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
      ]},
    ],
  },
  {
    id: "sei",
    name: "Sei",
    emoji: "🌀",
    color: "#9b1c2e",
    gradFrom: "#9b1c2e",
    gradTo: "#7a1624",
    type: "mainnet",
    native: "SEI",
    description: "Parallelized EVM for trading",
    explorer: "https://seitrace.com",
    funding: "$55M",
    reward: "$50-400",
    probability: "Medium",
    tvl: "$200M",
    tags: ["evm", "l1", "trading", "defi"],
    actions: [
      { type: "bridge", emoji: "🌉", label: "Bridge", xp: 20, difficulty: "Easy", providers: [
        { id: "sei-bridge", name: "Sei Bridge", url: "https://app.sei.io/bridge", description: "Official bridge" },
        { id: "relay-sei", name: "Relay", url: "https://relay.link/bridge/sei", description: "Fast bridge" },
      ]},
      { type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy", providers: [
        { id: "dragonswap", name: "DragonSwap", url: "https://dragonswap.app/swap", description: "Sei DEX" },
        { id: "jellyswap", name: "Jellyverse", url: "https://app.jellyverse.org", description: "DEX" },
      ]},
      { type: "stake", emoji: "💰", label: "Stake", xp: 25, difficulty: "Medium", providers: [
        { id: "sei-stake", name: "Sei Staking", url: "https://app.sei.io/stake", description: "Native staking" },
      ]},
      { type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard", providers: [
        { id: "remix-sei", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
      ]},
    ],
  },
  {
    id: "berachain",
    name: "Berachain",
    emoji: "🐻",
    color: "#e5a63b",
    gradFrom: "#e5a63b",
    gradTo: "#c48a2f",
    type: "testnet",
    native: "BERA",
    description: "Proof of Liquidity consensus chain",
    explorer: "https://bartio.beratrail.io",
    funding: "$142M",
    reward: "$500-3,000",
    probability: "Confirmed",
    tags: ["evm", "l1", "testnet", "confirmed", "hot"],
    actions: [
      { type: "faucet", emoji: "🚰", label: "Faucet", xp: 10, difficulty: "Easy", providers: [
        { id: "bera-faucet", name: "Bera Faucet", url: "https://bartio.faucet.berachain.com", description: "Get testnet BERA" },
      ]},
      { type: "swap", emoji: "🔄", label: "Swap", xp: 15, difficulty: "Easy", providers: [
        { id: "bex", name: "BEX", url: "https://bartio.bex.berachain.com/swap", description: "Native Bera DEX" },
        { id: "kodiak", name: "Kodiak", url: "https://app.kodiak.finance/swap", description: "Bera DEX" },
      ]},
      { type: "lend", emoji: "🏦", label: "Lend", xp: 25, difficulty: "Medium", providers: [
        { id: "bend", name: "Bend", url: "https://bartio.bend.berachain.com", description: "Bera lending" },
      ]},
      { type: "stake", emoji: "💰", label: "Stake", xp: 25, difficulty: "Medium", providers: [
        { id: "bgt-station", name: "BGT Station", url: "https://bartio.station.berachain.com", description: "Proof of Liquidity" },
      ]},
      { type: "deploy", emoji: "📝", label: "Deploy", xp: 40, difficulty: "Hard", providers: [
        { id: "remix-bera", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy contract" },
      ]},
    ],
  },
];