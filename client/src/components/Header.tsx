import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { RefreshCw, User, BarChart3, Settings, History, Activity, BookOpenCheck } from "lucide-react";
import { useMarketContext } from "@/contexts/MarketContext";

interface HeaderProps {
  isConnected: boolean;
}

export default function Header({ isConnected }: HeaderProps) {
  const { refreshData } = useMarketContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [location] = useLocation();
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  const handleRefresh = () => {
    refreshData();
  };

  const isActive = (path: string) => {
    return location === path ? "bg-primary/10 text-primary" : "hover:bg-muted";
  };
  
  return (
    <header className="flex flex-col bg-card shadow-md">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-10 w-10 mr-4 fill-primary">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
          <h1 className="text-xl font-medium text-foreground">Upstox Trading Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-muted rounded-full px-3 py-1">
            <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-secondary' : 'bg-destructive'} mr-2 animate-pulse`}></span>
            <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          
          <Button 
            variant="default" 
            onClick={handleRefresh}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            <span>Refresh</span>
          </Button>
          
          <div className="relative">
            <Button variant="ghost" size="icon" className="rounded-full bg-muted" onClick={toggleUserMenu}>
              <User className="h-5 w-5" />
            </Button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card shadow-lg rounded-md p-2 z-10">
                <div className="px-4 py-2 text-sm text-muted-foreground">Account settings</div>
                <div className="px-4 py-2 text-sm hover:bg-muted rounded-md cursor-pointer">Profile</div>
                <div className="px-4 py-2 text-sm hover:bg-muted rounded-md cursor-pointer">Preferences</div>
                <div className="px-4 py-2 text-sm hover:bg-muted rounded-md cursor-pointer">Logout</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex px-6 py-2 border-t border-border overflow-x-auto">
        <ul className="flex space-x-1">
          <li>
            <Link href="/" className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${isActive("/")}`}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/auto-trading" className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${isActive("/auto-trading")}`}>
              <Activity className="h-4 w-4 mr-2" />
              Auto Trading
            </Link>
          </li>
          <li>
            <Link href="/order-history" className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${isActive("/order-history")}`}>
              <History className="h-4 w-4 mr-2" />
              Order History
            </Link>
          </li>
          <li>
            <Link href="/trading-strategies" className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${isActive("/trading-strategies")}`}>
              <BookOpenCheck className="h-4 w-4 mr-2" />
              Trading Strategies
            </Link>
          </li>
          <li>
            <Link href="/settings" className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${isActive("/settings")}`}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
