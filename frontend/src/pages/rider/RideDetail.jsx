import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, Calendar, MapPin, Receipt, Star, Info, User, Car } from 'lucide-react';
import { getRideHistory, rateDriver } from '../../services/operations/rideAPI';
import Button from '../../components/Button';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';


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

const FitBounds = ({ p1, p2 }) => {
  const map = useMap();
  useEffect(() => {
    if (p1 && p2) {
      map.fitBounds(L.latLngBounds([p1, p2]), { padding: [40, 40] });
    }
  }, [p1, p2, map]);
  return null;
};

const RideDetail = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { rideHistory } = useSelector((state) => state.ride);
  const { token } = useSelector((state) => state.auth);

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingVal, setRatingVal] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);


  useEffect(() => {
    dispatch(getRideHistory({ token }));
  }, [dispatch, token]);

  
  useEffect(() => {
    if (!rideHistory || rideHistory.length === 0) {
      return;
    }

    const found = rideHistory.find((r) => r?._id === rideId);

    if (found) {
      setRide(found);
      setRatingVal(found.riderRating || 0);
    } else {
      setRide(null);
    }
    setLoading(false);
  }, [rideId, rideHistory]);


   const handleRateSubmit=(selectedRating)=>{

    setRatingVal(selectedRating);

    setRatingSubmitting(true);

     dispatch(rateDriver({rideId,rating:selectedRating,token}))
    setRatingSubmitting(false);

   }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
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

  if (loading) return <Loader message="Loading trip logs..." fullPage />;

  if (!ride) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 px-4">
        <div className="p-3 bg-red-50 text-accent-red rounded-full w-fit mx-auto"><Info size={24} /></div>
        <h2 className="text-lg font-bold">Ride Not Found</h2>
        <p className="text-xs text-gray-400">We couldn't retrieve the details for this ride record.</p>
        <Link to="/rider/history" className="inline-block text-xs font-bold text-accent-blue hover:underline">
          Return to activity history
        </Link>
      </div>
    );
  }

  const pickupPos = [ride.pickup?.latitude, ride.pickup?.longitude];
  const dropoffPos = [ride.dropoff?.latitude, ride.dropoff?.longitude];
  const routeLine = [pickupPos, dropoffPos];

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 font-sans space-y-6">
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/rider/history')}
          className="p-1.5 rounded-full hover:bg-gray-150 text-primary-darkgray hover:text-primary active:scale-90 transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-primary tracking-tight">Trip Details</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID: {ride._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        <div className="md:col-span-7 h-[300px] md:h-[450px] rounded-2xl border border-gray-150 overflow-hidden shadow-sm relative z-0">
          <MapContainer center={pickupPos} zoom={13} zoomControl={false} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds p1={pickupPos} p2={dropoffPos} />
            <Polyline positions={routeLine} color="#276EF1" weight={4} opacity={0.7} />
            <Marker position={pickupPos} icon={pickupIcon} />
            <Marker position={dropoffPos} icon={dropoffIcon} />
          </MapContainer>
        </div>

        
        <div className="md:col-span-5 space-y-5">
          
          <Card padding="normal" className="space-y-4 border-gray-150 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary-darkgray">
                <Calendar size={14} className="text-accent-blue" />
                <span>{formatDate(ride.requestedAt)}</span>
              </div>
              <StatusBadge status={ride.status} />
            </div>

      
            <div className="space-y-3 pl-1 border-l-2 border-gray-100">
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-1.5 shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Pickup</p>
                  <p className="text-xs font-semibold text-primary truncate mt-0.5">{ride.pickup?.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-red mt-1.5 shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Dropoff</p>
                  <p className="text-xs font-semibold text-primary truncate mt-0.5">{ride.dropoff?.address}</p>
                </div>
              </div>
            </div>

           
            {ride.status === 'CANCELLED' && ride.cancellationReason && (
              <div className="p-3 bg-red-50 border border-red-100 text-accent-red text-xs rounded-xl flex items-start gap-2">
                <Info size={14} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Cancellation Reason</p>
                  <p className="text-[11px] text-red-600 mt-0.5">{ride.cancellationReason}</p>
                </div>
              </div>
            )}
          </Card>

         
         {ride.status==='COMPLETED' && ( <Card padding="normal" className="space-y-4 border-gray-150 shadow-sm">
            <h3 className="text-xs font-bold text-primary-darkgray uppercase tracking-wider flex items-center gap-1.5">
              <Receipt size={14} className="text-accent-blue" /> Receipt Invoice
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Trip Base Fare</span>
                <span>₹50.00</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Distance Charges ({ride.distanceKm} km)</span>
                <span>₹{(ride.distanceKm * 12).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 pb-2.5 border-b border-gray-100">
                <span>Services Tax & SGST</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-primary pt-1">
                <span>Total Amount Charged</span>
                <span>₹{ride.estimatedFare}</span>
              </div>
            </div>
          </Card>)}

          
          {ride.status === 'COMPLETED' && (
            <Card padding="normal" className="space-y-3.5 border-gray-150 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-100 text-primary-darkgray rounded-xl"><User size={18} /></div>
                <div>
                  <h4 className="text-xs font-extrabold text-primary">Driver Partner</h4>
                  <p className="text-[10px] text-gray-400">ID: {ride.driverId || 'Mock Driver Partner'}</p>
                </div>
              </div>

             
              <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-center space-y-2">
                <p className="text-[10px] font-bold text-primary-darkgray uppercase tracking-wider">
                  {ratingVal > 0 ? 'Your Rating feedback' : 'Did you rate the driver?'}
                </p>
                <div className="flex justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={ratingVal > 0 || ratingSubmitting}
                      onClick={() => handleRateSubmit(star)}
                      className={`p-0.5 transition-transform ${
                        ratingVal > 0 || ratingSubmitting ? 'cursor-default' : 'hover:scale-110 active:scale-95'
                      }`}
                    >
                      <Star
                        size={20}
                        className={
                          star <= ratingVal
                            ? 'fill-accent-amber text-accent-amber'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideDetail;