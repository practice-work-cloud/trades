import { useState, useRef, useEffect } from "react";
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
import { OrderType, OrderStatus, Order } from "@/types/order";
import { Calendar, Filter, Download, Printer, BarChart4, FileSpreadsheet } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import Chart from 'chart.js/auto';

// Order activity chart component
function OrderActivityChart({ orders }: { orders: Order[] }) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Group the orders by date
    const ordersByDate = orders.reduce((acc, order) => {
      const date = formatDate(new Date(order.timestamp));
      
      if (!acc[date]) {
        acc[date] = {
          buy: 0,
          sell: 0,
          buyValue: 0,
          sellValue: 0
        };
      }
      
      if (order.type === OrderType.BUY) {
        acc[date].buy += 1;
        acc[date].buyValue += order.price * order.quantity;
      } else {
        acc[date].sell += 1;
        acc[date].sellValue += order.price * order.quantity;
      }
      
      return acc;
    }, {} as Record<string, { buy: number; sell: number; buyValue: number; sellValue: number }>);
    
    // Sort the dates
    const dates = Object.keys(ordersByDate).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    
    // Prepare data for chart
    const buyOrders = dates.map(date => ordersByDate[date].buy);
    const sellOrders = dates.map(date => ordersByDate[date].sell);
    const buyValues = dates.map(date => ordersByDate[date].buyValue);
    const sellValues = dates.map(date => ordersByDate[date].sellValue);
    const profitLoss = dates.map((date, index) => {
      // Calculate cumulative P/L up to this date
      let totalBuy = 0;
      let totalSell = 0;
      
      for (let i = 0; i <= index; i++) {
        totalBuy += ordersByDate[dates[i]].buyValue;
        totalSell += ordersByDate[dates[i]].sellValue;
      }
      
      return totalSell - totalBuy;
    });
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d')!;
    
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Buy Orders',
            data: buyOrders,
            backgroundColor: 'rgba(22, 163, 74, 0.6)', // green
            borderColor: 'rgb(22, 163, 74)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Sell Orders',
            data: sellOrders,
            backgroundColor: 'rgba(220, 38, 38, 0.6)', // red
            borderColor: 'rgb(220, 38, 38)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'P/L',
            data: profitLoss,
            type: 'line',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            borderColor: 'rgb(79, 70, 229)',
            borderWidth: 2,
            fill: false,
            yAxisID: 'y1',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#1E293B',
            titleColor: '#FFFFFF',
            bodyColor: '#CBD5E1',
            titleFont: {
              family: 'Roboto',
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              family: 'Roboto Mono',
              size: 12
            },
            padding: 12,
            borderColor: '#475569',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                let value = context.raw as number;
                
                if (label === 'P/L') {
                  return `${label}: ${formatCurrency(value)}`;
                } else {
                  return `${label}: ${value}`;
                }
              }
            }
          },
          legend: {
            position: 'top',
            labels: {
              font: {
                family: 'Roboto',
                size: 12
              },
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94A3B8',
              font: {
                size: 11
              }
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
              color: 'rgba(203, 213, 225, 0.1)'
            },
            ticks: {
              color: '#94A3B8',
              font: {
                size: 11
              }
            },
            title: {
              display: true,
              text: 'Order Count',
              color: '#94A3B8',
              font: {
                size: 12
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              color: '#4F46E5',
              font: {
                size: 11,
                family: 'Roboto Mono'
              },
              callback: function(value) {
                return formatCurrency(value as number);
              }
            },
            title: {
              display: true,
              text: 'Profit/Loss',
              color: '#4F46E5',
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [orders]);
  
  if (orders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30 rounded-md">
        <div className="text-center">
          <BarChart4 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No orders found to display in chart</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

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
                  ? `${Math.round(completedOrders.filter(order => 
                      order.type === OrderType.SELL && 
                      (order.profit !== null && order.profit > 0)
                    ).length / completedOrders.filter(order => order.type === OrderType.SELL).length * 100)}%` 
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
                              <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                                order.type === OrderType.BUY ? 'bg-green-100 text-green-800 border border-green-600' : 'bg-red-100 text-red-800 border border-red-600'
                              }`}>
                                {order.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{order.instrument}</td>
                            <td className="px-4 py-3 text-sm font-mono">{formatCurrency(order.price)}</td>
                            <td className="px-4 py-3 text-sm">{order.quantity}</td>
                            <td className="px-4 py-3 text-sm font-mono">{formatCurrency(order.price * order.quantity)}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                                order.status === OrderStatus.COMPLETED ? 'bg-blue-100 text-blue-800 border border-blue-600' :
                                order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800 border border-yellow-500' :
                                'bg-gray-100 text-gray-800 border border-gray-500'
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
                <div className="h-96">
                  <OrderActivityChart orders={filteredOrders} />
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