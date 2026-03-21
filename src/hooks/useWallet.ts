import { useState, useEffect, useCallback } from "react";
import {
  getTelegramUserId,
  getTelegramUser,
  getPortfolioByTelegram,
  getTradeHistory,
  type PortfolioData,
  type TradeHistoryData,
} from "../services/api";

export interface WalletState {
  isLoaded: boolean;
  isConnected: boolean;
  telegramId: string | null;
  firstName: string;
  wallet: string | null;
  walletShort: string | null;
  portfolio: PortfolioData | null;
  positionsCount: number;
  tradeHistory: TradeHistoryData | null;
  refresh: () => Promise<void>;
}

export function useWallet(): WalletState {
  const [isLoaded, setIsLoaded] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryData | null>(null);

  const tgUser = getTelegramUser();
  const telegramId = tgUser?.id ?? getTelegramUserId();
  const firstName = tgUser?.firstName ?? "Explorer";

  const fetchAll = useCallback(async () => {
    if (!telegramId) {
      setIsLoaded(true);
      return;
    }
    try {
      const [portfolioData, historyData] = await Promise.all([
        getPortfolioByTelegram(),
        getTradeHistory(),
      ]);
      setPortfolio(portfolioData);
      setTradeHistory(historyData);
    } catch (e) {
      console.error("useWallet: fetch failed", e);
    } finally {
      setIsLoaded(true);
    }
  }, [telegramId]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const isConnected = Boolean(portfolio?.wallet);

  return {
    isLoaded,
    isConnected,
    telegramId,
    firstName,
    wallet: portfolio?.wallet ?? null,
    walletShort: portfolio?.wallet_short ?? null,
    portfolio,
    positionsCount: portfolio?.positions?.length ?? 0,
    tradeHistory,
    refresh: fetchAll,
  };
}