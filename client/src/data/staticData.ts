import { MarketData, PricePoint } from "../types/market";
import { Order, OrderStatus, OrderType, TradingRule } from "../types/order";

// Sample market data - current market state
export const staticMarketData: MarketData = {
  ltp: 24678.45,      // Last Traded Price
  open: 24580.30,     // Today's opening price
  high: 24712.80,     // Today's high
  low: 24550.25,      // Today's low
  close: 24550.30,    // Previous day's closing price
  volume: 1250000,    // Trading volume today
  volumeChange: 3.2,  // Volume change percentage
  change: 0.52,       // Price change percentage
  isMarketOpen: true, // Is market currently open
  timeRemaining: "3h 45m"  // Time until market close
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
    
    // Add some volatility spikes for visual interest
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

// Sample orders with clear profit/loss scenarios
export const staticOrders: Order[] = [
  // Successful trade with profit
  {
    id: "1",
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    type: OrderType.BUY,
    instrument: "NIFTY 50",
    price: 24175.50,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Target Price",
    profit: null // Will be paired with order #2
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago
    type: OrderType.SELL,
    instrument: "NIFTY 50",
    price: 24410.75,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Take Profit",
    profit: 235.25 // Profit from buy order #1
  },
  
  // Loss scenario
  {
    id: "3",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    type: OrderType.BUY,
    instrument: "NIFTY 50",
    price: 24550.25,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Target Price",
    profit: null
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    type: OrderType.SELL,
    instrument: "NIFTY 50",
    price: 24150.80,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Stop Loss",
    profit: -399.45 // Loss from buy order #3
  },
  
  // Recent trades
  {
    id: "5",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    type: OrderType.BUY,
    instrument: "NIFTY 50",
    price: 24300.60,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Target Price",
    profit: null
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    type: OrderType.SELL,
    instrument: "NIFTY 50",
    price: 24498.35,
    quantity: 1, 
    status: OrderStatus.COMPLETED,
    trigger: "Take Profit",
    profit: 197.75 // Profit from buy order #5
  },
  
  // Today's trades
  {
    id: "7",
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), // 6 hours ago
    type: OrderType.BUY,
    instrument: "NIFTY 50",
    price: 24578.90,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Target Price",
    profit: null
  },
  {
    id: "8",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    type: OrderType.SELL,
    instrument: "NIFTY 50",
    price: 24678.45,
    quantity: 1,
    status: OrderStatus.COMPLETED,
    trigger: "Take Profit",
    profit: 99.55 // Profit from buy order #7
  },
  
  // Pending order
  {
    id: "9",
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    type: OrderType.BUY,
    instrument: "NIFTY 50",
    price: 24650.00,
    quantity: 1,
    status: OrderStatus.PENDING,
    trigger: "Target Price",
    profit: null
  }
];

// Sample trading rule
export const staticTradingRule: TradingRule = {
  targetPrice: 24600, // Price at which to buy
  takeProfit: 24700, // Price at which to sell for profit
  stopLoss: 24500,   // Price at which to sell to limit losses
  autoExecute: true,
  strategy: "targetPrice" // Alternative: "movingAverage"
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
    trigger,
    profit: null // Only calculated for SELL orders
  };
};

// Function to generate a new price point for simulation
export const generateNextPrice = (lastPrice: number): number => {
  // Create some realistic price movement
  const change = (Math.random() - 0.5) * 10; // random movement between -5 and +5
  return Math.round((lastPrice + change) * 100) / 100;
};