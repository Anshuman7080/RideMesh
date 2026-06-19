import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
// import io from 'socket.io-client';
import { useSocket } from '../../context/SocketProvider';
import { Power, ShieldAlert, Award, ArrowRight, MapPin, Navigation, DollarSign, ListCollapse, CheckCircle2 } from 'lucide-react';
import { setDriverOnline, setDriverOffline,  } from '../../services/operations/locationAPI';
import { addNotification } from '../../slices/notificationSlice';
import {setCurrentLocation} from "../../slices/locationSlice"
import Button from '../../components/Button';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import SidePanel from '../../components/SidePanel';
import showToastWithRedirect  from  "../../components/Toast"
import BottomSheet from '../../components/BottomSheet';

// Fix Leaflet icons
const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 15);
  }, [center, map]);
  return null;
};

const DriverHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {socket}=useSocket();

  const { user } = useSelector((state) => state.auth);
  const { currentLocation, isOnline, loading } = useSelector((state) => state.location);

  const [position, setPosition] = useState([25.3176, 82.9739]);
  const [hasLocation, setHasLocation] = useState(false);
  const [activeRequestsCount, setActiveRequestsCount] = useState(2); 

  const socketRef = useRef(null);
  const watchIdRef = useRef(null);
  const updateIntervalRef = useRef(null);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
          dispatch(setCurrentLocation({ latitude: coords[0], longitude: coords[1] }));
          setHasLocation(true);
        },
        (err) => console.warn(err)
      );
    }
  }, [dispatch]);


 
useEffect(() => {
  if (!user || !socket?.emit) {
   
    cleanupOnlineServices();
    return;
  }

  console.log('[Driver] Online services started');


  socket.emit('join-room', {
    userId: user.id,
    role: 'driver',
  });


  if (navigator.geolocation) {
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);

        dispatch(setCurrentLocation({
          latitude: lat,
          longitude: lng,
        }));
      },
      (err) => console.error('[Geo Error]', err),
      { enableHighAccuracy: true }
    );
  }


  updateIntervalRef.current = setInterval(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      dispatch(updateDriverLocation({
        latitude: lat,
        longitude: lng,
      }));

      socket.emit('location-update', {
        latitude: lat,
        longitude: lng,
      });
    });
  }, 5000);

  return () => {
    cleanupOnlineServices();
  };

}, [isOnline, user, socket, dispatch]);





  const cleanupOnlineServices = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
  };

  const handleToggleOnline = () => {
    if (isOnline) {
      dispatch(setDriverOffline());
    } else {
      dispatch(setDriverOnline());
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
        <div>
          <h2 className="text-base font-extrabold text-primary leading-none">Driver Console</h2>
          <p className="text-[10px] text-gray-400 mt-1 font-medium">Partner: {user?.name}</p>
        </div>
        <button
          onClick={handleToggleOnline}
          disabled={loading}
          className={`
            inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 border
            ${
              isOnline
                ? 'bg-green-50 text-accent-green border-green-200 hover:bg-green-100'
                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
            }
          `}
        >
          <Power size={13} className={isOnline ? 'animate-pulse' : ''} />
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

     
      {isOnline ? (
        <div className="p-3 bg-green-50/50 border border-green-100 text-accent-green rounded-xl flex items-start gap-2 text-xs font-medium animate-fade-in">
          <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
          <span>You are online. Geolocator is streaming. You can now accept incoming requests.</span>
        </div>
      ) : (
        <div className="p-3 bg-yellow-50 border border-yellow-100 text-yellow-800 rounded-xl flex items-start gap-2 text-xs font-medium">
          <ShieldAlert size={15} className="shrink-0 mt-0.5" />
          <span>You are offline. Toggle online mode to receive ride request tickets.</span>
        </div>
      )}

      
      <div className="grid grid-cols-2 gap-4">
        <Card
          padding="normal"
          className="border-gray-150 shadow-sm cursor-pointer hover:border-gray-300"
          onClick={() => navigate('/driver/earnings')}
        >
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Today's Profit</span>
          <h3 className="text-lg font-extrabold text-primary mt-1 flex items-center">
            <DollarSign size={16} className="text-accent-green" /> 1,240
          </h3>
        </Card>
        <Card
          padding="normal"
          className="border-gray-150 shadow-sm cursor-pointer hover:border-gray-300"
          onClick={() => navigate('/driver/requests')}
        >
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Pending Orders</span>
          <h3 className="text-lg font-extrabold text-accent-blue mt-1 flex items-center gap-1.5">
            <ListCollapse size={16} /> {activeRequestsCount}
          </h3>
        </Card>
      </div>

      
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <Button
          variant="primary"
          fullWidth
          size="md"
          disabled={!isOnline}
          className="font-bold flex items-center justify-center gap-1.5 py-3"
          onClick={() => navigate('/driver/requests')}
          icon={ArrowRight}
        >
          View Pending Requests List
        </Button>
        <Button
          variant="outline"
          fullWidth
          size="md"
          className="font-bold border-gray-200 py-3"
          onClick={() => navigate('/driver/profile')}
        >
          Partner Settings / Vehicle
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
     
      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
              setPosition([pos.coords.latitude, pos.coords.longitude]);
            });
          }
        }}
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-30 p-3 bg-white rounded-full shadow-lg text-primary hover:bg-gray-100 active:scale-90 transition-all border border-gray-100"
        title="Recenter location"
      >
        <Navigation size={20} className="fill-current" />
      </button>

      {/* Interactive Map */}
      <div className="absolute inset-0 w-full h-full">
        <MapContainer center={position} zoom={15} zoomControl={false} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap center={position} />
          
          <Marker position={position} icon={driverIcon}>
            <Popup>
              <div className="text-center p-0.5">
                <span className="text-xs font-bold text-accent-blue">Your active cab location</span>
                {isOnline && <span className="block text-[8px] text-accent-green uppercase font-bold mt-0.5">Streaming Live</span>}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

     
      <SidePanel isOpen={true} onClose={null} showCloseButton={false} title={null} width="w-[380px]">
        {renderDashboard()}
      </SidePanel>

      
      <BottomSheet isOpen={true} onClose={() => {}} showCloseButton={false} title={null} snapPoints="max-h-[50vh]">
        {renderDashboard()}
      </BottomSheet>
    </div>
  );
};

export default DriverHome;
