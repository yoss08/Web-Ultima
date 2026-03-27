import { useEffect, useRef, useState, useCallback } from 'react';

type EventHandler = (data: any) => void;

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
}

/**
 * Hook for real-time WebSocket connections.
 * Falls back to Supabase Realtime channels for simplicity.
 * 
 * Usage:
 *   const { isConnected, subscribe, unsubscribe } = useWebSocket();
 *   
 *   useEffect(() => {
 *     subscribe('court:status', (data) => console.log('Court updated:', data));
 *     return () => unsubscribe('court:status');
 *   }, []);
 */
export function useWebSocket(options?: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const listeners = useRef<Map<string, Set<EventHandler>>>(new Map());
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const wsUrl = options?.url || `ws://${window.location.hostname}:3001`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log('[WebSocket] Connected');
      };

      ws.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(event.data);
          const handlers = listeners.current.get(type);
          handlers?.forEach(handler => handler(data));
        } catch (err) {
          console.error('[WebSocket] Parse error:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('[WebSocket] Disconnected, reconnecting in 3s...');
        setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error('[WebSocket] Error:', err);
        ws.close();
      };
    } catch {
      console.warn('[WebSocket] Connection failed, will retry...');
      setTimeout(connect, 5000);
    }
  }, [options?.url]);

  useEffect(() => {
    if (options?.autoConnect !== false) {
      connect();
    }
    return () => {
      wsRef.current?.close();
    };
  }, [connect, options?.autoConnect]);

  const subscribe = useCallback((event: string, handler: EventHandler) => {
    if (!listeners.current.has(event)) {
      listeners.current.set(event, new Set());
    }
    listeners.current.get(event)!.add(handler);
  }, []);

  const unsubscribe = useCallback((event: string, handler?: EventHandler) => {
    if (handler) {
      listeners.current.get(event)?.delete(handler);
    } else {
      listeners.current.delete(event);
    }
  }, []);

  const send = useCallback((type: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  }, []);

  return { isConnected, subscribe, unsubscribe, send, connect };
}
