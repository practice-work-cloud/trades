import { useState, useEffect } from "react";
import Header from "@/components/Header";
import MarketOverview from "@/components/MarketOverview";
import PriceChart from "@/components/PriceChart";
import TradingRules from "@/components/TradingRules";
import OrderHistory from "@/components/OrderHistory";
import Footer from "@/components/Footer";
import Notification from "@/components/Notification";
import { useMarketContext } from "@/contexts/MarketContext";

export default function Dashboard() {
  const { isConnected, lastUpdated } = useMarketContext();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  
  const handleRulesSave = () => {
    setNotificationMessage("Trading rules updated successfully!");
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isConnected={isConnected} />
      
      <main className="flex-1 p-6 overflow-auto">
        <MarketOverview lastUpdated={lastUpdated} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <section className="lg:col-span-2 grid-cell p-4">
            <PriceChart />
          </section>
          
          <section className="grid-cell p-4">
            <TradingRules onSave={handleRulesSave} />
          </section>
        </div>
        
        <OrderHistory />
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
