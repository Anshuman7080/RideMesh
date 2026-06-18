import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, token, role } = useSelector((state) => state.auth);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      if (socket) socket.disconnect();
      setSocket(null);
      return;
    }

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:5005';

    const newSocket = io(socketUrl, {
      transports: ['websocket'],
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[Socket] Connected:', newSocket.id);
 
      
      newSocket.emit('join-room', {
        userId: user.id,
        role: role,
      });
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user, token, role]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};