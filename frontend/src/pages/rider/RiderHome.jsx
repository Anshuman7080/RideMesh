import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin, Navigation, History, Car, ArrowRight, Star } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import BottomSheet from '../../components/BottomSheet';
import SidePanel from '../../components/SidePanel';


import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useSelector } from 'react-redux';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:markerIcon2x,
    iconUrl:markerIcon,
    shadowUrl:markerShadow,
});

const ChangeMapView=({center})=>{
    const map=useMap();
    useEffect(()=>{
        if(center){
            map.setView(center,14);
        }
    },[center,map]);


    return null;
}


const RiderHome = ({
  onSearchClick = () => {},
  onApplyDriverClick = () => {},
}) => {
  
    const {user}=useSelector((state)=>state.auth)

    const defaultPosition=[25.3176,82.9739];
    const [position,setPosition]=useState(defaultPosition);
    const [hasLocation,setHasLocation]=useState(false);
     const [isPanelOpen,setIsPanelOpen]=useState(true);
    
    //  fetch user geolocation
    useEffect(()=>{
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(
            (pos)=>{
                setPosition([pos.coords.latitude,pos.coords.longitude]);
                setHasLocation(true);
            },
            (error)=>{
                console.warn("Geolocation permission denied or error:",error);
            },
            {enableHighAccuracy:true}
          )
        }
    },[]);


    const recentLocations=[
        { id: 1, name: 'Dashashwamedh Ghat', address: 'Ghats, Varanasi, UP', type: 'recent' },
        { id: 2, name: 'BHU Main Gate', address: 'Lanka, Varanasi, UP', type: 'saved' },
        { id: 3, name: 'Varanasi Junction', address: 'Railway Station, Varanasi', type: 'recent' }
    ]


const renderPanelContent = () => (
    <div className="space-y-6">
   
      <div>
        <h2 className="text-xl font-extrabold text-primary tracking-tight font-sans">
          Welcome back, {user?.name || "Rider"}!
        </h2>
        <p className="text-xs text-primary-darkgray mt-1">Where are we heading today?</p>
      </div>

      
      <div 
        onClick={onSearchClick}
        className="flex items-center gap-3 px-4 py-3.5 bg-primary-gray hover:bg-gray-200/80 rounded-xl cursor-pointer transition-all border border-gray-100 hover:border-gray-300"
      >
        <Search className="text-accent-blue" size={18} />
        <span className="text-sm text-gray-500 font-medium">Enter destination...</span>
      </div>

      <Card className="bg-gradient-to-br from-primary to-primary-light border-none text-white p-4.5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-flex px-2 py-0.5 rounded text-[8px] font-bold bg-accent-blue text-white uppercase tracking-wider">
              Earn Money
            </span>
            <h4 className="text-sm font-bold tracking-tight pt-1">Drive with RideMesh</h4>
            <p className="text-[11px] text-gray-300">Convert your vehicle into income. Flexible hours, instant payouts.</p>
          </div>
          <div className="p-2 bg-white/10 rounded-lg text-white">
            <Car size={20} />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10 hover:text-white p-0 text-xs font-semibold flex items-center gap-1.5"
            onClick={onApplyDriverClick}
          >
            Apply Now <ArrowRight size={13} />
          </Button>
        </div>
      </Card>

  
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary-darkgray">
          Recent Locations
        </h3>
        <div className="divide-y divide-gray-100">
          {recentLocations.map((loc) => (
            <div
              key={loc.id}
              onClick={onSearchClick}
              className="flex items-start gap-3.5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-gray-100 text-primary-darkgray">
                {loc.type === 'saved' ? <Star size={16} className="text-accent-amber fill-accent-amber" /> : <History size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary truncate">{loc.name}</p>
                <p className="text-xs text-gray-400 truncate">{loc.address}</p>
              </div>
              <ArrowRight size={14} className="text-gray-300 self-center" />
            </div>
          ))}
        </div>
      </div>
    </div>
);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
     
      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
              setPosition([pos.coords.latitude, pos.coords.longitude]);
              setHasLocation(true);
            });
          }
        }}
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-30 p-3 bg-white rounded-full shadow-lg text-primary hover:bg-gray-100 active:scale-90 transition-all border border-gray-100"
        title="Recenter location"
      >
        <Navigation size={20} className="fill-current" />
      </button>

     
      <div className="absolute inset-0 w-full h-full">
        <MapContainer
          center={position}
          zoom={14}
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeMapView center={position} />
          <Marker position={position}>
            <Popup>
              <div className="text-center p-1">
                <p className="text-xs font-bold text-primary">Your current location</p>
                {!hasLocation && <p className="text-[10px] text-gray-400 mt-0.5">Using default location</p>}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

     
      <SidePanel 
        isOpen={isPanelOpen} 
        onClose={null} 
        showCloseButton={false} 
        title={null}
        width="w-[380px]"
      >
        {renderPanelContent()}
      </SidePanel>

      
      <BottomSheet 
        isOpen={isPanelOpen} 
        onClose={() => {}}
        showCloseButton={false} 
        title={null}
        snapPoints="max-h-[60vh]"
      >
        {renderPanelContent()}
      </BottomSheet>
    </div>
  );
};

export default RiderHome;
