export interface MarketData {
  ltp: number;        // Last Traded Price
  open: number;       // Opening price
  high: number;       // Highest price
  low: number;        // Lowest price
  close: number;      // Previous day's closing price
  volume: number;     // Trading volume
  volumeChange: number; // Volume change in percentage compared to average
  change: number;     // Price change in percentage
  isMarketOpen: boolean; // Market status
  timeRemaining?: string; // Time remaining until market closes
}

export interface MarketDataMessage {
  type: string;
  data: MarketData;
}

export interface PricePoint {
  timestamp: string;
  price: number;
}
