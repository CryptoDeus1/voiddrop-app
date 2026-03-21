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