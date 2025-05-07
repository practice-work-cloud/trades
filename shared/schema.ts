import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Orders table to store trade history
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  instrument: text("instrument").notNull(),
  type: text("type").notNull(), // BUY, SELL
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
  status: text("status").notNull(), // PENDING, COMPLETED, CANCELLED
  trigger: text("trigger").notNull(), // Target Price, Take Profit, Stop Loss, Manual
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Trading rules table
export const tradingRules = pgTable("trading_rules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  targetPrice: real("target_price").notNull(),
  takeProfit: real("take_profit").notNull(),
  stopLoss: real("stop_loss").notNull(),
  autoExecute: boolean("auto_execute").default(true).notNull(),
  strategy: text("strategy").notNull(), // targetPrice, movingAverage
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Market data snapshots
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  data: jsonb("data").notNull(), // JSON with LTP, open, high, low, close, etc.
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  tradingRules: many(tradingRules)
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  })
}));

export const tradingRulesRelations = relations(tradingRules, ({ one }) => ({
  user: one(users, {
    fields: [tradingRules.userId],
    references: [users.id]
  })
}));

// Schemas for validating inputs
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertTradingRuleSchema = createInsertSchema(tradingRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertTradingRule = z.infer<typeof insertTradingRuleSchema>;
export type TradingRule = typeof tradingRules.$inferSelect;

export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type MarketData = typeof marketData.$inferSelect;
