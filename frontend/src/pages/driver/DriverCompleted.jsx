import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, Star, DollarSign, ArrowRight, User } from 'lucide-react';
// import { rateRider, resetBookingState } from '../../services/operations/driverAPI';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { getRideDetails, rateRider } from '../../services/operations/rideAPI';
import { resetBookingState } from '../../slices/rideSlice';

const DriverCompleted=()=>{
  const {rideId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const {currentRide,loading}=useSelector((state)=>state.ride);
    const [rating,setRating]=useState(5);
    const [rated,setRated]=useState(false);
    const {token}=useSelector((state)=>state.auth);

    console.log("currentRide is",currentRide);

      useEffect(()=>{
        dispatch(getRideDetails({rideId,token}));
       },[rideId,dispatch]);
    
    const handleRatingSubmit=(selectedRating)=>{
        setRating(selectedRating);
       
           dispatch(rateRider({rideId,rating:selectedRating,token}))
    }

    const handleContinue=()=>{
           dispatch(resetBookingState());
          navigate('/driver/home');
    }

    const fare=currentRide ? currentRide.estimatedFare :130;
    const distance=currentRide ? currentRide.distanceKm : 5.8;

     return (
    <div className="min-h-screen text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6 text-center animate-scale-in">
        
        <div className="relative mx-auto flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-accent-green/10 animate-ping" />
          <div className="relative h-16 w-16 rounded-full bg-primary-light text-accent-green flex items-center justify-center shadow-md border border-gray-800">
            <CheckCircle2 size={28} />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl text-gray-950 font-extrabold tracking-tight">Trip Completed!</h1>
          <p className="text-xs text-gray-400">Excellent job partner, passengers arrived safely.</p>
        </div>

       
        <Card padding="spacious" className="shadow-lg bg-primary-light border-gray-800 text-left space-y-6">
        
          <div className="text-center bg-black/45 p-6 rounded-2xl border border-gray-800 space-y-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Your Net Profit</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center">
              <DollarSign size={24} className="text-accent-green" /> {fare}
            </h2>
            <p className="text-[10px] text-gray-500">Trip Distance: {distance} km</p>
          </div>

          <div className="text-center space-y-3 pb-3 border-b border-gray-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {rated ? 'Passenger Rated' : 'Rate the passenger'}
            </h4>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={rated || loading}
                  onClick={() => handleRatingSubmit(star)}
                  className={`p-1 transition-transform ${
                    rated || loading ? 'cursor-default' : 'hover:scale-110 active:scale-95'
                  }`}
                >
                  <Star
                    size={28}
                    className={
                      star <= (currentRide?.driverRating || rating)
                        ? 'fill-accent-amber text-accent-amber'
                        : 'text-gray-600'
                    }
                  />
                </button>
              ))}
            </div>
            {rated && (
              <span className="inline-block text-[10px] font-bold text-accent-green bg-green-950/40 px-2.5 py-0.5 rounded-full border border-green-800/40">
                Submitted {currentRide?.driverRating || rating} Stars
              </span>
            )}
          </div>

       
          <div className="pt-2">
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleContinue}
              className=" text-primary bg-gray-200 font-bold flex items-center justify-center gap-1.5 py-3.5"
              icon={ArrowRight}
            >
              Continue to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DriverCompleted;
