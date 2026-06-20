import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, DollarSign, Calendar, MapPin, TrendingUp, Award } from 'lucide-react';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import {getRideListForDriver} from "../../services/operations/driverAPI"
import { useEffect } from 'react';



const DriverEarnings=()=>{
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const {rideHistory}=useSelector((state)=>state.ride);
    const {profile}=useSelector((state)=>state.driver);
    const {token}=useSelector((state)=>state.auth);
    const {rideList}=useSelector((state)=>state.driver);

    // console.log("rideList on earning page",rideList);

  

    useEffect(()=>{
      if(!token)return;
      dispatch(getRideListForDriver({token}));
    },[]);
   
   const displayList=rideList

   const totalTrips=displayList.length;
   const totalAmount=displayList.reduce((acc,curr)=>acc+curr.estimatedFare,0).toFixed(2);
   const ratingValue=profile?.rating || '4.8';

   const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

   return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 font-sans space-y-6">
     
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/driver/home')}
          className="p-1.5 rounded-full hover:bg-gray-150 text-primary-darkgray hover:text-primary active:scale-90 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-primary tracking-tight">Earnings Console</h1>
          <p className="text-xs text-primary-darkgray">Track your completed payouts and trip logs.</p>
        </div>
      </div>

    
      <div className="grid grid-cols-3 gap-3.5">
        <Card padding="normal" className="border-gray-150 shadow-sm text-center space-y-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Gross Payout</span>
          <p className="text-base font-extrabold text-accent-green flex items-center justify-center">
            ₹{totalAmount}
          </p>
        </Card>
        <Card padding="normal" className="border-gray-150 shadow-sm text-center space-y-1 border-x border-gray-100">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Trips Run</span>
          <p className="text-base font-extrabold text-primary">{totalTrips}</p>
        </Card>
        <Card padding="normal" className="border-gray-150 shadow-sm text-center space-y-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Cab Rating</span>
          <p className="text-base font-extrabold text-accent-amber">{ratingValue}★</p>
        </Card>
      </div>


      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary-darkgray">Completed Trip Logs</h3>
        
        {displayList?.map((log) => (
          <Card
            key={log._id}
            padding="normal"
            className="border-gray-150 bg-white shadow-sm"
          >
            <div className="flex flex-col space-y-3.5">
             
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary-darkgray">
                  <Calendar size={14} className="text-accent-blue" />
                  <span>{formatDate(log.requestedAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-primary"> ₹{Number(log.estimatedFare).toFixed(2)}</span>
                  <StatusBadge status={log.status} />
                </div>
              </div>

          
              <div className="space-y-2.5 pl-1.5 border-l-2 border-gray-100">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-1 shrink-0"></div>
                  <p className="text-xs font-semibold text-primary truncate leading-none">{log.pickup?.address}</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-red mt-1 shrink-0"></div>
                  <p className="text-xs font-semibold text-primary truncate leading-none">{log.dropoff?.address}</p>
                </div>
              </div>

              {/* Summary line */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>Distance: {log.distanceKm} km</span>
                <span className="text-accent-green flex items-center gap-0.5">
                  <TrendingUp size={11} /> +100% payout settled
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

}

export default DriverEarnings;