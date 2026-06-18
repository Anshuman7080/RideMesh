import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { updateCurrentRideStatus } from '../slices/rideSlice';
import { addNotification } from '../slices/notificationSlice';
import showToastWithRedirect from '../components/Toast';
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, token, role } = useSelector((state) => state.auth);

  const [socket, setSocket] = useState(null);
  const dispatch=useDispatch();

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


  useEffect(() => {
    if (!socket || !user || role!=='driver') return;
  
    console.log('[Driver] Listening for new ride requests');
  
    const handleNewRideRequest = (data) => {
      console.log('[Socket] new-ride-request:', data);
      
      dispatch(addNotification({
        _id:`socket_notif_${Date.now()}`,
        userId:user.id,
        userRole:'driver',
        rideId:data.rideId,
        type:'RIDE_REQUEST_BY_RIDER',
        title:"New Ride Request Available",
        message:`Pickup:${data.pickup.address.split(',')[0]} Fare estimate: ₹${data.estimatedFare}.`,
        isRead:false,
        createdAt:new Date().toISOString()
      }))
     showToastWithRedirect({
      title:"New Ride Request!",
      message:`A new ride is requested nearby for ₹${data.estimatedFare}. `,
      type:'info',
      actionLabel:'View Ticket',
     },"/driver/requests");
    };
  
    socket.on('new-ride-request', handleNewRideRequest);
  
    return () => {
      socket.off('new-ride-request', handleNewRideRequest);
    };
  }, [socket, user])
 

useEffect(() => {
  if (!socket || role!=='rider') return;

  console.log('[Socket] listening for ride-accepted');
  const handleRideAccepted = (data) => {
    console.log('[Socket] ride-accepted:', data);

    dispatch(updateCurrentRideStatus({
      rideId: data.rideId,
      status: 'ACCEPTED',
      driverId: data.driverId,
    }));

    dispatch(addNotification({
      _id: `socket_${Date.now()}`,
      rideId: data.rideId,
      type: 'RIDE_ACCEPTED',
      title: 'Ride Accepted',
      message: 'A driver has accepted your ride request.',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));
   
    showToastWithRedirect({
      title:"Ride Accepted!",
      message:`A driver is heading to your pickup location.`,
      type:'success',
      actionLabel:'Track Cab',
     },`/rider/tracking/${data.rideId}`);
    

  };

  socket.on('ride-accepted', handleRideAccepted);

  return () => {
    socket.off('ride-accepted', handleRideAccepted);
  };
}, [socket, dispatch]);



  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};