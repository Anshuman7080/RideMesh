import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShieldAlert, CheckCircle2, Navigation, Award, DollarSign } from 'lucide-react';
import { getRideDetails, rateDriver } from '../../services/operations/rideAPI';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Completed=()=>{
    const {rideId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();

   const {currentRide,loading}=useSelector((state)=>state.ride);
   const [rating,setRating]=useState(5);
   const [rated,setRated]=useState(false);

   useEffect(()=>{
    dispatch(getRideDetails(rideId));
   },[rideId,dispatch]);


   const handleRatingSubmit=(selectedRating)=>{
    setRating(selectedRating);
    dispatch(rateDriver({riderId,rating:selectedRating}))
    .unwrap()
    .then(()=>{
        setRated(true);
        alert('Thank you for your rating!');
    })
    .catch((err)=>{
        alert(err || 'Failed to submit rating');
    })
   }


   const handlePayNow=()=>{
    navigate('/rider/payment/${rideId}');
   }

   if(!currentRide)return null;

   const durationMin = Math.max(Math.round(currentRide.distanceKm * 2.2), 5);


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6 text-center animate-scale-in">
     
        <div className="relative mx-auto flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-accent-green/10 animate-ping" />
          <div className="relative h-16 w-16 rounded-full bg-white text-accent-green flex items-center justify-center shadow-md border border-green-50">
            <CheckCircle2 size={28} />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">You've Arrived!</h1>
          <p className="text-xs text-primary-darkgray">Thank you for traveling partner-driver Rohan.</p>
        </div>

       
        <Card padding="spacious" className="shadow-lg border-gray-150 text-left space-y-6">
         
          <div className="grid grid-cols-3 gap-3 border-b border-gray-100 pb-5 text-center">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Fare</span>
              <p className="text-base font-extrabold text-primary">₹{currentRide.estimatedFare}</p>
            </div>
            <div className="space-y-1 border-x border-gray-100">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Distance</span>
              <p className="text-base font-extrabold text-primary">{currentRide.distanceKm} km</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Time</span>
              <p className="text-base font-extrabold text-primary">{durationMin} mins</p>
            </div>
          </div>

          <div className="text-center space-y-3 pb-3 border-b border-gray-100">
            <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider">
              {rated ? 'Driver Rated' : 'Rate your Driver'}
            </h4>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={rated || loading}
                  onClick={() => handleRatingSubmit(star)}
                  className={`p-1 transition-transform active:scale-90 ${
                    rated || loading ? 'cursor-default' : 'hover:scale-110'
                  }`}
                >
                  <Star
                    size={28}
                    className={
                      star <= (currentRide.riderRating || rating)
                        ? 'fill-accent-amber text-accent-amber'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
            {rated && (
              <span className="inline-block text-[10px] font-bold text-accent-green bg-green-50 px-2.5 py-0.5 rounded-full">
                Submitted {currentRide.riderRating || rating} Stars
              </span>
            )}
          </div>

         
          <div className="pt-2">
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={handlePayNow}
              className="font-bold flex items-center justify-center gap-1.5 py-3.5 animate-pulse-border bg-accent-green hover:bg-green-700"
              icon={DollarSign}
            >
              Pay Now (₹{currentRide.estimatedFare})
            </Button>
          </div>
        </Card>

      
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          RideMesh Billing Services
        </p>
      </div>
    </div>
  );


}


export default Completed;