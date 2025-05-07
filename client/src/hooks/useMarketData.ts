import { useState, useEffect, useCallback } from 'react';
import { useTradeSimulation } from './useTradeSimulation';
import { MarketData, PricePoint } from '@/types/market';
import { Order, TradingRule } from '@/types/order';
import { 
  staticMarketData, 
  staticPriceHistory, 
  staticOrders, 
  staticTradingRule,
  generateNextPrice
} from '@/data/staticData';

export function useMarketData() {
  // Initialize with static data
  const [marketData, setMarketData] = useState<MarketData | null>(staticMarketData);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>(staticPriceHistory);
  const [tradeExecutions, setTradeExecutions] = useState<Order[]>([]);
  const [orders, setOrders] = useState<Order[]>(staticOrders);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [tradingRules, setTradingRules] = useState<TradingRule | null>(staticTradingRule);
  
  // For pure static version, we simulate connection state
  const [isConnected] = useState(true);
  
  const { isSimulationRunning, autoSimulate } = useTradeSimulation();
  
  // Generate a new price point
  const refreshData = useCallback(() => {
    if (!marketData) return;
    
    // Generate a new price based on the current price
    const newPrice = generateNextPrice(marketData.ltp);
    
    // Create a new price point
    const newPricePoint: PricePoint = {
      timestamp: new Date().toISOString(),
      price: newPrice,
    };
    
    // Update market data
    setMarketData(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        ltp: newPrice,
        high: Math.max(prev.high, newPrice),
        low: Math.min(prev.low, newPrice),
      };
    });
    
    setPriceHistory(prev => [...prev, newPricePoint]);
    setLastUpdated(new Date());
  }, [marketData]);
  
  // Simulate periodic data updates for a dynamic feel
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [refreshData]);
  
  // Handle order executions from simulations
  const handleOrderExecution = useCallback((order: Order) => {
    setTradeExecutions(prev => [...prev, order]);
    setOrders(prev => [...prev, order]);
  }, []);
  
  // Handle price updates from simulations
  const handlePriceUpdate = useCallback((pricePoint: PricePoint) => {
    setPriceHistory(prev => [...prev, pricePoint]);
    
    // Update market data with the latest price
    if (marketData) {
      setMarketData(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          ltp: pricePoint.price,
          high: Math.max(prev.high, pricePoint.price),
          low: Math.min(prev.low, pricePoint.price),
        };
      });
    }
    
    setLastUpdated(new Date(pricePoint.timestamp));
  }, [marketData]);
  
  // Run trading simulation with current rules
  const runSimulation = useCallback(() => {
    if (!marketData || !tradingRules || isSimulationRunning) return;
    
    // Reset price history and trade executions first
    setPriceHistory([{
      timestamp: new Date().toISOString(),
      price: marketData.ltp
    }]);
    setTradeExecutions([]);
    
    // Use autoSimulate to run multiple trading scenarios automatically
    autoSimulate(
      marketData.ltp,
      tradingRules,
      handlePriceUpdate,
      handleOrderExecution
    );
  }, [
    marketData, 
    tradingRules, 
    isSimulationRunning, 
    autoSimulate,
    handlePriceUpdate, 
    handleOrderExecution
  ]);
  
  // Reset simulation to initial state
  const resetSimulation = useCallback(() => {
    if (!marketData) return;
    
    setPriceHistory(staticPriceHistory);
    setTradeExecutions([]);
  }, [marketData]);
  
  return {
    marketData,
    priceHistory,
    tradeExecutions,
    orders,
    lastUpdated,
    isConnected,
    refreshData,
    tradingRules,
    setTradingRules,
    runSimulation,
    resetSimulation,
  };
}
