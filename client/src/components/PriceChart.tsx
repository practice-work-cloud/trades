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
  const [chartType, setChartType] = useState<string>('area');

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

    // More visually distinct colors
    const priceLineColor = '#4F46E5'; // Indigo-600
    const priceAreaColor = 'rgba(79, 70, 229, 0.2)'; // Indigo with transparency
    const buyPointColor = '#16A34A'; // Green-600
    const sellPointColor = '#DC2626'; // Red-600

    chartInstance.current = new Chart(ctx, {
      type: chartType === 'candle' ? 'bar' : 'line',
      data: {
        labels: times,
        datasets: [
          {
            label: 'Nifty 50 Price',
            data: prices,
            borderColor: priceLineColor,
            backgroundColor: chartType === 'area' ? priceAreaColor : 'transparent',
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 6,
            fill: chartType === 'area',
            tension: 0.3
          },
          {
            label: 'Buy Points',
            data: buyData,
            backgroundColor: buyPointColor,
            borderColor: 'white',
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false
          },
          {
            label: 'Sell Points',
            data: sellData,
            backgroundColor: sellPointColor,
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
            backgroundColor: '#1E293B', // Slate-800 for better contrast
            titleColor: '#FFFFFF',
            bodyColor: '#CBD5E1', // Slate-300
            titleFont: {
              family: 'Roboto',
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              family: 'Roboto Mono',
              size: 13
            },
            padding: 12,
            displayColors: false,
            borderColor: '#475569', // Slate-600
            borderWidth: 1,
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].label;
              },
              label: function(context) {
                const dataset = context.dataset;
                const value = context.raw as number;
                
                // Different labels based on dataset
                if (dataset.label === 'Buy Points') {
                  return `Buy: ${formatCurrency(value)}`;
                } else if (dataset.label === 'Sell Points') {
                  return `Sell: ${formatCurrency(value)}`;
                } else {
                  return `Price: ${formatCurrency(value)}`;
                }
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(203, 213, 225, 0.1)' // Subtle grid lines
            },
            ticks: {
              color: '#94A3B8', // Slate-400 for better visibility
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
              font: {
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(203, 213, 225, 0.1)' // Subtle grid lines
            },
            ticks: {
              color: '#94A3B8', // Slate-400 for better visibility
              callback: function(value) {
                return formatCurrency(value as number);
              },
              font: {
                size: 11,
                family: 'Roboto Mono'
              }
            }
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        animation: {
          duration: 800
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
    <div className="rounded border border-border bg-card shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Nifty 50 Price Chart</h3>
        <div className="flex space-x-2">
          <Button 
            variant={timeframe === '1D' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeframeChange('1D')}
          >
            1D
          </Button>
          <Button 
            variant={timeframe === '1W' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeframeChange('1W')}
          >
            1W
          </Button>
          <Button 
            variant={timeframe === '1M' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeframeChange('1M')}
          >
            1M
          </Button>
          <Button 
            variant={timeframe === 'YTD' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleTimeframeChange('YTD')}
          >
            YTD
          </Button>
        </div>
      </div>
      
      <div className="chart-container" style={{ height: '350px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
      
      <div className="flex justify-between mt-5 pt-2 border-t border-border">
        <div className="flex space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Price</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Buy Points</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Sell Points</span>
          </div>
        </div>
        <div>
          <Select value={chartType} onValueChange={handleChartTypeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="candle">Candlestick</SelectItem>
              <SelectItem value="area">Area</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
