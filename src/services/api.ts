// ═══════════════════════════════════
// VoidDrop API Service
// ═══════════════════════════════════

const API_URL = "https://api.voiddrop.space";

// ═══════════════════════════════════
// TELEGRAM
// ═══════════════════════════════════

export function getTelegramUserId(): string | null {
  try {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
      return String(tg.initDataUnsafe.user.id);
    }
  } catch (_) {}
  return null;
}

export function getTelegramUser(): { id: string; firstName: string } | null {
  try {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user) {
      return {
        id: String(tg.initDataUnsafe.user.id),
        firstName: tg.initDataUnsafe.user.first_name || "Explorer",
      };
    }
  } catch (_) {}
  return null;
}

// ═══════════════════════════════════
// BASE FETCH
// ═══════════════════════════════════

export async function fetchAPI(path: string) {
  try {
    const response = await fetch(`${API_URL}${path}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error: ${path}`, error);
    return { success: false, error: String(error) };
  }
}

// ═══════════════════════════════════
// MARKETS & PRICES
// ═══════════════════════════════════

export interface MarketData {
  symbol: string;
  price: string;
  funding_rate: string;
  max_leverage: number;
}

export async function getTopMarkets(): Promise<MarketData[]> {
  const data = await fetchAPI("/api/markets/top");
  if (data.success) return data.data;
  return [];
}

export async function getAllMarkets(): Promise<MarketData[]> {
  const data = await fetchAPI("/api/markets");
  if (data.success) return data.data;
  return [];
}

// ═══════════════════════════════════
// PACIFICA STATS
// ═══════════════════════════════════

export interface PacificaStats {
  total_markets: number;
  avg_funding_rate: string;
  btc_price: string;
  builder_code: string;
  fee_rate: string;
  status: string;
}

export async function getPacificaStats(): Promise<PacificaStats | null> {
  const data = await fetchAPI("/api/pacifica/stats");
  if (data.success) return data.data;
  return null;
}

// ═══════════════════════════════════
// PORTFOLIO
// ═══════════════════════════════════

export interface PortfolioData {
  wallet: string;
  wallet_short: string;
  positions: any[];
  orders: any[];
}

export async function getPortfolioByTelegram(): Promise<PortfolioData | null> {
  const telegramId = getTelegramUserId();
  if (!telegramId) return null;
  const data = await fetchAPI(`/api/portfolio/tg?telegram_id=${telegramId}`);
  if (data.success) return data.data;
  return null;
}

export async function getPortfolio(account: string): Promise<PortfolioData | null> {
  const data = await fetchAPI(`/api/portfolio?account=${account}`);
  if (data.success) return data.data;
  return null;
}

// ═══════════════════════════════════
// DROPS
// ═══════════════════════════════════

export interface DropsStats {
  total_live: number;
  total_funding: string;
  avg_reward: string;
  pacifica: {
    markets: number;
    btc_price: string;
    status: string;
    builder_code: string;
  };
}

export async function getDropsStats(): Promise<DropsStats | null> {
  const data = await fetchAPI("/api/drops");
  if (data.success) return data.data;
  return null;
}

// ═══════════════════════════════════
// TRADE HISTORY & STATS
// ═══════════════════════════════════

export interface TradeStats {
  total_trades: number;
  wins: number;
  losses: number;
  win_rate: number;
  total_pnl: number;
  edge: number;
  best_trade: ClosedTrade | null;
  worst_trade: ClosedTrade | null;
}

export interface ClosedTrade {
  symbol: string;
  side: string;
  amount: string;
  entry_price: string;
  close_price: string;
  pnl: number;
  win: boolean;
  opened_at: number;
  closed_at: number;
}

export interface TradeHistoryData {
  stats: TradeStats;
  open: any[];
  closed: ClosedTrade[];
}

export async function getTradeHistory(): Promise<TradeHistoryData | null> {
  const telegramId = getTelegramUserId();
  if (!telegramId) return null;
  const data = await fetchAPI(`/api/trades/history?telegram_id=${telegramId}`);
  if (data.success) return data.data;
  return null;
}

// ═══════════════════════════════════
// CLOSE POSITIONS
// ═══════════════════════════════════

export async function closePosition(symbol: string): Promise<{ success: boolean; error?: string }> {
  const telegramId = getTelegramUserId();
  if (!telegramId) return { success: false, error: "No telegram ID" };

  try {
    const response = await fetch(
      `${API_URL}/api/trades/close?telegram_id=${telegramId}&symbol=${symbol}`,
      { method: "POST" }
    );
    return await response.json();
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function closeAllPositions(): Promise<{ success: boolean; error?: string }> {
  const telegramId = getTelegramUserId();
  if (!telegramId) return { success: false, error: "No telegram ID" };

  try {
    const response = await fetch(
      `${API_URL}/api/trades/close-all?telegram_id=${telegramId}`,
      { method: "POST" }
    );
    return await response.json();
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// ═══════════════════════════════════
// DROPS FROM BACKEND
// ═══════════════════════════════════

export interface LiveDrop {
  id: number;
  name: string;
  ticker: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  type: string;
  funding: string;
  probability: string;
  category: string;
  description: string;
  reward: string;
  endDate: string;
  chain: string;
  project_url: string;
  hot: boolean;
  new: boolean;
  tasks: {
    id: number;
    title: string;
    description: string;
    url: string;
    difficulty: string;
    xp: number;
    completed: boolean;
  }[];
  added_at: number;
}

export async function getLiveDrops(): Promise<LiveDrop[]> {
  const data = await fetchAPI("/api/drops/list");
  if (data.success) return data.data;
  return [];
}

// ═══════════════════════════════════
// TASK COMPLETION
// ═══════════════════════════════════

export async function completeTask(dropId: number, taskId: number): Promise<{
  success: boolean;
  data?: { completed: number; total: number; xp_earned: number };
  error?: string;
}> {
  const telegramId = getTelegramUserId();
  if (!telegramId) return { success: false, error: "No telegram ID" };

  try {
    const response = await fetch(
      `${API_URL}/api/drops/${dropId}/tasks/${taskId}/complete?telegram_id=${telegramId}`,
      { method: "POST" }
    );
    return await response.json();
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function getUserProgress(): Promise<Record<string, number[]>> {
  const telegramId = getTelegramUserId();
  if (!telegramId) return {};

  const data = await fetchAPI(`/api/drops/progress?telegram_id=${telegramId}`);
  if (data.success) return data.data;
  return {};
}

// ═══════════════════════════════════
// SCHEDULE
// ═══════════════════════════════════

export interface ScheduleTaskLive {
  id: string;
  drop_id: number;
  task_id: number;
  title: string;
  description: string;
  url: string;
  difficulty: string;
  xp: number;
  completed: boolean;
  drop_name: string;
  drop_emoji: string;
  drop_chain: string;
  gradient_from: string;
  gradient_to: string;
  glow: string;
}

export interface ScheduleData {
  tasks: ScheduleTaskLive[];
  stats: {
    total: number;
    completed: number;
    total_xp: number;
    streak: number;
  };
}

export async function getSchedule(): Promise<ScheduleData | null> {
  const telegramId = getTelegramUserId();
  if (!telegramId) return null;
  const data = await fetchAPI(`/api/schedule?telegram_id=${telegramId}`);
  if (data.success) return data.data;
  return null;
}

// ═══════════════════════════════════
// SYBIL SCORE
// ═══════════════════════════════════

export interface SybilScoreData {
  total_score: number;
  max_score: number;
  grade: string;
  risk_level: "LOW" | "MED" | "HIGH" | "CRITICAL";
  breakdown: {
    label: string;
    score: number;
    max: number;
    description: string;
  }[];
  tips: {
    emoji: string;
    text: string;
    status: "good" | "warning";
  }[];
  stats: {
    total_trades: number;
    tasks_completed: number;
    drops_interacted: number;
  };
}

export async function getSybilScore(): Promise<SybilScoreData | null> {
  const telegramId = getTelegramUserId();
  if (!telegramId) return null;
  const data = await fetchAPI(`/api/sybil/score?telegram_id=${telegramId}`);
  if (data.success) return data.data;
  return null;
}

// ═══════════════════════════════════
// SCHEDULE GENERATION
// ═══════════════════════════════════

export interface ScheduleDay {
  date: string;
  day_short: string;
  day_num: number;
  month: string;
  is_today: boolean;
  tasks: ScheduleTaskLive[];
}

export interface GeneratedSchedule {
  days: ScheduleDay[];
  chains: string[] | string;
  generated_at: number;
  total_tasks: number;
  days_count: number;
  tasks_per_day: number;
}

export async function generateSchedule(
  chains: string[],
  days: number = 7,
  tasksPerDay: number = 3
): Promise<GeneratedSchedule | null> {
  const telegramId = getTelegramUserId();
  if (!telegramId) return null;

  try {
    const chainsStr = chains.join(",");
    const response = await fetch(
      `${API_URL}/api/schedule/generate?telegram_id=${telegramId}&chains=${chainsStr}&days=${days}&tasks_per_day=${tasksPerDay}`,
      { method: "POST" }
    );
    const data = await response.json();
    if (data.success) return data.data;
  } catch (e) {
    console.error("generateSchedule error:", e);
  }
  return null;
}

// ═══════════════════════════════════
// WALLET PORTFOLIO — MULTI-CHAIN
// ═══════════════════════════════════

export interface ChainData {
  chain: string;
  balance: number;
  tx_count: number;
  active: boolean;
}

export interface PortfolioSummary {
  total_balance_eth: number;
  total_transactions: number;
  active_chains: number;
  total_chains: number;
  farming_score: number;
}

export interface WalletPortfolio {
  address: string;
  address_short: string;
  chains: ChainData[];
  summary: PortfolioSummary;
}

export async function getWalletPortfolio(address: string): Promise<WalletPortfolio | null> {
  const data = await fetchAPI(`/api/wallet/portfolio?address=${address}`);
  if (data.success) return data.data;
  return null;
}

export async function verifyTask(
  address: string, chain: string, minTx: number = 1
): Promise<{ verified: boolean; tx_count: number; balance: number } | null> {
  const data = await fetchAPI(
    `/api/wallet/verify-task?address=${address}&chain=${chain}&min_tx=${minTx}`
  );
  if (data.success) return data.data;
  return null;
}