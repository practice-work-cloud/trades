import { useState, useEffect, useCallback } from 'react';
import { MarketDataMessage } from '@/types/market';
import { staticMarketData } from '@/data/staticData';

interface UseWebSocketOptions {
  onMessage?: (data: MarketDataMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

// This is a completely static version with no actual WebSocket connection
export function useWebSocket({
  onMessage,
  onConnect
}: UseWebSocketOptions = {}) {
  // Always connected in the static version
  const [isConnected] = useState(true);

  // Simulate connection and initial data on mount
  useEffect(() => {
    // Simulate connection established
    if (onConnect) {
      onConnect();
    }

    // Send initial market data
    if (onMessage) {
      onMessage({
        type: 'marketData',
        data: staticMarketData
      });
    }
  }, [onMessage, onConnect]);

  // Dummy function for API compatibility
  const sendMessage = useCallback((data: any) => {
    console.log('Static mode: Message would be sent', data);
    
    // Simulate responses based on message type
    if (data.type === 'subscribe') {
      // Simulate a subscription response
      setTimeout(() => {
        onMessage?.({
          type: 'marketData',
          data: staticMarketData
        });
      }, 100);
    }
  }, [onMessage]);

  // Dummy functions for API compatibility
  const connect = useCallback(() => {
    // Do nothing in static mode
    console.log('Static mode: Would connect to WebSocket');
  }, []);

  const disconnect = useCallback(() => {
    // Do nothing in static mode
    console.log('Static mode: Would disconnect from WebSocket');
  }, []);

  return {
    isConnected,
    sendMessage,
    connect,
    disconnect
  };
}
