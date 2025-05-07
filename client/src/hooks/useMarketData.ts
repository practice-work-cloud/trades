import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  const { isSimulationRunning, autoSimulate, stopSimulation: stopTradeSimulation } = useTradeSimulation();
  
  // Ref to track if we need to stop data updates during simulation
  const simulationRunningRef = useRef(false);
  
  // Generate a new price point
  const refreshData = useCallback(() => {
    if (!marketData || simulationRunningRef.current) return;
    
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
      if (!simulationRunningRef.current) {
        refreshData();
      }
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
    
    // Set simulation running flag
    simulationRunningRef.current = true;
    
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
    ).then(() => {
      // When simulation is complete, allow regular updates again
      simulationRunningRef.current = false;
    });
  }, [
    marketData, 
    tradingRules, 
    isSimulationRunning, 
    autoSimulate,
    handlePriceUpdate, 
    handleOrderExecution
  ]);
  
  // Stop the current simulation
  const stopSimulation = useCallback(() => {
    if (!isSimulationRunning) return;
    
    // Stop the simulation in the trade simulation hook
    stopTradeSimulation();
    
    // Reset the flag
    simulationRunningRef.current = false;
  }, [isSimulationRunning, stopTradeSimulation]);
  
  // Reset simulation to initial state (reset all data to defaults)
  const resetSimulation = useCallback(() => {
    // If a simulation is running, stop it first
    if (isSimulationRunning) {
      stopTradeSimulation();
    }
    
    // Reset all data to default state
    simulationRunningRef.current = false;
    setMarketData(staticMarketData);
    setPriceHistory(staticPriceHistory);
    setTradeExecutions([]);
    setOrders(staticOrders);
    
    // Reset trading rules to defaults
    setTradingRules(staticTradingRule);
    
    // Set last updated to now
    setLastUpdated(new Date());
  }, [isSimulationRunning, stopTradeSimulation]);
  
  return {
    marketData,
    priceHistory,
    tradeExecutions,
    orders,
    lastUpdated,
    isConnected,
    isSimulationRunning,
    refreshData,
    tradingRules,
    setTradingRules,
    runSimulation,
    stopSimulation,
    resetSimulation,
  };
}
