import { getRandomNumber } from "../../client/src/lib/utils";

// This is a simulated Upstox WebSocket service
// In a real app, this would connect to the actual Upstox WebSocket API

interface MarketDataPoint {
  ltp: number;        // Last Traded Price
  open: number;       // Opening price
  high: number;       // Highest price
  low: number;        // Lowest price
  close: number;      // Previous day's closing price
  volume: number;     // Trading volume
  volumeChange: number; // Volume change in percentage
  change: number;     // Price change in percentage
  isMarketOpen: boolean; // Market status
  timeRemaining?: string; // Time remaining until market closes
}

type MarketDataCallback = (data: MarketDataPoint) => void;

export class UpstoxService {
  private marketData: MarketDataPoint;
  private tickInterval: NodeJS.Timeout | null = null;
  private subscribers: Set<string> = new Set();
  private callbacks: MarketDataCallback[] = [];
  
  constructor() {
    // Initialize with sample data
    this.marketData = {
      ltp: 24414.4,
      open: 24380.25,
      high: 24498.75,
      low: 24380.25,
      close: 24412.3,
      volume: 2450000,
      volumeChange: 18,
      change: 1.2,
      isMarketOpen: true,
      timeRemaining: '2h 15m',
    };
    
    this.subscribers.add('NIFTY50');
  }
  
  public getCurrentMarketData(): MarketDataPoint {
    return { ...this.marketData };
  }
  
  public subscribeToSymbols(symbols: string[]): void {
    symbols.forEach(symbol => this.subscribers.add(symbol));
    console.log(`Subscribed to symbols: ${Array.from(this.subscribers).join(', ')}`);
  }
  
  public unsubscribeFromSymbols(symbols: string[]): void {
    symbols.forEach(symbol => this.subscribers.delete(symbol));
  }
  
  public startMarketDataStream(callback: MarketDataCallback): void {
    this.callbacks.push(callback);
    
    // Only start the tick interval if it's not already running
    if (!this.tickInterval) {
      this.tickInterval = setInterval(() => this.generateMarketTick(), 5000);
    }
  }
  
  public stopMarketDataStream(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
  
  private generateMarketTick(): void {
    // Generate realistic price movement
    const randomFactor = getRandomNumber(-20, 20);
    const newLtp = this.marketData.ltp + randomFactor;
    
    // Update market data
    this.marketData = {
      ...this.marketData,
      ltp: newLtp,
      high: Math.max(this.marketData.high, newLtp),
      low: Math.min(this.marketData.low, newLtp),
      volume: this.marketData.volume + getRandomNumber(5000, 20000),
      change: ((newLtp - this.marketData.close) / this.marketData.close) * 100,
    };
    
    // Notify all subscribers
    this.callbacks.forEach(callback => callback(this.marketData));
  }
  
  // In a real application, this would connect to the Upstox WebSocket API
  private connectToUpstoxWebSocket(): void {
    console.log('Connecting to Upstox WebSocket API...');
    // Implementation would depend on Upstox API requirements
  }
}
