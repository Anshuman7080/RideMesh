import React, { useEffect } from 'react';
import { useNavigate as useRoutingNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { History, Calendar, MapPin, ArrowRight, Star } from 'lucide-react';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { getRideHistory } from '../../services/operations/rideAPI';

const RideHistory = () => {
  const navigate = useRoutingNavigate();
  const dispatch=useDispatch();
  const { rideHistory } = useSelector((state) => state.ride);
  const {token}=useSelector((state)=>state.auth);


  const displayList = rideHistory

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

  useEffect(()=>{
    console.log("coming in ridehistory");
    dispatch(getRideHistory({token}));
  },[]);

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 font-sans space-y-6">
      
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Your Activity</h1>
        <p className="text-xs text-primary-darkgray">View details and billing receipts of your past trips.</p>
      </div>

      
      <div className="space-y-4">
        {displayList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-150 p-6 space-y-3">
            <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto text-gray-400">
              <History size={24} />
            </div>
            <h3 className="text-sm font-bold text-primary">No rides found</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              You haven't requested any rides yet. Book your first ride from the dashboard home page.
            </p>
          </div>
        ) : (
          displayList.map((ride) => (
            <Card
              key={ride._id}
              hoverable
              padding="normal"
              onClick={() => navigate(`/rider/history/${ride._id}`)}
              className="border-gray-150 hover:border-gray-300"
            >
              <div className="flex flex-col space-y-4">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary-darkgray">
                    <Calendar size={14} className="text-accent-blue" />
                    <span>{formatDate(ride.requestedAt)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-primary">
                              ₹{Number(ride?.estimatedFare ?? 0).toFixed(2)}
                            </span>

                    <StatusBadge status={ride.status} />
                  </div>
                </div>

                
                <div className="space-y-2.5 pl-1.5 border-l-2 border-gray-100">
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-1 shrink-0"></div>
                    <p className="text-xs font-semibold text-primary truncate leading-none">{ride.pickup?.address}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-red mt-1 shrink-0"></div>
                    <p className="text-xs font-semibold text-primary truncate leading-none">{ride.dropoff?.address}</p>
                  </div>
                </div>


                <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <span>Distance: {ride.distanceKm} km</span>
                  {ride.status === 'COMPLETED' && (
                    <div className="flex items-center gap-1">
                      {ride.riderRating ? (
                        <>
                          <Star size={11} className="fill-accent-amber text-accent-amber" />
                          <span className="text-accent-amber">{ride.riderRating} Stars</span>
                        </>
                      ) : (
                        <span className="text-accent-blue hover:underline">Rate Driver</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RideHistory;
