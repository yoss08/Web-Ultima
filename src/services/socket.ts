import { io, Socket } from 'socket.io-client';

import { API_URL } from '../config/apiConfig';

const getSocketURL = () => {
  // If API_URL is set (even if empty string for relative paths), use it.
  // But for WebSockets, we need a full URL. If it's empty, we assume current host.
  if (API_URL) return API_URL;
  
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    // For Vercel, if API_URL is empty, we assume the backend is on the same host but maybe different port for local dev
    // If hostname is not localhost, it's production - use current domain with ws/wss
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${protocol}//${hostname}`;
    }
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
