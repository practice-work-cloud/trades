import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMarketContext } from "@/contexts/MarketContext";
import { Save, Play, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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
  const { marketData, setTradingRules, runSimulation, resetSimulation } = useMarketContext();
  const [strategy, setStrategy] = useState<"targetPrice" | "movingAverage">("targetPrice");
  
  const currentPrice = marketData?.ltp || 24414.4;
  
  const form = useForm<TradingRulesValues>({
    resolver: zodResolver(tradingRulesSchema),
    defaultValues: {
      targetPrice: 24500,
      takeProfit: 25000,
      stopLoss: 23500,
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
  
  return (
    <>
      <h3 className="text-lg font-medium mb-4">Trading Rules</h3>
      
      <div className="mb-6">
        <label className="block text-muted-foreground text-sm mb-2">Strategy</label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={strategy === "targetPrice" ? "default" : "secondary"}
            onClick={() => handleStrategyChange("targetPrice")}
          >
            Target Price
          </Button>
          <Button
            variant={strategy === "movingAverage" ? "default" : "secondary"}
            onClick={() => handleStrategyChange("movingAverage")}
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
                  Current: {formatCurrency(currentPrice)}
                </p>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="takeProfit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-sm">Take Profit (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    {...field} 
                    className="bg-muted border border-input text-foreground font-mono"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{takeProfitPercentage.toFixed(2)}% from target</span>
                  <span>+{formatCurrency(takeProfit - targetPrice)} potential</span>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stopLoss"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-sm">Stop Loss (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    {...field} 
                    className="bg-muted border border-input text-foreground font-mono"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{stopLossPercentage.toFixed(2)}% from target</span>
                  <span>{formatCurrency(stopLoss - targetPrice)} protection</span>
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
          
          <Button type="submit" className="w-full bg-secondary text-secondary-foreground">
            <Save className="mr-2 h-4 w-4" /> Save Rules
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium mb-2">Simulation Controls</h4>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1" onClick={runSimulation}>
            <Play className="mr-2 h-4 w-4" /> Run
          </Button>
          <Button variant="outline" className="flex-1" onClick={resetSimulation}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
    </>
  );
}
