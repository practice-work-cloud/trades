import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMarketContext } from "@/contexts/MarketContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Calendar, BarChart2, TrendingUp, Activity, Percent, Bookmark, Save, PlusCircle } from "lucide-react";
import Notification from "@/components/Notification";
import { formatCurrency } from "@/lib/utils";

const strategies = [
  {
    id: "target-price",
    name: "Target Price Strategy",
    description: "Buy when price reaches a certain level, then sell when take-profit or stop-loss is triggered.",
    icon: <BarChart className="h-5 w-5" />,
    difficulty: "Beginner",
    performance: "Medium",
    category: "Price Action",
  },
  {
    id: "moving-average",
    name: "Moving Average Crossover",
    description: "Buy when fast MA crosses above slow MA, sell when it crosses below.",
    icon: <TrendingUp className="h-5 w-5" />,
    difficulty: "Intermediate",
    performance: "Medium",
    category: "Technical",
  },
  {
    id: "rsi",
    name: "RSI Overbought/Oversold",
    description: "Buy when RSI is below 30 (oversold), sell when above 70 (overbought).",
    icon: <Activity className="h-5 w-5" />,
    difficulty: "Intermediate",
    performance: "Medium-High",
    category: "Technical",
  },
  {
    id: "breakout",
    name: "Breakout Strategy",
    description: "Buy when price breaks above resistance, sell when it breaks below support.",
    icon: <BarChart2 className="h-5 w-5" />,
    difficulty: "Advanced",
    performance: "High",
    category: "Price Action",
  },
];

export default function TradingStrategies() {
  const { isConnected, marketData } = useMarketContext();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [selectedStrategy, setSelectedStrategy] = useState<string>("target-price");
  
  const handleSaveStrategy = () => {
    setNotificationMessage("Strategy saved successfully!");
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  
  const handleBacktest = () => {
    setNotificationMessage("Backtesting started for the selected strategy");
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header isConnected={isConnected} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Trading Strategies</h2>
          <p className="text-muted-foreground">Configure and test various trading strategies</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Available Strategies</CardTitle>
                <CardDescription>Select a strategy to configure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {strategies.map((strategy) => (
                  <div 
                    key={strategy.id}
                    className={`p-3 rounded-md cursor-pointer border ${
                      selectedStrategy === strategy.id 
                        ? "border-primary bg-primary/5" 
                        : "border-transparent hover:border-muted hover:bg-muted/30"
                    }`}
                    onClick={() => setSelectedStrategy(strategy.id)}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md mr-3 ${
                        selectedStrategy === strategy.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                        {strategy.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{strategy.name}</h4>
                        <p className="text-xs text-muted-foreground">{strategy.category} · {strategy.difficulty}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border border-dashed border-muted p-3 rounded-md cursor-pointer hover:bg-muted/20 mt-4">
                  <div className="flex items-center justify-center text-muted-foreground">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    <span>Add Custom Strategy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Configuration</CardTitle>
                <CardDescription>
                  {strategies.find(s => s.id === selectedStrategy)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="parameters">
                  <TabsList className="mb-4">
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                    <TabsTrigger value="backtest">Backtest</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="parameters" className="space-y-4">
                    {selectedStrategy === "target-price" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Current Price</label>
                            <Input 
                              type="text" 
                              value={marketData?.ltp ? formatCurrency(marketData.ltp) : "₹24,414.40"} 
                              disabled 
                              className="font-mono bg-muted" 
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Target Price</label>
                            <Input type="number" defaultValue="24500" className="font-mono" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Take Profit</label>
                            <Input type="number" defaultValue="25000" className="font-mono" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Stop Loss</label>
                            <Input type="number" defaultValue="24000" className="font-mono" />
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 rounded-md bg-muted mt-4">
                          <div>
                            <label className="text-sm font-medium">Auto-Execute Trades</label>
                            <p className="text-xs text-muted-foreground">Allow strategy to execute trades automatically</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <Accordion type="single" collapsible className="mt-4">
                          <AccordionItem value="advanced">
                            <AccordionTrigger>Advanced Options</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 pt-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium mb-1.5 block">Order Size</label>
                                    <Select defaultValue="1">
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select order size" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">1 Contract</SelectItem>
                                        <SelectItem value="2">2 Contracts</SelectItem>
                                        <SelectItem value="5">5 Contracts</SelectItem>
                                        <SelectItem value="10">10 Contracts</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-1.5 block">Max Orders</label>
                                    <Input type="number" defaultValue="5" />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium mb-1.5 block">Trigger Condition</label>
                                  <Select defaultValue="single">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="single">Single Price Touch</SelectItem>
                                      <SelectItem value="multiple">Multiple Confirmations</SelectItem>
                                      <SelectItem value="time">Time-based Confirmation</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </>
                    )}
                    
                    {selectedStrategy === "moving-average" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Fast MA Period</label>
                            <Input type="number" defaultValue="9" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Slow MA Period</label>
                            <Input type="number" defaultValue="21" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">MA Type</label>
                            <Select defaultValue="ema">
                              <SelectTrigger>
                                <SelectValue placeholder="Select MA type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sma">Simple (SMA)</SelectItem>
                                <SelectItem value="ema">Exponential (EMA)</SelectItem>
                                <SelectItem value="wma">Weighted (WMA)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Data Timeframe</label>
                            <Select defaultValue="15min">
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5min">5 Minutes</SelectItem>
                                <SelectItem value="15min">15 Minutes</SelectItem>
                                <SelectItem value="1hour">1 Hour</SelectItem>
                                <SelectItem value="1day">1 Day</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 rounded-md bg-muted mt-4">
                          <div>
                            <label className="text-sm font-medium">Auto-Execute Trades</label>
                            <p className="text-xs text-muted-foreground">Allow strategy to execute trades automatically</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </>
                    )}
                    
                    {selectedStrategy === "rsi" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">RSI Period</label>
                            <Input type="number" defaultValue="14" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Oversold Level</label>
                            <Input type="number" defaultValue="30" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Overbought Level</label>
                            <Input type="number" defaultValue="70" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Data Timeframe</label>
                            <Select defaultValue="15min">
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5min">5 Minutes</SelectItem>
                                <SelectItem value="15min">15 Minutes</SelectItem>
                                <SelectItem value="1hour">1 Hour</SelectItem>
                                <SelectItem value="1day">1 Day</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 rounded-md bg-muted mt-4">
                          <div>
                            <label className="text-sm font-medium">Auto-Execute Trades</label>
                            <p className="text-xs text-muted-foreground">Allow strategy to execute trades automatically</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </>
                    )}
                    
                    {selectedStrategy === "breakout" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Support Level</label>
                            <Input type="number" defaultValue="24000" className="font-mono" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Resistance Level</label>
                            <Input type="number" defaultValue="24800" className="font-mono" />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Confirmation Period</label>
                            <Input type="number" defaultValue="3" />
                            <p className="text-xs text-muted-foreground mt-1">Consecutive candles above/below level</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Data Timeframe</label>
                            <Select defaultValue="15min">
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5min">5 Minutes</SelectItem>
                                <SelectItem value="15min">15 Minutes</SelectItem>
                                <SelectItem value="1hour">1 Hour</SelectItem>
                                <SelectItem value="1day">1 Day</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 rounded-md bg-muted mt-4">
                          <div>
                            <label className="text-sm font-medium">Auto-Execute Trades</label>
                            <p className="text-xs text-muted-foreground">Allow strategy to execute trades automatically</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="backtest">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Start Date</label>
                        <div className="flex">
                          <Input type="date" defaultValue="2023-01-01" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">End Date</label>
                        <div className="flex">
                          <Input type="date" defaultValue="2023-12-31" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="text-sm font-medium mb-1.5 block">Data Source</label>
                      <Select defaultValue="nifty">
                        <SelectTrigger>
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nifty">NIFTY 50</SelectItem>
                          <SelectItem value="banknifty">BANK NIFTY</SelectItem>
                          <SelectItem value="sensex">SENSEX</SelectItem>
                          <SelectItem value="custom">Custom Dataset</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      className="mt-6" 
                      variant="default" 
                      onClick={handleBacktest}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Run Backtest
                    </Button>
                    
                    <div className="mt-8 p-4 bg-muted/30 rounded-md">
                      <h4 className="font-medium mb-4">Backtest Results</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-card p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Total Return</p>
                          <p className="text-xl font-bold text-secondary">+27.8%</p>
                        </div>
                        <div className="bg-card p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Win Rate</p>
                          <p className="text-xl font-bold">68%</p>
                        </div>
                        <div className="bg-card p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Profit Factor</p>
                          <p className="text-xl font-bold">2.3</p>
                        </div>
                        <div className="bg-card p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                          <p className="text-xl font-bold">1.7</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 h-60 bg-card rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Equity curve and performance chart</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="performance">
                    <div className="bg-muted/30 p-4 rounded-md">
                      <h4 className="font-medium mb-4">Strategy Performance Metrics</h4>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-card p-3 rounded-md">
                          <div className="flex justify-between mb-2">
                            <p className="text-sm font-medium">Annual Return</p>
                            <p className="text-sm font-bold text-secondary">21.4%</p>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div className="bg-secondary h-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-card p-3 rounded-md">
                          <div className="flex justify-between mb-2">
                            <p className="text-sm font-medium">Max Drawdown</p>
                            <p className="text-sm font-bold text-destructive">-12.8%</p>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div className="bg-destructive h-full" style={{ width: '36%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-card p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Win Rate</p>
                          <p className="text-lg font-bold">67.3%</p>
                        </div>
                        <div className="bg-card p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Avg Win</p>
                          <p className="text-lg font-bold text-secondary">₹850</p>
                        </div>
                        <div className="bg-card p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Avg Loss</p>
                          <p className="text-lg font-bold text-destructive">₹390</p>
                        </div>
                        <div className="bg-card p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Total Trades</p>
                          <p className="text-lg font-bold">152</p>
                        </div>
                        <div className="bg-card p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Avg Hold Time</p>
                          <p className="text-lg font-bold">4.2 days</p>
                        </div>
                        <div className="bg-card p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Profit Factor</p>
                          <p className="text-lg font-bold">2.1</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 h-60 bg-card rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Monthly returns visualization</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
                <Button variant="default" onClick={handleSaveStrategy}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Strategy
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
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