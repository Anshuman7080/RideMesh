import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, Car, Smartphone, CheckCircle, Navigation, Clock, CreditCard } from 'lucide-react';
import { setSelectedVehicleType, resetBookingState } from '../../slices/rideSlice';
import {createRide} from "../../services/operations/rideAPI"
import Button from '../../components/Button';
import Card from '../../components/Card';
import BottomSheet from '../../components/BottomSheet';
import SidePanel from '../../components/SidePanel';


const FitBounds = ({ p1, p2 }) => {
  const map = useMap();
  useEffect(() => {
    if (p1 && p2) {
      map.fitBounds(L.latLngBounds([p1, p2]), { padding: [50, 50] });
    }
  }, [p1, p2, map]);
  return null;
};


const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

const RideOptions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pickup, dropoff, distanceKm, selectedVehicleType, loading, error, currentRide } = useSelector(
    (state) => state.ride
  );

  const {token}=useSelector((state)=>state.auth);

  console.log("token is",token);

  useEffect(() => {
    if (!pickup || !dropoff) {
      navigate('/rider/home');
    }
  }, [pickup, dropoff, navigate]);


  useEffect(() => {
    if (currentRide) {
      navigate(`/rider/searching`);
    }
  }, [currentRide, navigate]);


  const vehicles = [
    {
      id: 'bike',
      name: 'Mesh Bike',
      description: 'Quickest solo rides',
      base: 20,
      rate: 6,
      eta: '2 mins',
      icon: Smartphone,
    },
    {
      id: 'auto',
      name: 'Mesh Auto',
      description: 'Ventilated 3-seaters',
      base: 35,
      rate: 9,
      eta: '4 mins',
      icon: CreditCard,
    },
    {
      id: 'car',
      name: 'Mesh Go',
      description: 'Comfortable hatchbacks',
      base: 50,
      rate: 12,
      eta: '5 mins',
      icon: Car,
    },
  ];

  const getFare = (veh) => {
    return Math.round(veh.base + distanceKm * veh.rate);
  };

  const handleBook = () => {
    dispatch(
      createRide({
        pickup,
        dropoff,
        distanceKm,
        token
      })
    );
  };

  const renderContent = () => (
    <div className="space-y-6">
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/rider/set-location')}
          className="p-1.5 rounded-full hover:bg-gray-100 text-primary-darkgray hover:text-primary active:scale-90 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-base font-extrabold text-primary font-sans">Choose a ride</h2>
          <p className="text-[10px] text-primary-darkgray font-medium">Distance: {distanceKm} km</p>
        </div>
      </div>

  
      <div className="space-y-3.5 max-h-[35vh] overflow-y-auto pr-1 no-scrollbar">
        {vehicles.map((veh) => {
          const VehicleIcon = veh.icon;
          const isSelected = selectedVehicleType === veh.id;
          const fare = getFare(veh);
          return (
            <div
              key={veh.id}
              onClick={() => dispatch(setSelectedVehicleType(veh.id))}
              className={`
                flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? 'border-accent-blue bg-blue-50/40 ring-1 ring-accent-blue shadow-sm'
                    : 'border-gray-150 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div
                className={`p-3.5 rounded-xl ${
                  isSelected ? 'bg-accent-blue text-white shadow-sm' : 'bg-gray-100 text-primary-darkgray'
                } transition-colors`}
              >
                <VehicleIcon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-primary">{veh.name}</h4>
                  <span className="text-sm font-extrabold text-primary">₹{fare}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{veh.description}</p>
                <div className="flex items-center gap-3.5 mt-1.5 text-[9px] font-bold uppercase tracking-wider text-primary-darkgray">
                  <span className="flex items-center gap-1 text-accent-blue">
                    <Clock size={11} /> {veh.eta} away
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      
      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2.5 text-accent-red text-xs font-medium animate-fade-in">
          <ArrowLeft size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <CreditCard size={15} className="text-accent-blue" />
          <span>Pay Online (Razorpay)</span>
        </div>
        <span className="text-[10px] font-bold text-accent-green uppercase bg-green-50 px-2 py-0.5 rounded">
          Active
        </span>
      </div>

     
      <div className="pt-2">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleBook}
          loading={loading}
          className="font-bold flex items-center justify-center gap-1.5"
          icon={CheckCircle}
        >
          Request {vehicles.find((v) => v.id === selectedVehicleType)?.name || 'Ride'}
        </Button>
      </div>
    </div>
  );

  const pickupPos = pickup ? [pickup.latitude, pickup.longitude] : [0, 0];
  const dropoffPos = dropoff ? [dropoff.latitude, dropoff.longitude] : [0, 0];
  const routeLine = [pickupPos, dropoffPos];

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
      {/* Interactive Map View */}
      {pickup && dropoff && (
        <div className="absolute inset-0 w-full h-full">
          <MapContainer center={pickupPos} zoom={13} zoomControl={false} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds p1={pickupPos} p2={dropoffPos} />
            <Polyline positions={routeLine} color="#276EF1" weight={4} opacity={0.7} />
            <Marker position={pickupPos} icon={greenIcon} />
            <Marker position={dropoffPos} icon={redIcon} />
          </MapContainer>
        </div>
      )}

  
      <SidePanel isOpen={true} onClose={null} showCloseButton={false} title={null} width="w-[380px]">
        {renderContent()}
      </SidePanel>

   
      <BottomSheet isOpen={true} onClose={() => {}} showCloseButton={false} title={null} snapPoints="max-h-[55vh]">
        {renderContent()}
      </BottomSheet>
    </div>
  );
};

export default RideOptions;
