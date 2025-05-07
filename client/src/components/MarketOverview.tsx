import { useMarketContext } from "@/contexts/MarketContext";
import { formatCurrency, formatPercentage, formatDateTime } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MarketOverviewProps {
  lastUpdated: Date | null;
}

export default function MarketOverview({ lastUpdated }: MarketOverviewProps) {
  const { marketData } = useMarketContext();
  
  const formattedLastUpdated = lastUpdated ? formatDateTime(lastUpdated) : 'Not available';
  
  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Market Overview</h2>
        <div className="flex items-center">
          <span className="text-muted-foreground mr-2">Last Updated:</span>
          <span className="font-mono text-sm">{formattedLastUpdated}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="grid-cell p-4">
          <div className="text-muted-foreground text-sm mb-1">Nifty 50</div>
          <div className="flex items-end">
            <div className="text-2xl font-medium mr-2 font-mono">
              {marketData ? formatCurrency(marketData.ltp) : '—'}
            </div>
            {marketData && (
              <div className={`flex items-center ${marketData.change >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                {marketData.change >= 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{formatPercentage(marketData.change)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid-cell p-4">
          <div className="text-muted-foreground text-sm mb-1">Day Range</div>
          <div className="font-mono text-lg">
            {marketData ? `${formatCurrency(marketData.low)} - ${formatCurrency(marketData.high)}` : '—'}
          </div>
          {marketData && (
            <div className="w-full bg-muted h-1 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full" 
                style={{ 
                  width: `${((marketData.ltp - marketData.low) / (marketData.high - marketData.low)) * 100}%` 
                }}
              ></div>
            </div>
          )}
        </div>
        
        <div className="grid-cell p-4">
          <div className="text-muted-foreground text-sm mb-1">Volume</div>
          <div className="font-mono text-lg">
            {marketData ? `${(marketData.volume / 1000000).toFixed(2)}M` : '—'}
          </div>
          {marketData && (
            <div className="text-muted-foreground text-xs mt-1">
              {formatPercentage(marketData.volumeChange)} vs avg
            </div>
          )}
        </div>
        
        <div className="grid-cell p-4">
          <div className="text-muted-foreground text-sm mb-1">Market Status</div>
          <div className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${marketData?.isMarketOpen ? 'bg-secondary' : 'bg-destructive'}`}></span>
            <span className="font-medium">{marketData?.isMarketOpen ? 'Open' : 'Closed'}</span>
            {marketData?.isMarketOpen && marketData.timeRemaining && (
              <span className="text-muted-foreground ml-2 text-sm">{marketData.timeRemaining} left</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
