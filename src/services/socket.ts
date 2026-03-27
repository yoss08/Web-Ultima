import { io, Socket } from 'socket.io-client';

const getSocketURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // Smart fallback: If on frontend.com, assume backend is at frontend.com:3001 or use current domain
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    // Common pattern: if on local, use 3001. If on production/vercel, you should set VITE_API_URL.
    // For now, let's keep it robust for local dev without env vars.
    return `${protocol}//${hostname}:3001`;
  }
  return 'http://localhost:3001';
};

const URL = getSocketURL();

export const socket: Socket = io(URL, {
  autoConnect: false, // We'll manage connection manually (e.g., in a provider or layout)
  reconnection: true,
  withCredentials: true,
});

export const connectSocket = (userId?: string) => {
  if (!socket.connected) {
    if (userId) {
      socket.io.opts.query = { userId };
    }
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
