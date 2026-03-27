import { useEffect, useState } from 'react';
import { socket, connectSocket, disconnectSocket } from '../services/socket';
import { useAuth } from '../services/AuthContext';

export function useSocket() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (user?.id) {
      connectSocket(user.id);
    }

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      // Depending on your requirements, you might disconnect on unmount
      // disconnectSocket(); 
    };
  }, []);

  return { socket, isConnected };
}
