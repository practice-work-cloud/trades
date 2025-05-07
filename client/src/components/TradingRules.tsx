import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMarketContext } from "@/contexts/MarketContext";
import { Save, Play, RotateCcw, Square, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tradingRulesSchema = z.object({
  targetPrice: z.coerce.number().positive("Target price must be positive"),
  takeProfit: z.coerce.number().positive("Take profit must be positive"),
  stopLoss: z.coerce.number().positive("Stop loss must be positive"),
  autoExecute: z.boolean().default(true),
});

type TradingRulesValues = z.infer<typeof tradingRulesSchema>;

interface TradingRulesProps {
  onSave: () => void;
}

export default function TradingRules({ onSave }: TradingRulesProps) {
  const { 
    marketData, 
    setTradingRules, 
    runSimulation, 
    stopSimulation,
    resetSimulation, 
    isSimulationRunning 
  } = useMarketContext();
  
  const [strategy, setStrategy] = useState<"targetPrice" | "movingAverage">("targetPrice");
  
  const currentPrice = marketData?.ltp || 24414.4;
  
  const form = useForm<TradingRulesValues>({
    resolver: zodResolver(tradingRulesSchema),
    defaultValues: {
      targetPrice: 24600,
      takeProfit: 24700,
      stopLoss: 24500,
      autoExecute: true,
    },
  });
  
  const targetPrice = form.watch("targetPrice");
  const takeProfit = form.watch("takeProfit");
  const stopLoss = form.watch("stopLoss");
  
  const takeProfitPercentage = ((takeProfit - targetPrice) / targetPrice) * 100;
  const stopLossPercentage = ((stopLoss - targetPrice) / targetPrice) * 100;
  
  const handleStrategyChange = (newStrategy: "targetPrice" | "movingAverage") => {
    setStrategy(newStrategy);
  };
  
  const handleSubmit = (values: TradingRulesValues) => {
    setTradingRules({
      targetPrice: values.targetPrice,
      takeProfit: values.takeProfit,
      stopLoss: values.stopLoss,
      autoExecute: values.autoExecute,
      strategy: strategy,
    });
    onSave();
  };
  
  // Check for valid trading rule configuration
  const isProfitAboveTarget = takeProfit > targetPrice;
  const isLossBelowTarget = stopLoss < targetPrice;
  const isValidConfig = isProfitAboveTarget && isLossBelowTarget;
  
  return (
    <div className="rounded border border-border bg-card shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">Trading Rules</h3>
      
      <div className="mb-6">
        <label className="block text-muted-foreground text-sm mb-2">Strategy</label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={strategy === "targetPrice" ? "default" : "outline"}
            onClick={() => handleStrategyChange("targetPrice")}
          >
            Target Price
          </Button>
          <Button
            variant={strategy === "movingAverage" ? "default" : "outline"}
            onClick={() => handleStrategyChange("movingAverage")}
            disabled
          >
            Moving Avg
          </Button>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="targetPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-sm">Target Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    {...field} 
                    className="bg-muted border border-input text-foreground font-mono"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  Current: {formatCurrency(currentPrice)} {targetPrice > currentPrice ? '(Buy when price rises)' : '(Buy when price falls)'}
                </p>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="takeProfit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-sm">
                  Take Profit (₹)
                  {!isProfitAboveTarget && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="h-4 w-4 text-yellow-500 inline ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Take profit should be higher than target price</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    {...field} 
                    className={`bg-muted border border-input text-foreground font-mono ${!isProfitAboveTarget ? 'border-yellow-500' : ''}`}
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{Math.abs(takeProfitPercentage).toFixed(2)}% from target</span>
                  <span className="text-green-600 font-medium">+{formatCurrency(Math.abs(takeProfit - targetPrice))} potential</span>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stopLoss"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-sm">
                  Stop Loss (₹)
                  {!isLossBelowTarget && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="h-4 w-4 text-yellow-500 inline ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Stop loss should be lower than target price</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    {...field} 
                    className={`bg-muted border border-input text-foreground font-mono ${!isLossBelowTarget ? 'border-yellow-500' : ''}`}
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{Math.abs(stopLossPercentage).toFixed(2)}% from target</span>
                  <span className="text-red-600 font-medium">-{formatCurrency(Math.abs(stopLoss - targetPrice))} protection</span>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="autoExecute"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Auto-execute orders</FormLabel>
                  <p className="text-xs text-muted-foreground">Execute orders when conditions are met</p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-secondary text-secondary-foreground"
            disabled={isSimulationRunning}
          >
            <Save className="mr-2 h-4 w-4" /> Save Rules
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium mb-2">Simulation Controls</h4>
        {!isValidConfig && (
          <p className="text-yellow-500 text-xs mb-2 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Check rules configuration before running simulation
          </p>
        )}
        <div className="grid grid-cols-3 gap-2">
          {!isSimulationRunning ? (
            <Button 
              variant="default" 
              className="col-span-2" 
              onClick={runSimulation}
              disabled={!isValidConfig}
            >
              <Play className="mr-2 h-4 w-4" /> Run Simulation
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              className="col-span-2" 
              onClick={stopSimulation}
            >
              <Square className="mr-2 h-4 w-4" /> Stop Simulation
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={resetSimulation}
            disabled={isSimulationRunning}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
