import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Search, MapPin, Compass } from 'lucide-react';
import { resetBookingState,updateCurrentRideStatus } from "../../slices/rideSlice";
import {cancelRide} from "../../services/operations/rideAPI"
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useSocket } from '../../context/SocketProvider';

const Searching = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {socket}=useSocket();

  const { currentRide, loading } = useSelector((state) => state.ride);
  const pollingRef = useRef(null);

 
  useEffect(() => {
    if (!currentRide) {
      navigate('/rider/home');
    }
  }, [currentRide, navigate]);

 

  const handleCancel = () => {
    if (!currentRide || !currentRide._id) return;
    
    if (window.confirm('Are you sure you want to cancel this ride request?')) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      
       dispatch(cancelRide({ rideId: currentRide._id, reason: 'Cancelled by rider' }))
        .unwrap()
        .then(() => {
          alert('Ride request cancelled.');
          dispatch(resetBookingState());
          navigate('/rider/home');
        })
        .catch((err) => {
          alert(err || 'Failed to cancel ride');
        });
    }
  };

  if (!currentRide) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-6 font-sans">
      <div className="flex-1 max-w-md mx-auto w-full flex flex-col justify-center items-center space-y-12">
       
        <div className="relative flex items-center justify-center h-48 w-48">
        
          <div className="absolute h-40 w-40 rounded-full border border-accent-blue/15 animate-ping" />
          <div className="absolute h-32 w-32 rounded-full border border-accent-blue/20 animate-pulse" />
          <div className="absolute h-24 w-24 rounded-full border border-accent-blue/30" />
          
          <div className="relative h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center shadow-xl">
            <Compass size={28} className="animate-spin text-accent-blue" style={{ animationDuration: '6s' }} />
          </div>
        </div>

   
        <div className="text-center space-y-3">
          <h2 className="text-xl font-extrabold text-primary tracking-tight">Finding your ride...</h2>
          <p className="text-xs text-primary-darkgray max-w-xs leading-relaxed">
            Contacting nearby drivers within a 5km radius. Please stand by while we coordinate your trip.
          </p>
        </div>

       
        <Card padding="normal" className="w-full border-gray-150 shadow-sm bg-white space-y-3.5">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ride Details</span>
            <span className="text-xs font-bold text-accent-blue bg-blue-50 px-2 py-0.5 rounded">₹{currentRide.estimatedFare}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-1.5 shrink-0"></div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Pickup</p>
                <p className="text-xs font-semibold text-primary truncate mt-0.5">{currentRide.pickup?.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-red mt-1.5 shrink-0"></div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Dropoff</p>
                <p className="text-xs font-semibold text-primary truncate mt-0.5">{currentRide.dropoff?.address}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

     
      <div className="w-full max-w-xs mx-auto pb-8 animate-slide-up">
        <Button
          variant="outline"
          fullWidth
          size="lg"
          onClick={handleCancel}
          disabled={loading}
          icon={X}
          className="border-accent-red text-accent-red hover:bg-red-50 hover:border-accent-red font-semibold py-3.5"
        >
          Cancel Ride Request
        </Button>
      </div>
    </div>
  );
};

export default Searching;
