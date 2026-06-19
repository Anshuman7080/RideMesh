import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Clock, MapPin, Check, X, AlertTriangle } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { getDriverRequests,acceptRide, rejectRide } from '../../services/operations/rideAPI';

const DriverRequests=()=>{
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const {driverRequests,loading,error}=useSelector((state)=>state.ride);
    const [detailedRequests,setDetailedRequests]=useState([]);
    const [fetchingDetails,setFetchingDetails]=useState(false);
    const {token}=useSelector((state)=>state.auth);

    useEffect(()=>{
      if(!token)return;
        dispatch(getDriverRequests(token));
    },[token]);

    useEffect(() => {
  setDetailedRequests(driverRequests);
}, [driverRequests]);




const handleAccept=(rideId)=>{
     if(!rideId || !token)return;

     dispatch(acceptRide(rideId,token,navigate));

     
}

const handleReject=(rideId)=>{
    dispatch(rejectRide({rideId,token}));
}


const mockRequests = [
    {
      rideId: 'mock_req_1',
      details: {
        _id: 'mock_req_1',
        pickup: { address: 'Lanka, BHU Entrance Gate, Varanasi' },
        dropoff: { address: 'Varanasi Junction Cantt Railway Station' },
        estimatedFare: 130,
        distanceKm: 6.8,
      }
    },
    {
      rideId: 'mock_req_2',
      details: {
        _id: 'mock_req_2',
        pickup: { address: 'Assi Ghat Staircase, Ghats, Varanasi' },
        dropoff: { address: 'Sarnath Deer Park Stupa Gateway' },
        estimatedFare: 210,
        distanceKm: 12.1,
      }
    }
];

const displayList=detailedRequests;

 return (
    <div className="max-w-2xl mx-auto  w-full px-4 py-8 font-sans space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/driver/home')}
          className="p-1.5 rounded-full hover:bg-gray-100 text-primary-darkgray hover:text-primary active:scale-90 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-primary tracking-tight">Active Request Tickets</h1>
          <p className="text-xs text-primary-darkgray">Accept or reject active ride requests in your vicinity.</p>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2.5 text-accent-red text-xs font-medium animate-fade-in">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state indicator */}
      {(loading || fetchingDetails) && detailedRequests.length === 0 ? (
        <Loader message="Fetching incoming requests details..." />
      ) : (
        <div className="space-y-4">
          {displayList.length === 0 ? (
            <Card padding="spacious" className="text-center space-y-3 border-gray-150 shadow-sm bg-white">
              <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto text-gray-400">
                <Clock size={24} />
              </div>
              <h3 className="text-sm font-bold text-primary">No requests active</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Once a rider requests a match within your range, it will appear here. Keep your status online.
              </p>
            </Card>
          ) : (
            displayList.map((req) => (
              <Card
                key={req.rideId}
                padding="normal"
                className="border-gray-150 hover:border-gray-300 shadow-sm"
              >
                <div className="space-y-4">
                  {/* Fare & distance header */}
                  <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
                    <span className="text-xs font-extrabold text-primary">₹{req.details?.estimatedFare}</span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-accent-blue border border-blue-100">
                      {req.details?.distanceKm} km trip
                    </span>
                  </div>

                  {/* Route location snippets */}
                  <div className="space-y-3 pl-1 border-l-2 border-gray-100">
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-1 shrink-0"></div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Pickup</p>
                        <p className="text-xs font-semibold text-primary mt-0.5 leading-normal">{req.details?.pickup?.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-red mt-1 shrink-0"></div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Dropoff</p>
                        <p className="text-xs font-semibold text-primary mt-0.5 leading-normal">{req.details?.dropoff?.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Accept / Reject Buttons */}
                  <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-gray-50">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleReject(req.rideId)}
                      disabled={loading || fetchingDetails}
                      className="border-accent-red text-accent-red hover:bg-red-50 hover:border-accent-red font-semibold py-2.5 flex items-center justify-center gap-1.5"
                      icon={X}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleAccept(req.rideId)}
                      disabled={loading || fetchingDetails}
                      className="bg-accent-green hover:bg-green-700 font-bold py-2.5 flex items-center justify-center gap-1.5"
                      icon={Check}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}


export default DriverRequests;