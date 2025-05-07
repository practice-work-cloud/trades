export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  timestamp: string;
  type: OrderType;
  instrument: string;
  price: number;
  quantity: number;
  status: OrderStatus;
  trigger: string;
}

export interface TradingRule {
  targetPrice: number;
  takeProfit: number;
  stopLoss: number;
  autoExecute: boolean;
  strategy: 'targetPrice' | 'movingAverage';
}
