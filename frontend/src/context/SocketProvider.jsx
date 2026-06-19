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
  console.log("user in socketPRovider is",user);

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
 
// ride-accepted
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


// driver-arrived
useEffect(() => {
  if (!socket || role!=='rider') return;

  console.log('[Socket] listening for driver-arrived');
  const handleDriverArrived = (data) => {
    console.log('[Socket] Driver-arrived:', data);

    dispatch(updateCurrentRideStatus({
      rideId: data.rideId,
      status: 'DRIVER-ARRIVED',
    }));

    dispatch(addNotification({
      _id: `socket_notif_${Date.now()}`,
      userId:user.id,
      userRole:'rider',
      rideId: data.rideId,
      type: 'DRIVER_ARRIVED',
      title: 'Driver Arrived',
      message: 'Your driver has arrived at your pickup destination.',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));
   
    showToastWithRedirect({
      title:"Driver Arrived!",
      message:`Your driver has arrived at the pickup location.`,
      type:'success',
      actionLabel:'View Status',
     },`/rider/tracking/${data.rideId}`);
    

  };

  socket.on('driver-arrived', handleDriverArrived);

  return () => {
    socket.off('driver-arrived', handleDriverArrived);
  };
}, [socket, dispatch]);


// ride started

useEffect(() => {
  if (!socket || role!=='rider') return;

  console.log('[Socket] listening for ride-stated');
  const handleRideStarted = (data) => {
    console.log('[Socket] Ride-started:', data);

    dispatch(updateCurrentRideStatus({
      rideId: data.rideId,
      status: 'IN_PROGRESS',
    }));

    dispatch(addNotification({
      _id: `socket_notif_${Date.now()}`,
      userId:user.id,
      userRole:'rider',
      rideId: data.rideId,
      type: 'RIDE_STARTED',
      title: 'Trip Started',
      message: 'Your ride is now in progress. Safe trip!',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));
   
    showToastWithRedirect({
      title:"Trip Started!",
      message:`Your trip is now in progress. Safe travels!`,
      type:'success',
      actionLabel:'Track Trip',
     },`/rider/tracking/${data.rideId}`);
    

  };

  socket.on('ride-started', handleRideStarted);

  return () => {
    socket.off('ride-started', handleRideStarted);
  };
}, [socket, dispatch]);


// ride-completed
useEffect(() => {
  if (!socket || role!=='rider') return;

  console.log('[Socket] listening for ride-completed');
  const handleRideCompleted = (data) => {
    console.log('[Socket] Ride-completed:', data);

    dispatch(updateCurrentRideStatus({
      rideId: data.rideId,
      status: 'COMPLETED',
    }));

    dispatch(addNotification({
      _id: `socket_notif_${Date.now()}`,
      userId:user.id,
      userRole:'rider',
      rideId: data.rideId,
      type: 'RIDE_COMPLETED',
      title: 'Trip Completed',
      message: 'Your ride is complete. Rate your experience and make the payment.',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));
   
    showToastWithRedirect({
      title:"Trip Completed!",
      message:`Please complete your rating and checkout payment.`,
      type:'success',
      actionLabel:'Pay / Review',
     },`/rider/completed/${data.rideId}`);
    

  };

  socket.on('ride-completed', handleRideCompleted);

  return () => {
    socket.off('ride-completed', handleRideCompleted);
  };
}, [socket, dispatch]);

// ride cancelled by driver

useEffect(() => {
  if (!socket || role!=='rider') return;

  console.log('[Socket] listening for ride-completed');
  const handleRideCancel = (data) => {
    console.log('[Socket] Ride-Cancelled by driver:', data);

    dispatch(updateCurrentRideStatus({
      rideId: data.rideId,
      status: 'CANCELLED',
    }));

    dispatch(addNotification({
      _id: `socket_notif_${Date.now()}`,
      userId:user.id,
      userRole:'rider',
      rideId: data.rideId,
      type: 'RIDE_CANCELLED',
      title: 'Ride Cancelled',
      message: 'Your match was cancelled by the driver partner.',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));
   
    showToastWithRedirect({
      title:"Ride Cancelled!",
      message:`The driver cancelled the match. Try booking again.`,
      type:'warning',
      actionLabel:'Book Again',
     },`/rider/home`);
    

  };

  socket.on('cancelled-by-driver', handleRideCancel);

  return () => {
    socket.off('cancelled-by-driver', handleRideCancel);
  };
}, [socket, dispatch]);

// payment successful

useEffect(() => {
  if (!socket || role!=='driver') return;

  console.log('[Socket] listening for Payment-successful:');
  const handlePaymentSuccess = (data) => {
    console.log('[Socket] Received Payment :', data);

  
    dispatch(addNotification({
      _id: `socket_notif_${Date.now()}`,
      userId:user.id,
      userRole:'driver',
      rideId: data.rideId,
      type: 'PAYMENT_SUCCESSFUL',
      title: 'Payment Received',
      message: 'Payment of ₹${data.amount} has been settled for Ride Match.',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));
   
    showToastWithRedirect({
      title:"Payment Received!",
      message:`₹${data.amount} payment settled successfully!`,
      type:'Success',
      actionLabel:'View Earnings',
     },`/driver/earnings`);
    

  };

  socket.on('payment-successfull', handlePaymentSuccess);

  return () => {
    socket.off('payment-successfull', handlePaymentSuccess);
  };
}, [socket, dispatch]);


  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};