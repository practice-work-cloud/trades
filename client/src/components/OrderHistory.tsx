import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMarketContext } from "@/contexts/MarketContext";
import { Download, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";
import { OrderType, OrderStatus } from "@/types/order";
import { formatCurrency } from "@/lib/utils";

export default function OrderHistory() {
  const { orders } = useMarketContext();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  
  const handleExport = () => {
    // In a real app, this would export orders to CSV
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Time,Type,Instrument,Price,Quantity,Status,Trigger,Profit/Loss\n" +
      orders.map(order => {
        return `${order.timestamp},${order.type},${order.instrument},${order.price},${order.quantity},${order.status},${order.trigger},${order.profit || ''}`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `order_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
  };
  
  const getOrderTypeStyle = (type: OrderType) => {
    return type === OrderType.BUY
      ? "bg-green-100 text-green-800 border border-green-600 font-semibold"
      : "bg-red-100 text-red-800 border border-red-600 font-semibold";
  };
  
  const getOrderStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "bg-blue-100 text-blue-800 border border-blue-600 font-semibold";
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border border-yellow-500 font-semibold";
      case OrderStatus.CANCELLED:
        return "bg-gray-100 text-gray-800 border border-gray-500 font-semibold";
      default:
        return "bg-blue-100 text-blue-800 border border-blue-600 font-semibold";
    }
  };
  
  const getProfitLossStyle = (profit: number | null) => {
    if (profit === null) return "";
    return profit > 0 
      ? "text-green-600 font-medium" 
      : profit < 0 
        ? "text-red-600 font-medium" 
        : "text-gray-400";
  };
  
  return (
    <section className="mt-6 grid-cell p-4 rounded border border-border bg-card shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Order History</h3>
        <Button variant="ghost" className="text-primary" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" />
          <span>Export</span>
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-muted bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Instrument</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Trigger</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <tr key={index} className="border-b border-muted hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-mono">
                    {new Date(order.timestamp).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${getOrderTypeStyle(order.type)}`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.instrument}</td>
                  <td className="px-4 py-3 text-sm font-mono font-medium">{formatCurrency(order.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${getOrderStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.trigger}</td>
                  <td className={`px-4 py-3 text-sm font-mono ${getProfitLossStyle(order.profit)}`}>
                    {order.profit !== null ? (
                      <div className="flex items-center">
                        {order.profit > 0 ? <ArrowUp className="h-3 w-3 mr-1 text-green-600" /> : 
                         order.profit < 0 ? <ArrowDown className="h-3 w-3 mr-1 text-red-600" /> : null}
                        {formatCurrency(Math.abs(order.profit))}
                      </div>
                    ) : '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  No orders found. Start trading to see your order history.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
        <div>Showing {currentOrders.length} of {orders.length} orders</div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline" 
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>Page {currentPage} of {Math.max(totalPages, 1)}</span>
          <Button
            variant="outline" 
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
