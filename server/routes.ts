import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";

// Import static data
import { 
  staticMarketData, 
  staticOrders, 
  staticTradingRule
} from "../client/src/data/staticData";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Static API routes for demo purposes
  app.get("/api/market-data", (req, res) => {
    res.json(staticMarketData);
  });

  app.get("/api/orders", (req, res) => {
    res.json(staticOrders);
  });

  app.post("/api/orders", (req, res) => {
    try {
      // Create a simulated order with an ID and timestamp
      const order = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...req.body
      };
      
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  app.get("/api/trading-rules", (req, res) => {
    res.json([staticTradingRule]);
  });

  app.post("/api/trading-rules", (req, res) => {
    try {
      // Create a simulated rule with an ID
      const rule = {
        id: Date.now().toString(),
        ...req.body,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      };
      
      res.status(201).json(rule);
    } catch (err) {
      res.status(400).json({ error: "Invalid trading rule data" });
    }
  });

  return httpServer;
}
