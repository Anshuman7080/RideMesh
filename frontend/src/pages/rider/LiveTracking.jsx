import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Phone, MessageSquare, AlertTriangle, Shield, Calendar, Navigation } from 'lucide-react';
import { getRideDetails, cancelRide } from '../../services/operations/rideAPI';
import Button from '../../components/Button';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import BottomSheet from '../../components/BottomSheet';
import SidePanel from '../../components/SidePanel';
import Modal from '../../components/Modal';

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  shadowSize: [41, 41],
});


const FitBounds=({p1,p2,p3})=>{
    const map=useMap();
    useEffect(()=>{
        const coords=[p1,p2];
        if(p2)coords.push(p3);
        map.fitBounds(L.latLngBounds(coords),{padding:[50,50]});
    },[p1,p2,p3,map]);
    return null;
}


const LiveTracking=()=>{
    const {rideId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    
    const {currentRide,loading}=useSelector((state)=>state.ride);

    const [driverCoord,setDriverCoord]=useState(null);
    const [eta,setEta]=useState('Locating driver...');
    const [showCancelModal,setShowCancelModal]=useState(false);

    const [cancelReason,setCancelReason]=useState('');
    
    const pollingIntervalRef=useRef(null);
    const animationIntervalRef=useRef(null);

    const getDriverDetails=(driverId)=>{
        return {
      name: 'Rohan Kumar',
      rating: '4.8★',
      trips: '1,420 trips',
      vehicle: 'White Suzuki Swift Dzire',
      number: 'UP65-CC-4321',
      avatar: 'R',
    };
    }

   const driver=getDriverDetails(currentRide?.driverId);

   // Fetch ride details on mount and poll every 5s
   useEffect(()=>{
    dispatch(getRideDetails(rideId));

    pollingIntervalRefRef.current=setInterval(()=>{
        dispatch(getRideDetails(rideId))
        .unwrap()
        .then((data)=>{
            if(data.ride){
                const status=data.ride.status;
                if(status==='COMPLETED'){
                    clearInterval(pollingIntervalRef.current);
                    navigate(`/rider/completed/${rideId}`);
                }else if(status==='CANCELED'){
                    clearInterval(pollingIntervalRef.current)
                    alert('You ride was cacelled.');
                    navigate('/rider/home');
                }
            }
        })
        .catch(()=>{});
    },5000);

    return ()=>{
        if(pollingIntervalRef.current)clearInterval(pollingIntervalRef.current);
        if(animationIntervalRef.current)clearInterval(animationIntervalRef.current);
    }

   },[rideId,dispatch,navigate]);

//    driver marker animation

useEffect(()=>{

    if(!currentRide)return ;
    
    const pLat=currentRide?.pickup?.latitude;
    const pLng=currentRide?.pickup?.longitude;
    const dLat=currentRide?.dropoff?.latitude;
    const dLng=currentRide?.dropoff?.longitude;

    if(currentRide?.status==='ACCEPTED'){
        const startLat=pLat+0.008;
        const startLng=pLng-0.008;

        let pct=0;
        setDriverCoord([startLat,startLng]);
        setEta('Driver arriving in 4 mins');

        if(animationIntervalRef.current)clearInterval(animationIntervalRef?.current);

        animationIntervalRef.current=setInterval(()=>{
            pct=Math.min(pct+0.01,1);
            const currentLat=startLat + (pLat-startLat)*pct;
            const currentLng=startLng + (pLng-startLng)*pct;
            setDriverCoord([currentLat,currentLng]);

            const remainingMin=Math.ceil(4*(1-pct));
            setEta(remainingMin > 0 ? `Driver arriving in ${remainingMin} mins`: 'Driver has arrived');

            if(pct>=1)clearInterval(animationIntervalRef.current);

        },1500);
    }else if(currentRide.status==='DRIVER_ARRIVED'){

        setDriverCoord([pLat,pLng]);
        setEta('Driver has arrived at pickup location');
        if(animationIntervalRef.current)clearInterval(animationIntervalRef.current);
    }else if (currentRide.status === 'IN_PROGRESS') {
      // Driver is moving from pickup to dropoff
      let pct = 0;
      setDriverCoord([pLat, pLng]);
      setEta('On trip. Arriving in 8 mins');

      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      
      animationIntervalRef.current = setInterval(() => {
        pct = Math.min(pct + 0.01, 1);
        const currentLat = pLat + (dLat - pLat) * pct;
        const currentLng = pLng + (dLng - pLng) * pct;
        setDriverCoord([currentLat, currentLng]);
        
        const remainingMin = Math.ceil(8 * (1 - pct));
        setEta(remainingMin > 0 ? `Arriving at destination in ${remainingMin} mins` : 'Reaching destination...');
        
        if (pct >= 1) clearInterval(animationIntervalRef.current);
      }, 2000);
    }

},[currentRide?.status,currentRide?.driverId]);

const handleCancelSubmit = () => {
    if (!rideId) return;

    dispatch(cancelRide())
      .unwrap()
      .then(() => {
        setShowCancelModal(false);
        alert('Ride cancelled successfully.');
        navigate('/rider/home');
      })
      .catch((err) => {
        alert(err || 'Failed to cancel ride');
      });
  };

    if (!currentRide) return null;

  const pickupPos = [currentRide.pickup.latitude, currentRide.pickup.longitude];
  const dropoffPos = [currentRide.dropoff.latitude, currentRide.dropoff.longitude];

  // Draw appropriate route lines based on state
  const routePoints = currentRide.status === 'IN_PROGRESS' 
    ? [driverCoord || pickupPos, dropoffPos]
    : [driverCoord || pickupPos, pickupPos];


const renderInfoPanel = () => (
    <div className="space-y-6">
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Estimated ETA</span>
          <h2 className="text-lg font-extrabold text-primary tracking-tight">{eta}</h2>
        </div>
        <StatusBadge status={currentRide.status} />
      </div>

      {/* Driver details card */}
      <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
        <div className="h-12 w-12 rounded-full bg-accent-blue text-white flex items-center justify-center font-bold text-lg uppercase shadow-sm">
          {driver.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-primary">{driver.name}</h4>
            <span className="text-xs font-bold text-accent-amber">{driver.rating}</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">{driver.vehicle}</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-primary text-white uppercase tracking-wider">
            {driver.number}
          </span>
        </div>
      </div>

     
      <div className="grid grid-cols-2 gap-3.5">
        <Button
          variant="outline"
          size="md"
          onClick={() => alert('Dialing driver... (Dummy call action)')}
          className="font-bold flex items-center justify-center gap-1.5 py-3 border-gray-200"
          icon={Phone}
        >
          Call Driver
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => alert('Opening chat panel... (Dummy chat action)')}
          className="font-bold flex items-center justify-center gap-1.5 py-3 border-gray-200"
          icon={MessageSquare}
        >
          Message
        </Button>
      </div>

    
      {(currentRide.status === 'ACCEPTED' || currentRide.status === 'DRIVER_ARRIVED') && (
        <div className="pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            fullWidth
            size="md"
            onClick={() => setShowCancelModal(true)}
            className="border-accent-red text-accent-red hover:bg-red-50 hover:border-accent-red font-semibold py-3"
          >
            Cancel Ride
          </Button>
        </div>
      )}
    </div>
);  

 return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
     
      <div className="absolute inset-0 w-full h-full">
        <MapContainer center={pickupPos} zoom={14} zoomControl={false} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds p1={pickupPos} p2={dropoffPos} p3={driverCoord} />
          
          <Marker position={pickupPos} icon={pickupIcon}>
            <Popup><span className="text-xs font-bold text-accent-green">Pickup Spot</span></Popup>
          </Marker>
          <Marker position={dropoffPos} icon={dropoffIcon}>
            <Popup><span className="text-xs font-bold text-accent-red">Dropoff Destination</span></Popup>
          </Marker>

          {/* Animating Driver Marker */}
          {driverCoord && (
            <Marker position={driverCoord} icon={driverIcon}>
              <Popup>
                <div className="text-center p-0.5">
                  <p className="text-xs font-bold text-primary">{driver.name}</p>
                  <p className="text-[10px] text-gray-400">{driver.number}</p>
                </div>
              </Popup>
            </Marker>
          )}

     
          {driverCoord && <Polyline positions={routePoints} color="#276EF1" weight={4} opacity={0.75} dashArray="5, 10" />}
        </MapContainer>
      </div>

      
      <SidePanel isOpen={true} onClose={null} showCloseButton={false} title={null} width="w-[380px]">
        {renderInfoPanel()}
      </SidePanel>

      <BottomSheet isOpen={true} onClose={() => {}} showCloseButton={false} title={null} snapPoints="max-h-[50vh]">
        {renderInfoPanel()}
      </BottomSheet>

     
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Ride Request"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCancelModal(false)}>Keep Ride</Button>
            <Button variant="danger" onClick={handleCancelSubmit} loading={loading}>Cancel Ride</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-primary-darkgray">
            Please let us know why you are cancelling. This helps us optimize matching and partner experiences.
          </p>
          <div className="space-y-2">
            {[
              'Driver took too long to arrive',
              'Driver was moving away from pickup spot',
              'Change of plans / booked another ride',
              'Typo in pickup or dropoff coordinates',
            ].map((reason, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3.5 p-3 rounded-lg border border-gray-150 hover:bg-gray-50 cursor-pointer text-xs font-medium"
              >
                <input
                  type="radio"
                  name="cancelReason"
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


export default LiveTracking;