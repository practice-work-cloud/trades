import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import { MarketProvider } from "@/contexts/MarketContext";
// Importing pages directly with relative paths to avoid TypeScript module resolution issues
import AutoTrading from "./pages/AutoTrading";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import TradingStrategies from "./pages/TradingStrategies";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/auto-trading" component={AutoTrading} />
      <Route path="/order-history" component={OrderHistoryPage} />
      <Route path="/trading-strategies" component={TradingStrategies} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MarketProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </MarketProvider>
    </QueryClientProvider>
  );
}

export default App;
