import { createContext, useContext, ReactNode } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { MarketData, PricePoint } from '@/types/market';
import { Order, TradingRule } from '@/types/order';

// Define the context type
interface MarketContextType {
  marketData: MarketData | null;
  priceHistory: PricePoint[];
  tradeExecutions: Order[];
  orders: Order[];
  lastUpdated: Date | null;
  isConnected: boolean;
  isSimulationRunning: boolean;
  refreshData: () => void;
  tradingRules: TradingRule | null;
  setTradingRules: (rules: TradingRule) => void;
  runSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
}

// Create the context with a default undefined value
const MarketContext = createContext<MarketContextType | undefined>(undefined);

// Provider component - exported as a named export
export const MarketProvider = ({ children }: { children: ReactNode }) => {
  // Use the market data hook to get all the state and functions
  const marketData = useMarketData();
  
  return (
    <MarketContext.Provider value={marketData}>
      {children}
    </MarketContext.Provider>
  );
};

// Context hook - exported as a named export 
export const useMarketContext = () => {
  const context = useContext(MarketContext);
  
  if (context === undefined) {
    throw new Error('useMarketContext must be used within a MarketProvider');
  }
  
  return context;
};
