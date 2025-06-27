import { useEffect, useRef, useCallback } from 'react';

//
// PUBLIC_INTERFACE
// useWebSocket - Hook for managing WebSocket connection and messages
//
// Args:
//  url: string, WS endpoint (e.g., ws://localhost:3001/ws/games/<game_id>?player=<symbol>)
//  onMessage: function, called with message event.data (parsed JSON) on new event
// Returns: { sendMessage(data), close() }
//
export function useWebSocket(url, onMessage) {
  const wsRef = useRef(null);

  // PUBLIC_INTERFACE
  // Send data over ws connection
  const sendMessage = useCallback(
    data => {
      if (wsRef.current && wsRef.current.readyState === 1) {
        wsRef.current.send(JSON.stringify(data));
      }
    },
    [],
  );

  // PUBLIC_INTERFACE
  // Close ws connection
  const close = useCallback(() => {
    if (wsRef.current) wsRef.current.close();
  }, []);

  useEffect(() => {
    if (!url) return;
    wsRef.current = new window.WebSocket(url);

    wsRef.current.onopen = () => {
      // Optionally, send a ping or join msg if needed
    };
    wsRef.current.onmessage = e => {
      try {
        onMessage && onMessage(JSON.parse(e.data));
      } catch {
        // Ignore parsing errors
      }
    };
    wsRef.current.onerror = () => {};
    wsRef.current.onclose = () => {};

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
    // eslint-disable-next-line
  }, [url]);

  return { sendMessage, close };
}
