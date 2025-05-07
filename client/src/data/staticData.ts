import { MarketData, PricePoint } from "../types/market";
import { Order, OrderStatus, OrderType, TradingRule } from "../types/order";

// Sample market data
export const staticMarketData: MarketData = {
  ltp: 24678.45,
  open: 24580.30,
  high: 24712.80,
  low: 24550.25,
  close: 24550.30,
  volume: 1250000,
  volumeChange: 3.2,
  change: 0.52,
  isMarketOpen: true,
  timeRemaining: "3h 45m"
};

// Generate 200 sample price points for the chart (last 24 hours)
export const generatePriceHistory = (): PricePoint[] => {
  const priceHistory: PricePoint[] = [];
  const now = new Date();
  const basePrice = 24500;
  
  // Generate data points for the last 24 hours
  for (let i = 0; i < 200; i++) {
    const timestamp = new Date(now.getTime() - (200 - i) * 5 * 60000); // 5 minute intervals
    
    // Create some realistic price movement patterns
    const timeComponent = Math.sin(i / 10) * 100;
    const randomComponent = (Math.random() - 0.5) * 50;
    const trendComponent = i * 0.5; // slight upward trend
    
    let price = basePrice + timeComponent + randomComponent + trendComponent;
    
    // Add some volatility spikes
    if (i % 40 === 0) {
      price += (Math.random() > 0.5 ? 200 : -200);
    }
    
    // Ensure price doesn't go too low
    price = Math.max(price, basePrice - 400);
    
    priceHistory.push({
      timestamp: timestamp.toISOString(),
      price: Math.round(price * 100) / 100
    });
  }
  
  return priceHistory;
};

export const staticPriceHistory = generatePriceHistory();

// Sample orders for history
export const staticOrders: Order[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    type: OrderType.BUY,
    instrument: "NIFTY 50",
    price: 24175.50,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Target Price"
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    type: OrderType.SELL,
    instrument: "NIFTY 50",
    price: 24410.75,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Take Profit"
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    type: OrderType.BUY,
    instrument: "NIFTY 50",
    price: 24250.25,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Target Price"
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    type: OrderType.SELL,
    instrument: "NIFTY 50",
    price: 24150.80,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Stop Loss"
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    type: OrderType.BUY,
    instrument: "NIFTY 50",
    price: 24300.60,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Target Price"
  }
];

// Sample trading rule
export const staticTradingRule: TradingRule = {
  targetPrice: 24400,
  takeProfit: 24600,
  stopLoss: 24200,
  autoExecute: true,
  strategy: "targetPrice"
};

// Function to generate a new simulated order
export const generateOrder = (type: OrderType, price: number, trigger: string): Order => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    type,
    instrument: "NIFTY 50",
    price,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger
  };
};

// Function to generate a new price point based on the last price
export const generateNextPrice = (lastPrice: number): number => {
  // Create some realistic price movement
  const change = (Math.random() - 0.5) * 10; // random movement
  return Math.round((lastPrice + change) * 100) / 100;
};