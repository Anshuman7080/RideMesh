import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Car, FileText, Smartphone, Star, ShieldCheck, LogOut, RefreshCw, Power } from 'lucide-react';
import { getDriverProfile, updateDriverProfile } from '../../services/operations/driverAPI';
import { setError } from '../../slices/driverSlice';
import {  logoutUser } from '../../services/operations/authAPI';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';


const DriverProfile=()=>{
    const navigate=useNavigate();
    const dispatch=useDispatch();
    
    const {user,token}=useSelector((state)=>state.auth);
    const {profile,loading,error}=useSelector((state)=>state.driver);
    
    const [formData,setFormData]=useState({
        phone:'',
        vehicleType:'car',
        vehicleNumber:'',
        drivingLicense:'',
    });

    const [editMode,setEditMode]=useState(false);


    useEffect(()=>{
        if(profile){
            setFormData({
        phone: profile.phone || '',
        vehicleType: profile.vehicleType || 'car',
        vehicleNumber: profile.vehicleNumber || '',
        drivingLicense: profile.drivingLicense || '',
        });
        }
    }, [profile]);

    const handleChange=(e)=>{
        const {id,value}=e.target;
        setFormData((prev)=>({...prev,[id]:value}));
    };

  
const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateDriverProfile({ profileData: formData, token }));
    setEditMode(false);
};


    const handleLogout=()=>{
         dispatch(logoutUser());
    }

    if (loading && !profile) return <Loader message="Fetching partner logs..." fullPage />;

    if (!profile) {
        return (
        <div className="max-w-md mx-auto py-16 text-center space-y-4 px-4">
            <div className="p-3 bg-red-50 text-accent-red rounded-full w-fit mx-auto"><FileText size={24} /></div>
            <h2 className="text-lg font-bold">Driver Profile Not Active</h2>
            <p className="text-xs text-gray-400">You must submit a partner application to activate settings.</p>
            <Button variant="primary" onClick={() => navigate('/driver/apply')}>Apply to drive</Button>
        </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 font-sans space-y-6">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/driver/home')}
            className="p-1.5 rounded-full hover:bg-gray-150 text-primary-darkgray hover:text-primary active:scale-90 transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-primary tracking-tight">Partner Settings</h1>
            <p className="text-xs text-primary-darkgray">Manage your partner driver stats and credentials.</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-6">
      
        <div className="grid grid-cols-3 gap-3.5">
          <Card padding="normal" className="border-gray-150 text-center space-y-1 bg-white">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Rating</span>
            <p className="text-base font-extrabold text-accent-amber flex items-center justify-center gap-0.5">
              <Star size={14} className="fill-accent-amber text-accent-amber" /> {profile?.rating}
            </p>
          </Card>
          <Card padding="normal" className="border-gray-150 text-center space-y-1 bg-white border-x border-gray-100">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Total Trips</span>
            <p className="text-base font-extrabold text-primary">{profile?.totalTrips || 0}</p>
          </Card>
          <Card padding="normal" className="border-gray-150 text-center space-y-1 bg-white">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
            <div className="flex justify-center pt-0.5">
              <StatusBadge status={profile?.isAvailable ? 'ONLINE' : 'OFFLINE'} />
            </div>
          </Card>
        </div>

      
        <Card padding="spacious" className="shadow-lg border-gray-150 bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
           
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 mb-2">
              <div className="h-12 w-12 rounded-full bg-accent-blue text-white flex items-center justify-center font-bold text-lg uppercase shadow-sm">
                {profile?.name ? profile?.name[0] : 'D'}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-primary">{profile?.name}</h4>
                <span className="inline-flex px-2 py-0.5 rounded text-[8px] font-bold bg-green-50 text-accent-green border border-green-100 uppercase tracking-wider">
                  Verified Driver Partner
                </span>
              </div>
            </div>

            
            <Input
              label="Contact Phone"
              type="text"
              id="phone"
              placeholder="e.g. +919876543210"
              icon={Smartphone}
              value={formData.phone}
              onChange={handleChange}
              disabled={!editMode || loading}
            />

            <div className="space-y-1.5">
              <label htmlFor="vehicleType" className="block text-xs font-semibold text-primary-darkgray uppercase tracking-wider">
                Vehicle Type
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Car size={18} />
                </div>
                <select
                  id="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  disabled={!editMode || loading}
                  className="block w-full rounded-lg text-sm transition-all duration-200 border border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-50 focus:border-accent-blue py-3.5 pl-11 pr-4 bg-white text-primary appearance-none cursor-pointer"
                >
                  <option value="car">Car (Sedan/SUV/Hatchback)</option>
                  <option value="bike">Bike (Two-wheeler)</option>
                  <option value="auto">Auto Rickshaw (Three-wheeler)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <Input
              label="Vehicle Registration Number"
              type="text"
              id="vehicleNumber"
              placeholder="e.g. UP65BY1234"
              icon={Car}
              value={formData.vehicleNumber}
              onChange={handleChange}
              disabled={!editMode || loading}
            />

            <Input
              label="Driving License Number"
              type="text"
              id="drivingLicense"
              placeholder="e.g. DL-1234567890"
              icon={FileText}
              value={formData.drivingLicense}
              onChange={handleChange}
              disabled={!editMode || loading}
            />

            
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              {editMode ? (
                <>
                  <Button variant="ghost" onClick={() => setEditMode(false)} disabled={loading}>Cancel</Button>
                  <Button type="submit" variant="primary" loading={loading}>Save Credentials</Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setEditMode(true)}>Modify Details</Button>
              )}
            </div>
          </form>
        </Card>

       

        <Card padding="normal" className="border-red-150 border bg-red-50/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 text-accent-red rounded-xl"><LogOut size={18} /></div>
            <div>
              <h4 className="text-xs font-extrabold text-primary">Partner Session</h4>
              <p className="text-[9px] text-gray-400">Clear cached logs and exit</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-accent-red text-accent-red hover:bg-red-50 hover:border-accent-red font-bold py-2 px-3.5 text-xs"
          >
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  );

}


export default DriverProfile;
