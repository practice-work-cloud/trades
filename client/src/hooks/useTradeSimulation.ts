import { useState, useCallback } from 'react';
import { OrderType, OrderStatus, TradingRule, Order } from '@/types/order';
import { PricePoint } from '@/types/market';
import { getRandomNumber, sleep } from '@/lib/utils';

export function useTradeSimulation() {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  
  // Function to generate random market data and execute trades based on rules
  const generatePriceData = useCallback(async (
    initialPrice: number,
    targetPrice: number,
    takeProfitPrice: number,
    stopLossPrice: number, 
    onPriceUpdate: (point: PricePoint) => void,
    onOrderExecution: (order: Order) => void
  ) => {
    setIsSimulationRunning(true);
    
    const basePrice = initialPrice;
    const dataPoints = 100; // Increased data points for more realistic simulation
    const timeStep = 15 * 1000; // 15 seconds per point
    let buyExecuted = false;
    let sellExecuted = false;
    let consecutiveBuys = 0; // Track multiple buy executions for the demo
    
    const now = new Date();
    let currentPrice = basePrice;
    
    for (let i = 0; i < dataPoints; i++) {
      // Generate price movements with different patterns to demonstrate various scenarios
      if (i < 20) {
        // Small fluctuations around base price
        const randomFactor = getRandomNumber(-50, 50);
        currentPrice = basePrice + randomFactor;
      } else if (i < 35) {
        // Move towards target price (bullish trend)
        const progress = (i - 20) / 15;
        const priceDiff = targetPrice - basePrice;
        currentPrice = basePrice + priceDiff * progress + getRandomNumber(-20, 20);
      } else if (i < 50) {
        // Scenario 1: Price moves to take profit level
        const progress = (i - 35) / 15;
        const priceDiff = takeProfitPrice - targetPrice;
        currentPrice = targetPrice + priceDiff * progress + getRandomNumber(-30, 30);
      } else if (i < 65) {
        // Scenario 2: Reset conditions and generate new price movements
        // Small dip before another rise
        const randomFactor = getRandomNumber(-100, -20);
        currentPrice = takeProfitPrice + randomFactor;
        
        // If we've already executed both buy and sell, reset for another cycle
        if (buyExecuted && sellExecuted && consecutiveBuys < 3) {
          buyExecuted = false;
          sellExecuted = false;
        }
      } else if (i < 80) {
        // Scenario 3: Move towards target price again for another buy opportunity
        const progress = (i - 65) / 15;
        const newTarget = targetPrice - 100; // Slightly different target for variety
        const priceDiff = newTarget - currentPrice;
        currentPrice = currentPrice + priceDiff * progress + getRandomNumber(-20, 20);
      } else {
        // Scenario 4: Move towards stop loss level (bearish trend)
        const progress = (i - 80) / 20;
        const priceDiff = stopLossPrice - currentPrice;
        currentPrice = currentPrice + priceDiff * progress + getRandomNumber(-20, 20);
      }
      
      const timestamp = new Date(now.getTime() + i * timeStep);
      
      // Create price point
      const pricePoint: PricePoint = {
        timestamp: timestamp.toISOString(),
        price: currentPrice,
      };
      
      // Notify of price update
      onPriceUpdate(pricePoint);
      
      // Check if we need to trigger a buy order
      if (!buyExecuted && 
          ((targetPrice > basePrice && currentPrice >= targetPrice) || 
           (targetPrice < basePrice && currentPrice <= targetPrice))) {
        buyExecuted = true;
        consecutiveBuys++;
        
        const buyOrder: Order = {
          id: Date.now().toString(),
          timestamp: timestamp.toISOString(),
          type: OrderType.BUY,
          instrument: 'NIFTY 50',
          price: currentPrice,
          quantity: 1,
          status: OrderStatus.COMPLETED,
          trigger: 'Target Price',
        };
        
        onOrderExecution(buyOrder);
        
        // Add a small delay to make the order execution more visible
        await sleep(400);
      }
      
      // Check if we need to trigger a sell order after a buy
      if (buyExecuted && !sellExecuted) {
        // Condition 1: Take profit is triggered
        if (takeProfitPrice > targetPrice && currentPrice >= takeProfitPrice) {
          sellExecuted = true;
          
          const sellOrder: Order = {
            id: Date.now().toString(),
            timestamp: timestamp.toISOString(),
            type: OrderType.SELL,
            instrument: 'NIFTY 50',
            price: currentPrice,
            quantity: 1,
            status: OrderStatus.COMPLETED,
            trigger: 'Take Profit',
          };
          
          onOrderExecution(sellOrder);
          await sleep(400);
        } 
        // Condition 2: Stop loss is triggered
        else if (stopLossPrice < targetPrice && currentPrice <= stopLossPrice) {
          sellExecuted = true;
          
          const sellOrder: Order = {
            id: Date.now().toString(),
            timestamp: timestamp.toISOString(),
            type: OrderType.SELL,
            instrument: 'NIFTY 50',
            price: currentPrice,
            quantity: 1,
            status: OrderStatus.COMPLETED,
            trigger: 'Stop Loss',
          };
          
          onOrderExecution(sellOrder);
          await sleep(400);
        }
      }
      
      // Additional scenario: Market conditions change rapidly (for demo purposes)
      if (i === 70 && !buyExecuted && consecutiveBuys < 3) {
        // Force a quick market movement to demonstrate rapid order execution
        currentPrice = targetPrice + 10;
        
        const pricePoint: PricePoint = {
          timestamp: timestamp.toISOString(),
          price: currentPrice,
        };
        
        onPriceUpdate(pricePoint);
        
        buyExecuted = true;
        consecutiveBuys++;
        
        const buyOrder: Order = {
          id: Date.now().toString(),
          timestamp: timestamp.toISOString(),
          type: OrderType.BUY,
          instrument: 'NIFTY 50',
          price: currentPrice,
          quantity: 1,
          status: OrderStatus.COMPLETED,
          trigger: 'Market Momentum',
        };
        
        onOrderExecution(buyOrder);
        await sleep(400);
      }
      
      // Add a delay between price updates for more realistic visualization
      await sleep(80);
    }
    
    setIsSimulationRunning(false);
  }, []);
  
  // Function to simulate multiple trading scenarios automatically
  const autoSimulate = useCallback(async (
    initialPrice: number,
    tradingRules: TradingRule,
    onPriceUpdate: (point: PricePoint) => void,
    onOrderExecution: (order: Order) => void
  ) => {
    setIsSimulationRunning(true);
    
    // Define a set of different scenarios to demonstrate
    const scenarios = [
      {
        name: 'Target Price & Take Profit',
        targetPrice: tradingRules.targetPrice,
        takeProfitPrice: tradingRules.takeProfit,
        stopLossPrice: tradingRules.stopLoss
      },
      {
        name: 'Target Price & Stop Loss',
        targetPrice: tradingRules.targetPrice,
        takeProfitPrice: tradingRules.targetPrice + 500, // Unreachable take profit
        stopLossPrice: tradingRules.stopLoss
      },
      {
        name: 'Market Volatility',
        targetPrice: initialPrice - 100, // Immediate buy
        takeProfitPrice: initialPrice + 200,
        stopLossPrice: initialPrice - 300
      }
    ];
    
    // Execute each scenario in sequence
    for (const scenario of scenarios) {
      await generatePriceData(
        initialPrice,
        scenario.targetPrice,
        scenario.takeProfitPrice,
        scenario.stopLossPrice,
        onPriceUpdate,
        onOrderExecution
      );
      
      // Add a brief pause between scenarios
      await sleep(1000);
    }
    
    setIsSimulationRunning(false);
  }, [generatePriceData]);
  
  return {
    isSimulationRunning,
    generatePriceData,
    autoSimulate
  };
}
