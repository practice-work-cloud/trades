import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderHistory from "@/components/OrderHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMarketContext } from "@/contexts/MarketContext";
import { OrderType, OrderStatus } from "@/types/order";
import { Calendar, Filter, Download, Printer, BarChart4, FileSpreadsheet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function OrderHistoryPage() {
  const { orders, isConnected } = useMarketContext();
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Processing the orders with filtering
  const filteredOrders = orders.filter(order => {
    let matchesOrderType = true;
    let matchesStatus = true;
    let matchesDate = true;
    
    if (orderTypeFilter !== "all") {
      matchesOrderType = order.type === orderTypeFilter;
    }
    
    if (statusFilter !== "all") {
      matchesStatus = order.status === statusFilter;
    }
    
    if (dateFilter !== "all") {
      const orderDate = new Date(order.timestamp);
      const now = new Date();
      
      if (dateFilter === "today") {
        matchesDate = orderDate.toDateString() === now.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesDate = orderDate >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        matchesDate = orderDate >= monthAgo;
      }
    }
    
    return matchesOrderType && matchesStatus && matchesDate;
  });
  
  // Calculate summary statistics
  const totalBuyOrders = filteredOrders.filter(order => order.type === OrderType.BUY).length;
  const totalSellOrders = filteredOrders.filter(order => order.type === OrderType.SELL).length;
  
  const completedOrders = filteredOrders.filter(order => order.status === OrderStatus.COMPLETED);
  const buyOrdersValue = completedOrders
    .filter(order => order.type === OrderType.BUY)
    .reduce((total, order) => total + (order.price * order.quantity), 0);
    
  const sellOrdersValue = completedOrders
    .filter(order => order.type === OrderType.SELL)
    .reduce((total, order) => total + (order.price * order.quantity), 0);
  
  const profitLoss = sellOrdersValue - buyOrdersValue;
  
  const handleExport = () => {
    // In a real app, this would export orders to CSV
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Time,Type,Instrument,Price,Quantity,Status,Trigger\n" +
      filteredOrders.map(order => {
        return `${order.timestamp},${order.type},${order.instrument},${order.price},${order.quantity},${order.status},${order.trigger}`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `order_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isConnected={isConnected} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Order History</h2>
          <p className="text-muted-foreground">View and analyze your historical trades</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredOrders.length}</div>
              <p className="text-muted-foreground text-sm mt-1">{totalBuyOrders} buys, {totalSellOrders} sells</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Executed Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(buyOrdersValue + sellOrdersValue)}</div>
              <p className="text-muted-foreground text-sm mt-1">Across {completedOrders.length} completed orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">P/L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${profitLoss >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                {formatCurrency(profitLoss)}
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                {profitLoss >= 0 ? 'Net profit' : 'Net loss'} from all trades
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {completedOrders.length > 0 
                  ? `${Math.round((profitLoss >= 0 ? completedOrders.length : 0) / completedOrders.length * 100)}%` 
                  : '0%'}
              </div>
              <p className="text-muted-foreground text-sm mt-1">Profitable orders</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and filter your trading activity</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <Label htmlFor="date-filter">Date Range</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger id="date-filter" className="mt-1.5">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="order-type-filter">Order Type</Label>
                <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
                  <SelectTrigger id="order-type-filter" className="mt-1.5">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value={OrderType.BUY}>Buy</SelectItem>
                    <SelectItem value={OrderType.SELL}>Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="mt-1.5">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value={OrderStatus.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="flex mt-1.5">
                  <Input id="search" placeholder="Search orders..." />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="table">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="chart">Chart View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-muted">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Instrument</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Trigger</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, index) => (
                          <tr key={index} className="border-b border-muted hover:bg-muted/50">
                            <td className="px-4 py-3 text-sm font-mono">
                              {new Date(order.timestamp).toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                order.type === OrderType.BUY ? 'bg-secondary bg-opacity-20 text-secondary' : 'bg-destructive bg-opacity-20 text-destructive'
                              }`}>
                                {order.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{order.instrument}</td>
                            <td className="px-4 py-3 text-sm font-mono">{formatCurrency(order.price)}</td>
                            <td className="px-4 py-3 text-sm">{order.quantity}</td>
                            <td className="px-4 py-3 text-sm font-mono">{formatCurrency(order.price * order.quantity)}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                order.status === OrderStatus.COMPLETED ? 'bg-primary bg-opacity-20 text-primary' :
                                order.status === OrderStatus.PENDING ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' :
                                'bg-gray-500 bg-opacity-20 text-gray-500'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{order.trigger}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                            No orders found with the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="chart">
                <div className="h-96 flex items-center justify-center bg-muted/30 rounded-md">
                  <div className="text-center">
                    <BarChart4 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Order activity visualization would appear here</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}