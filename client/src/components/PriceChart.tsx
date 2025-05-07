import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketContext } from '@/contexts/MarketContext';
import Chart from 'chart.js/auto';
import { OrderType } from '@/types/order';
import { formatCurrency } from '@/lib/utils';

export default function PriceChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { priceHistory, tradeExecutions } = useMarketContext();
  const [timeframe, setTimeframe] = useState<string>('1D');
  const [chartType, setChartType] = useState<string>('line');

  const createChart = () => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const times = priceHistory.map(point => new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const prices = priceHistory.map(point => point.price);

    // Create buy/sell annotations based on trade executions
    const buyPoints = tradeExecutions
      .filter(execution => execution.type === OrderType.BUY)
      .map(execution => {
        const index = priceHistory.findIndex(point => 
          new Date(point.timestamp).getTime() >= new Date(execution.timestamp).getTime()
        );
        return index >= 0 ? { index, price: execution.price } : null;
      })
      .filter(point => point !== null) as { index: number; price: number }[];

    const sellPoints = tradeExecutions
      .filter(execution => execution.type === OrderType.SELL)
      .map(execution => {
        const index = priceHistory.findIndex(point => 
          new Date(point.timestamp).getTime() >= new Date(execution.timestamp).getTime()
        );
        return index >= 0 ? { index, price: execution.price } : null;
      })
      .filter(point => point !== null) as { index: number; price: number }[];

    const buyData = Array(times.length).fill(null);
    buyPoints.forEach(point => {
      buyData[point.index] = point.price;
    });

    const sellData = Array(times.length).fill(null);
    sellPoints.forEach(point => {
      sellData[point.index] = point.price;
    });

    chartInstance.current = new Chart(ctx, {
      type: chartType === 'candle' ? 'bar' : chartType === 'area' ? 'line' : 'line',
      data: {
        labels: times,
        datasets: [
          {
            label: 'Nifty 50 Price',
            data: prices,
            borderColor: 'hsl(var(--primary))',
            backgroundColor: chartType === 'area' ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 6,
            fill: chartType === 'area',
            tension: 0.2
          },
          {
            label: 'Buy Points',
            data: buyData,
            backgroundColor: 'hsl(var(--secondary))',
            borderColor: 'white',
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false
          },
          {
            label: 'Sell Points',
            data: sellData,
            backgroundColor: 'hsl(var(--destructive))',
            borderColor: 'white',
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'hsl(var(--card))',
            titleColor: 'hsl(var(--foreground))',
            bodyColor: 'hsl(var(--muted-foreground))',
            titleFont: {
              family: 'Roboto',
              size: 14
            },
            bodyFont: {
              family: 'Roboto Mono',
              size: 12
            },
            padding: 12,
            displayColors: false,
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].label;
              },
              label: function(context) {
                return formatCurrency(context.raw as number);
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'hsl(var(--muted-foreground))',
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'hsl(var(--muted-foreground))',
              callback: function(value) {
                return formatCurrency(value as number);
              }
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        animation: {
          duration: 1000
        }
      }
    });
  };

  useEffect(() => {
    if (priceHistory.length > 0) {
      createChart();
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [priceHistory, tradeExecutions, timeframe, chartType]);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
    // In a real app, this would filter data for the selected timeframe
  };

  const handleChartTypeChange = (type: string) => {
    setChartType(type);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Nifty 50 Price Chart</h3>
        <div className="flex space-x-2">
          <Button 
            variant={timeframe === '1D' ? 'default' : 'secondary'} 
            size="sm"
            onClick={() => handleTimeframeChange('1D')}
          >
            1D
          </Button>
          <Button 
            variant={timeframe === '1W' ? 'default' : 'secondary'} 
            size="sm"
            onClick={() => handleTimeframeChange('1W')}
          >
            1W
          </Button>
          <Button 
            variant={timeframe === '1M' ? 'default' : 'secondary'} 
            size="sm"
            onClick={() => handleTimeframeChange('1M')}
          >
            1M
          </Button>
          <Button 
            variant={timeframe === 'YTD' ? 'default' : 'secondary'} 
            size="sm"
            onClick={() => handleTimeframeChange('YTD')}
          >
            YTD
          </Button>
        </div>
      </div>
      
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
      
      <div className="flex justify-between mt-4">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
            <span className="text-sm">Price</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
            <span className="text-sm">Buy Points</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-destructive rounded-full mr-2"></div>
            <span className="text-sm">Sell Points</span>
          </div>
        </div>
        <div>
          <Select value={chartType} onValueChange={handleChartTypeChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="candle">Candlestick</SelectItem>
              <SelectItem value="area">Area</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
