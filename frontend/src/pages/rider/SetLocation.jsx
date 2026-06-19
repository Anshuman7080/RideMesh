import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { setPickup, setDropoff, setDistanceAndFare, setBookingStatus } from '../../slices/rideSlice';
import Button from '../../components/Button';
import Card from '../../components/Card';
import BottomSheet from '../../components/BottomSheet';
import SidePanel from '../../components/SidePanel';

// Haversine distance calculator
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2)); 
};


const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const FitBounds = ({ p1, p2 }) => {
  const map = useMap();

  useEffect(() => {
    if (p1 && p2) {
      const bounds = L.latLngBounds([p1, p2]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [p1, p2, map]);
  return null;
};

const SetLocation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rideState = useSelector((state) => state.ride);

 
  const initialPickup = rideState.pickup || { latitude: 25.3176, longitude: 82.9739, address: 'Dashashwamedh Ghat, Varanasi, UP' };
  const initialDropoff = rideState.dropoff || { latitude: 25.3284, longitude: 82.9972, address: 'Varanasi Junction, Railway Station' };

 
  const [pickupCoord, setPickupCoord] = useState([initialPickup.latitude, initialPickup.longitude]);
  const [dropoffCoord, setDropoffCoord] = useState([initialDropoff.latitude, initialDropoff.longitude]);
  

  const [pickupAddr, setPickupAddr] = useState(initialPickup.address);
  const [dropoffAddr, setDropoffAddr] = useState(initialDropoff.address);

  const pickupMarkerRef = useRef(null);
  const dropoffMarkerRef = useRef(null);
  const pickupTimeout = useRef(null);
   const dropoffTimeout = useRef(null);

 const updateAddress = async (type, lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    const data = await res.json();
    const address = data?.display_name || 'Unknown location';

    if (type === 'pickup') {
      setPickupAddr(address);
    } else {
      setDropoffAddr(address);
    }
  } catch (err) {
    console.error('Reverse geocoding failed:', err);

    if (type === 'pickup') {
      setPickupAddr('Unable to fetch address');
    } else {
      setDropoffAddr('Unable to fetch address');
    }
  }
};

const getCoordinates = async (address) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );

    const data = await res.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      console.log('Latitude:', lat);
      console.log('Longitude:', lng);

      return { lat, lng };
    }

    return null;
  } catch (err) {
    console.error('Geocoding failed:', err);
    return null;
  }
};

  const pickupEventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = pickupMarkerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          setPickupCoord([latLng.lat, latLng.lng]);
          updateAddress('pickup', latLng.lat, latLng.lng);
        }
      },
    }),
    []
  );

  const dropoffEventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = dropoffMarkerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          setDropoffCoord([latLng.lat, latLng.lng]);
          updateAddress('dropoff', latLng.lat, latLng.lng);
        }
      },
    }),
    []
  );

  const handleConfirm = () => {
    
    const dist = getDistance(pickupCoord[0], pickupCoord[1], dropoffCoord[0], dropoffCoord[1]);
    

    dispatch(setPickup({
      latitude: pickupCoord[0],
      longitude: pickupCoord[1],
      address: pickupAddr
    }));

    dispatch(setDropoff({
      latitude: dropoffCoord[0],
      longitude: dropoffCoord[1],
      address: dropoffAddr
    }));

    dispatch(setDistanceAndFare(dist));
    dispatch(setBookingStatus('ride-options'));
   
    navigate('/rider/ride-options');
  };

  const handlePickupChange=async(e)=>{
    e.preventDefault();
    const value=e.target.value;
    setPickupAddr(value);
   
    //clear previous timer
    if(pickupTimeout.current){
      clearTimeout(pickupTimeout.current);
    }
    pickupTimeout.current=setTimeout(async()=>{
      const res=await getCoordinates(value);
      if(res){
        setPickupCoord([res.lat,res.lng]);
      }
    },2000);
  }

   const handleDropoffChange=async(e)=>{
    e.preventDefault();
    const value=e.target.value;
    setDropoffAddr(value);
   
    //clear previous timer
    if(dropoffTimeout.current){
      clearTimeout(dropoffTimeout.current);
    }
    dropoffTimeout.current=setTimeout(async()=>{
      const res=await getCoordinates(value);
      if(res){
        setDropoffCoord([res.lat,res.lng]);
      }
    },2000);
  }

  const renderContent = () => (
    <div className="space-y-6">
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/rider/home')}
          className="p-1.5 rounded-full hover:bg-gray-100 text-primary-darkgray hover:text-primary active:scale-90 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-base font-extrabold text-primary font-sans">Set Route Coordinates</h2>
      </div>

      <div className="space-y-4">
       
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="block text-[10px] font-bold text-accent-green uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green inline-block"></span>
              Pickup Location (Drag Pin)
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-accent-green">
              <MapPin size={16} />
            </div>
            <input
              type="text"
              value={pickupAddr}
              onChange={handlePickupChange}
              className="block w-full rounded-lg text-xs border border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-50 focus:border-accent-blue py-3.5 pl-10 pr-4 bg-white text-primary"
            />
          </div>
        </div>

        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="block text-[10px] font-bold text-accent-red uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-red inline-block"></span>
              Destination (Drag Pin)
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-accent-red">
              <MapPin size={16} />
            </div>
            <input
              type="text"
              value={dropoffAddr}
              onChange={handleDropoffChange}
              className="block w-full rounded-lg text-xs border border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-50 focus:border-accent-blue py-3.5 pl-10 pr-4 bg-white text-primary"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleConfirm}
          className="font-bold flex items-center justify-center gap-1.5"
          icon={CheckCircle2}
        >
         <div className="flex items-center gap-1"> Confirm Route <ArrowRight size={15} /></div>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
      
      <div className="absolute inset-0 w-full h-full">
        <MapContainer
          center={pickupCoord}
          zoom={13}
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds p1={pickupCoord} p2={dropoffCoord} />
          
          
          <Marker
            position={pickupCoord}
            icon={greenIcon}
            draggable={true}
            eventHandlers={pickupEventHandlers}
            ref={pickupMarkerRef}
          >
            <Popup>
              <span className="text-xs font-bold text-accent-green">Pickup Spot (Draggable)</span>
            </Popup>
          </Marker>

          
          <Marker
            position={dropoffCoord}
            icon={redIcon}
            draggable={true}
            eventHandlers={dropoffEventHandlers}
            ref={dropoffMarkerRef}
          >
            <Popup>
              <span className="text-xs font-bold text-accent-red">Dropoff Spot (Draggable)</span>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      
      <SidePanel isOpen={true} onClose={null} showCloseButton={false} title={null} width="w-[380px]">
        {renderContent()}
      </SidePanel>

      <BottomSheet isOpen={true} onClose={() => {}} showCloseButton={false} title={null} snapPoints="max-h-[50vh]">
        {renderContent()}
      </BottomSheet>
    </div>
  );
};

export default SetLocation;
