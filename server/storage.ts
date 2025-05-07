import { 
  users, 
  type User, 
  type InsertUser, 
  orders, 
  type Order, 
  type InsertOrder,
  tradingRules,
  type TradingRule,
  type InsertTradingRule,
  marketData,
  type MarketData,
  type InsertMarketData 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Order methods
  getOrder(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Trading rule methods
  getTradingRule(id: number): Promise<TradingRule | undefined>;
  getAllTradingRules(): Promise<TradingRule[]>;
  getActiveTradingRules(): Promise<TradingRule[]>;
  createTradingRule(rule: InsertTradingRule): Promise<TradingRule>;
  
  // Market data methods
  getLatestMarketData(symbol: string): Promise<MarketData | undefined>;
  createMarketDataSnapshot(data: InsertMarketData): Promise<MarketData>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  
  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    // Ensure userId is not undefined
    const orderData = {
      ...insertOrder,
      userId: insertOrder.userId || null
    };
    
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }
  
  // Trading rule methods
  async getTradingRule(id: number): Promise<TradingRule | undefined> {
    const [rule] = await db.select().from(tradingRules).where(eq(tradingRules.id, id));
    return rule;
  }
  
  async getAllTradingRules(): Promise<TradingRule[]> {
    return db.select().from(tradingRules);
  }
  
  async getActiveTradingRules(): Promise<TradingRule[]> {
    return db.select().from(tradingRules).where(eq(tradingRules.isActive, true));
  }
  
  async createTradingRule(insertRule: InsertTradingRule): Promise<TradingRule> {
    // Ensure userId is not undefined and required fields have defaults
    const ruleData = {
      ...insertRule,
      userId: insertRule.userId || null,
      autoExecute: insertRule.autoExecute !== undefined ? insertRule.autoExecute : true,
      isActive: insertRule.isActive !== undefined ? insertRule.isActive : true
    };
    
    const [rule] = await db.insert(tradingRules).values(ruleData).returning();
    return rule;
  }
  
  // Market data methods
  async getLatestMarketData(symbol: string): Promise<MarketData | undefined> {
    const [data] = await db
      .select()
      .from(marketData)
      .where(eq(marketData.symbol, symbol))
      .orderBy(desc(marketData.timestamp))
      .limit(1);
    
    return data;
  }
  
  async createMarketDataSnapshot(insertData: InsertMarketData): Promise<MarketData> {
    const [data] = await db.insert(marketData).values(insertData).returning();
    return data;
  }
  
  // Helper method to initialize sample data
  async initializeSampleData(): Promise<void> {
    // Check if we already have a demo user
    let demoUser = await this.getUserByUsername("demo");
    
    // If no demo user exists, create one
    if (!demoUser) {
      demoUser = await this.createUser({ username: "demo", password: "password" });
      
      // Create sample orders
      const sampleOrders: InsertOrder[] = [
        {
          userId: demoUser.id,
          instrument: "NIFTY 50",
          type: "BUY",
          price: 24500,
          quantity: 1,
          status: "COMPLETED",
          trigger: "Target Price",
        },
        {
          userId: demoUser.id,
          instrument: "NIFTY 50",
          type: "SELL",
          price: 25000,
          quantity: 1,
          status: "COMPLETED",
          trigger: "Take Profit",
        },
        {
          userId: demoUser.id,
          instrument: "NIFTY 50",
          type: "BUY",
          price: 24000,
          quantity: 1,
          status: "COMPLETED",
          trigger: "Target Price",
        },
        {
          userId: demoUser.id,
          instrument: "NIFTY 50",
          type: "SELL",
          price: 23500,
          quantity: 1,
          status: "COMPLETED",
          trigger: "Stop Loss",
        },
      ];
      
      for (const order of sampleOrders) {
        await this.createOrder(order);
      }
      
      // Create a sample trading rule
      await this.createTradingRule({
        userId: demoUser.id,
        targetPrice: 24500,
        takeProfit: 25000,
        stopLoss: 23500,
        autoExecute: true,
        strategy: "targetPrice",
        isActive: true,
      });
    }
  }
}

// Initialize storage with the database
export const storage = new DatabaseStorage();

// Initialize with sample data (call this in server/index.ts)
export const initializeDatabase = async (): Promise<void> => {
  await (storage as DatabaseStorage).initializeSampleData();
};
