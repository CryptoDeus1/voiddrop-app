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
    actions: [
      {
        type: "bridge",
        emoji: "🌉",
        label: "Bridge",
        xp: 20,
        difficulty: "Easy",
        providers: [
          { id: "relay", name: "Relay", url: "https://relay.link/bridge/sonic", description: "Fast & cheap" },
          { id: "debridge", name: "deBridge", url: "https://app.debridge.finance", description: "Cross-chain" },
          { id: "sonic-gateway", name: "Sonic Gateway", url: "https://gateway.soniclabs.com", description: "Official bridge" },
        ],
      },
      {
        type: "swap",
        emoji: "🔄",
        label: "Swap",
        xp: 15,
        difficulty: "Easy",
        providers: [
          { id: "shadow", name: "Shadow Exchange", url: "https://app.shadow.so/swap", description: "Top Sonic DEX" },
          { id: "spacefi", name: "SpaceFi", url: "https://app.spacefi.io/#/swap", description: "Multi-chain DEX" },
          { id: "beethoven", name: "Beets", url: "https://beets.fi", description: "Balancer fork" },
        ],
      },
      {
        type: "stake",
        emoji: "💰",
        label: "Stake",
        xp: 25,
        difficulty: "Medium",
        providers: [
          { id: "beets-stake", name: "Beets Staking", url: "https://beets.fi/stake", description: "Liquid staking" },
          { id: "sonic-stake", name: "Sonic Staking", url: "https://my.soniclabs.com/stake", description: "Native staking" },
        ],
      },
      {
        type: "lend",
        emoji: "🏦",
        label: "Lend",
        xp: 25,
        difficulty: "Medium",
        providers: [
          { id: "aave-sonic", name: "Aave", url: "https://app.aave.com/?marketName=proto_sonic_v3", description: "Lending protocol" },
          { id: "silo", name: "Silo Finance", url: "https://app.silo.finance", description: "Isolated lending" },
        ],
      },
      {
        type: "nft",
        emoji: "🎨",
        label: "NFT",
        xp: 15,
        difficulty: "Easy",
        providers: [
          { id: "paintswap", name: "PaintSwap", url: "https://paintswap.io", description: "NFT marketplace" },
        ],
      },
      {
        type: "deploy",
        emoji: "📝",
        label: "Deploy",
        xp: 40,
        difficulty: "Hard",
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
    description: "High-performance EVM L1 with parallel execution",
    explorer: "https://testnet.monadexplorer.com",
    actions: [
      {
        type: "faucet",
        emoji: "🚰",
        label: "Faucet",
        xp: 10,
        difficulty: "Easy",
        providers: [
          { id: "monad-faucet", name: "Monad Faucet", url: "https://faucet.monad.xyz", description: "Get testnet MON" },
          { id: "monad-discord", name: "Discord Faucet", url: "https://discord.gg/monad", description: "Via Discord bot" },
        ],
      },
      {
        type: "bridge",
        emoji: "🌉",
        label: "Bridge",
        xp: 20,
        difficulty: "Easy",
        providers: [
          { id: "monad-bridge", name: "Monad Bridge", url: "https://bridge.monad.xyz", description: "Official testnet bridge" },
          { id: "orbiter-monad", name: "Orbiter", url: "https://orbiter.finance", description: "Cross-chain bridge" },
        ],
      },
      {
        type: "swap",
        emoji: "🔄",
        label: "Swap",
        xp: 15,
        difficulty: "Easy",
        providers: [
          { id: "kuru", name: "Kuru", url: "https://kuru.io", description: "Monad DEX" },
          { id: "ambient-monad", name: "Ambient", url: "https://ambient.finance", description: "DEX" },
        ],
      },
      {
        type: "nft",
        emoji: "🎨",
        label: "NFT",
        xp: 15,
        difficulty: "Easy",
        providers: [
          { id: "monad-nft", name: "Monad NFTs", url: "https://magiceden.io/monad", description: "Mint & trade" },
        ],
      },
      {
        type: "deploy",
        emoji: "📝",
        label: "Deploy",
        xp: 40,
        difficulty: "Hard",
        providers: [
          { id: "remix-monad", name: "Remix IDE", url: "https://remix.ethereum.org", description: "Deploy to Monad testnet" },
        ],
      },
    ],
  },
];