import React, { useState, useEffect, useRef,useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Phone, MessageSquare, ShieldAlert, ArrowRight, CheckCircle2, Navigation2 } from 'lucide-react';
import { driverArrived, startRide, completeRide, driverCancelRide } from '../../services/operations/rideAPI';
import { getRideDetails } from '../../services/operations/rideAPI';
import Button from '../../components/Button';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import BottomSheet from '../../components/BottomSheet';
import SidePanel from '../../components/SidePanel';
import Modal from '../../components/Modal';
import { getRiderDetailForRide } from '../../services/operations/riderAPI';
import { useSocket } from '../../context/SocketProvider';


const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36],
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36],
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [28, 44],
  iconAnchor: [14, 44],
});



const FitBounds=({p1,p2,p3})=>{
    const map=useMap();
    useEffect(()=>{
        const coords=[p1,p2];
        if(p3)coords.push(p3);
        map.fitBounds(L.latLngBounds(coords),{padding:[50,50]});
    },[p1,p2,p3,map]);
    return null;
}


const ActiveRide=()=>{
    const {rideId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {socket}=useSocket();
    
    const {currentRide,loading}=useSelector((state)=>state.ride);

    const [driverCoord,setDriverCoord]=useState(null);
    const [showCancelModal,setShowCancelModal]=useState(false);
    const [cancelReason,setCancelReason]=useState('');
    const {token}=useSelector((state)=>state.auth);
    const [riderId,setRiderId]=useState(null);
    const [passenger,setPassenger]=useState({});


    const pickupPos = useMemo(() => {
        if (!currentRide?.pickup?.latitude) return null;
        return [currentRide.pickup.latitude, currentRide.pickup.longitude];
      }, [currentRide?.pickup?.latitude, currentRide?.pickup?.longitude]);
     
      const dropoffPos = useMemo(() => {
        if (!currentRide?.dropoff?.latitude) return null;
        return [currentRide.dropoff.latitude, currentRide.dropoff.longitude];
      }, [currentRide?.dropoff?.latitude, currentRide?.dropoff?.longitude]);
    

    // console.log("currenRide is",currentRide);
    

       useEffect(()=>{
        if (!rideId) return; 
        if(currentRide)return;
        dispatch(getRideDetails({rideId,token}));
       },[currentRide, rideId, token]);

    useEffect(()=>{
       setRiderId(currentRide?.riderId);
    },[currentRide]);

       useEffect(() => {

         if(!riderId)return;
            if(!token)return
       
         const fetchRiderDetail = async () => {
           try {

            console.log("coming here");
             
             const res = await dispatch(getRiderDetailForRide({riderId, token }));
            //  console.log("res of fetchRiderDetail",res);
             setPassenger({
               name:res?.name,
                rating: res?.rating+'★',
                phone: res?.phone,
                avatar: 'P',
             })
       
           } catch (err) {
             console.log("err in useEffect for getRiderDetailForRide...", err);
           }
         };
       
         console.log("coming here 2");
         fetchRiderDetail();
       }, [riderId, token, dispatch]);

    
 useEffect(() => {
  if (!socket || !currentRide) return;

  if (!navigator.geolocation) {
    console.error("Geolocation is not supported");
    return;
  }

  console.log("[Socket] Self tracking started");

  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setDriverCoord((prev) => {
       
        if (!prev) {
          return [lat, lng];
        }
        if (prev[0] === lat && prev[1] === lng) {
          return prev;
        }

        return [lat, lng];
      });

      
    
    },
    (error) => {
      console.error("Location error:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}, [socket, currentRide?._id]);


    const handleArrived=()=>{
        dispatch(driverArrived({rideId,token}))
    }

    const handleStart=()=>{
        dispatch(startRide({rideId,token}))
    };

    const handleComplete=()=>{
        dispatch(completeRide({rideId,token,navigate}))
    };

    const handleCancelSubmit=()=>{
        dispatch(driverCancelRide({rideId,reason:cancelReason || 'Cancelled by driver'}))
        .unwrap()
        .then(()=>{
            setShowCancelModal(false);
            alert('Ride Cancelled');
            navigate('/driver/home');
        })
        .catch((err)=>alert(err || "Failed to cancel"));
    }

//     useEffect(() => {
//     if (!pickupPos || !dropoffPos) return;
 
//     const stepRef = { current: 0 };
//     setDriverCoord(pickupPos);
 
//     const interval = setInterval(() => {
//       stepRef.current += 0.05;
 
//       if (stepRef.current >= 1) {
//         clearInterval(interval);
//         setDriverCoord(dropoffPos);
//         return;
//       }
 
//       const lat = pickupPos[0] + (dropoffPos[0] - pickupPos[0]) * stepRef.current;
//       const lng = pickupPos[1] + (dropoffPos[1] - pickupPos[1]) * stepRef.current;
 
//       setDriverCoord([lat, lng]);
//     }, 500);
 
//     return () => clearInterval(interval);
//   }, [pickupPos, dropoffPos]);

    if(!currentRide)return null;

    

  const routePoints = currentRide.status === 'IN_PROGRESS' 
    ? [driverCoord || pickupPos, dropoffPos]
    : [driverCoord || pickupPos, pickupPos];

  const renderActiveCard = () => (
    <div className="space-y-6">
      {/* Header metadata */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Active Ride Slip</span>
          <h2 className="text-sm font-extrabold text-primary tracking-tight">Trip value: ₹{currentRide.estimatedFare}</h2>
        </div>
        <StatusBadge status={currentRide.status} />
      </div>

      {/* Passenger details card */}
      <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm uppercase shadow-sm">
          {passenger.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-primary">{passenger.name}</h4>
            <span className="text-xs font-bold text-accent-amber">{passenger.rating}</span>
          </div>
          <p className="text-[9px] text-gray-500 mt-0.5">Route length: {currentRide.distanceKm} km</p>
        </div>
      </div>

      {/* Helper notes */}
      <div className="text-xs text-primary-darkgray space-y-2 border-b border-gray-100 pb-4">
        <div className="flex items-start gap-2">
          <MapPin size={15} className="text-accent-blue mt-0.5 shrink-0" />
          <p className="font-semibold truncate">
            {currentRide.status === 'IN_PROGRESS' ? currentRide.dropoff.address : currentRide.pickup.address}
          </p>
        </div>
      </div>

      {/* Actions dependent on status */}
      <div className="space-y-2.5 pt-2">
        {currentRide.status === 'ACCEPTED' && (
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleArrived}
            loading={loading}
            className="font-bold py-3.5 flex items-center justify-center gap-1.5"
            icon={CheckCircle2}
          >
            I've Arrived at Pickup
          </Button>
        )}

        {currentRide.status === 'DRIVER_ARRIVED' && (
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleStart}
            loading={loading}
            className="bg-accent-green hover:bg-green-700 font-bold py-3.5 flex items-center justify-center gap-1.5"
            icon={Navigation2}
          >
            Start Ride
          </Button>
        )}

        {currentRide.status === 'IN_PROGRESS' && (
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleComplete}
            loading={loading}
            className="bg-accent-blue hover:bg-blue-700 font-bold py-3.5 flex items-center justify-center gap-1.5"
            icon={CheckCircle2}
          >
            Complete Ride
          </Button>
        )}

        {/* Cancel button */}
        {(currentRide.status === 'ACCEPTED' || currentRide.status === 'DRIVER_ARRIVED') && (
          <Button
            variant="outline"
            fullWidth
            size="md"
            onClick={() => setShowCancelModal(true)}
            className="border-accent-red text-accent-red hover:bg-red-50 hover:border-accent-red font-semibold py-3"
          >
            Cancel Trip
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
      {/* Interactive Map */}
      <div className="absolute inset-0 w-full h-full">
        <MapContainer center={pickupPos} zoom={14} zoomControl={false} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds p1={pickupPos} p2={dropoffPos} p3={driverCoord} />
          
          <Marker position={pickupPos} icon={pickupIcon}>
            <Popup><span className="text-xs font-bold text-accent-green">Pickup Location</span></Popup>
          </Marker>
          <Marker position={dropoffPos} icon={dropoffIcon}>
            <Popup><span className="text-xs font-bold text-accent-red">Dropoff Destination</span></Popup>
          </Marker>

          {driverCoord && (
            <Marker position={driverCoord} icon={driverIcon}>
              <Popup><span className="text-xs font-bold text-accent-blue">Your active cab location</span></Popup>
            </Marker>
          )}

          {driverCoord && <Polyline positions={routePoints} color="#276EF1" weight={4} opacity={0.75} dashArray="5, 10" />}
        </MapContainer>
      </div>

      {/* Desktop Panel */}
      <SidePanel isOpen={true} onClose={null} showCloseButton={false} title={null} width="w-[380px]">
        {renderActiveCard()}
      </SidePanel>

      {/* Mobile BottomSheet */}
      <BottomSheet isOpen={true} onClose={() => {}} showCloseButton={false} title={null} snapPoints="max-h-[50vh]">
        {renderActiveCard()}
      </BottomSheet>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Trip Match"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCancelModal(false)}>Keep Trip</Button>
            <Button variant="danger" onClick={handleCancelSubmit} loading={loading}>Cancel Match</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-primary-darkgray">
            Please select a cancellation reason. Drivers cancelling too many rides might face profile review tags.
          </p>
          <div className="space-y-2">
            {[
              'Passenger is not reachable/responding',
              'Passenger requested cancellation',
              'Vehicle breakdown / technical issue',
              'Incorrect pickup route / traffic blockage',
            ].map((reason, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3.5 p-3 rounded-lg border border-gray-150 hover:bg-gray-50 cursor-pointer text-xs font-medium text-primary-darkgray"
              >
                <input
                  type="radio"
                  name="driverCancelReason"
                  value={reason}
                  checked={cancelReason === reason}
                  onChange={() => setCancelReason(reason)}
                  className="accent-accent-red"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );


}

export default ActiveRide;