import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMarketContext } from "@/contexts/MarketContext";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
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
      "Time,Type,Instrument,Price,Quantity,Status,Trigger\n" +
      orders.map(order => {
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
  
  const getOrderTypeStyle = (type: OrderType) => {
    return type === OrderType.BUY
      ? "bg-secondary bg-opacity-20 text-secondary"
      : "bg-destructive bg-opacity-20 text-destructive";
  };
  
  const getOrderStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "bg-primary bg-opacity-20 text-primary";
      case OrderStatus.PENDING:
        return "bg-yellow-500 bg-opacity-20 text-yellow-500";
      case OrderStatus.CANCELLED:
        return "bg-gray-500 bg-opacity-20 text-gray-500";
      default:
        return "bg-primary bg-opacity-20 text-primary";
    }
  };
  
  return (
    <section className="mt-6 grid-cell p-4">
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
            <tr className="border-b border-muted">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Instrument</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Trigger</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <tr key={index} className="border-b border-muted hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-mono">
                    {new Date(order.timestamp).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderTypeStyle(order.type)}`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.instrument}</td>
                  <td className="px-4 py-3 text-sm font-mono">{formatCurrency(order.price)}</td>
                  <td className="px-4 py-3 text-sm">{order.quantity}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{order.trigger}</td>
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
