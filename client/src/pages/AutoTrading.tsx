import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TradingRules from "@/components/TradingRules";
import PriceChart from "@/components/PriceChart";
import Notification from "@/components/Notification";
import { useMarketContext } from "@/contexts/MarketContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderType, OrderStatus } from "@/types/order";
import { PlayCircle, PauseCircle, RotateCcw, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function AutoTrading() {
  const { isConnected, marketData, tradingRules, orders, runSimulation, resetSimulation } = useMarketContext();
  const [autoTradingEnabled, setAutoTradingEnabled] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "running" | "completed">("idle");
  const [executedOrders, setExecutedOrders] = useState<any[]>([]);
  
  // This function would be called when an order is executed in a real system
  const triggerOrderExecution = () => {
    const newExecutedOrder = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: Math.random() > 0.5 ? OrderType.BUY : OrderType.SELL,
      price: marketData?.ltp || 0,
      quantity: 1,
      status: OrderStatus.COMPLETED,
      instrument: "NIFTY 50",
      trigger: Math.random() > 0.5 ? "Target Price" : "Take Profit"
    };
    
    setExecutedOrders(prev => [...prev, newExecutedOrder]);
  };

  const handleRulesSave = () => {
    setNotificationMessage("Trading rules updated and ready for automation!");
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  
  const handleStartAutoTrading = () => {
    if (!tradingRules) {
      setNotificationMessage("Please set trading rules first");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    
    setAutoTradingEnabled(true);
    setSimulationStatus("running");
    
    // Run the automated simulation with multiple scenarios
    runSimulation();
    
    setNotificationMessage("Auto trading started! The system will execute trades based on your rules for multiple scenarios.");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  const handleStopAutoTrading = () => {
    setAutoTradingEnabled(false);
    setSimulationStatus("completed");
    
    setNotificationMessage("Auto trading stopped");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  const handleResetAutoTrading = () => {
    setAutoTradingEnabled(false);
    setSimulationStatus("idle");
    resetSimulation();
    
    setNotificationMessage("Auto trading reset");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  // Get the most recent orders
  const recentOrders = orders.slice(-5).reverse();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header isConnected={isConnected} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Automated Trading System</h2>
          <p className="text-muted-foreground">Configure and monitor your automated trading strategy</p>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trading Status</CardTitle>
                  <CardDescription>Current state of the automated trading system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Auto-Trading:</span>
                      <div className="flex items-center space-x-2">
                        <span>{autoTradingEnabled ? "Enabled" : "Disabled"}</span>
                        <Switch checked={autoTradingEnabled} onCheckedChange={(checked) => {
                          if (checked) handleStartAutoTrading();
                          else handleStopAutoTrading();
                        }} />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Status:</span>
                      <div className="flex items-center space-x-2">
                        {simulationStatus === "idle" && (
                          <span className="px-2 py-1 bg-muted rounded-full text-xs">Idle</span>
                        )}
                        {simulationStatus === "running" && (
                          <span className="px-2 py-1 bg-secondary bg-opacity-20 text-secondary rounded-full text-xs">Running</span>
                        )}
                        {simulationStatus === "completed" && (
                          <span className="px-2 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-xs">Completed</span>
                        )}
                      </div>
                    </div>
                    
                    {tradingRules && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Target Price:</span>
                          <span className="font-mono">{formatCurrency(tradingRules.targetPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Take Profit:</span>
                          <span className="font-mono">{formatCurrency(tradingRules.takeProfit)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Stop Loss:</span>
                          <span className="font-mono">{formatCurrency(tradingRules.stopLoss)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetAutoTrading}
                    disabled={simulationStatus === "idle"}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  
                  {!autoTradingEnabled ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (tradingRules) {
                            setAutoTradingEnabled(true);
                            setSimulationStatus("running");
                            runSimulation();
                            setNotificationMessage("Running all trading scenarios automatically for demo");
                            setShowNotification(true);
                            setTimeout(() => setShowNotification(false), 3000);
                          } else {
                            setNotificationMessage("Please set trading rules first");
                            setShowNotification(true);
                            setTimeout(() => setShowNotification(false), 3000);
                          }
                        }}
                        disabled={!tradingRules}
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Run Demo
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleStartAutoTrading}
                        disabled={!tradingRules}
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleStopAutoTrading}
                    >
                      <PauseCircle className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Last 5 executed orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order, index) => (
                        <div key={index} className="flex items-center p-2 rounded-md bg-muted bg-opacity-40 border border-border">
                          <div className={`w-1 h-10 mr-4 rounded-full ${
                            order.type === OrderType.BUY ? "bg-secondary" : "bg-destructive"
                          }`} />
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{order.type} {order.instrument}</span>
                              <span className="font-mono">{formatCurrency(order.price)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{formatDateTime(new Date(order.timestamp))}</span>
                              <span className="italic">via {order.trigger}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No orders executed yet</p>
                      <p className="text-xs mt-2">Start auto-trading to generate orders</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="grid-cell p-4">
              <PriceChart />
            </div>
            
            {!tradingRules && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No trading rules defined</AlertTitle>
                <AlertDescription>
                  Please configure your trading rules in the Configuration tab before starting auto-trading.
                </AlertDescription>
              </Alert>
            )}
            
            {autoTradingEnabled && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Auto trading is active</AlertTitle>
                <AlertDescription>
                  The system will execute trades based on your defined rules. Monitor the chart and order history.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="configuration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trading Rules Configuration</CardTitle>
                <CardDescription>Set up your automated trading parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <TradingRules onSave={handleRulesSave} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Live Performance</CardTitle>
                  <CardDescription>Real-time trading activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <PriceChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>Auto-trading performance stats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted rounded-md p-3 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
                        <p className="text-2xl font-bold">{orders.length}</p>
                      </div>
                      <div className="bg-muted rounded-md p-3 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                        <p className="text-2xl font-bold">78%</p>
                      </div>
                      <div className="bg-muted rounded-md p-3 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Avg. Profit</p>
                        <p className="text-2xl font-bold text-secondary">₹450</p>
                      </div>
                      <div className="bg-muted rounded-md p-3 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Avg. Loss</p>
                        <p className="text-2xl font-bold text-destructive">₹180</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-sm text-muted-foreground mb-1">Overall P/L</p>
                      <p className="text-2xl font-bold text-secondary">+₹2,450</p>
                      <div className="w-full bg-muted-foreground/20 rounded-full h-2 mt-2 overflow-hidden">
                        <div className="bg-secondary h-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
      
      <Notification 
        show={showNotification}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}