import { createContext, useContext, ReactNode } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { MarketData, PricePoint } from '@/types/market';
import { Order, TradingRule } from '@/types/order';

interface MarketContextType {
  marketData: MarketData | null;
  priceHistory: PricePoint[];
  tradeExecutions: Order[];
  orders: Order[];
  lastUpdated: Date | null;
  isConnected: boolean;
  refreshData: () => void;
  tradingRules: TradingRule | null;
  setTradingRules: (rules: TradingRule) => void;
  runSimulation: () => void;
  resetSimulation: () => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: ReactNode }) {
  const marketData = useMarketData();
  
  return (
    <MarketContext.Provider value={marketData}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarketContext() {
  const context = useContext(MarketContext);
  
  if (context === undefined) {
    throw new Error('useMarketContext must be used within a MarketProvider');
  }
  
  return context;
}
