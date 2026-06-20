import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Phone, Trash2, ShieldAlert, Award, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { getRiderProfile, updateRiderDetails, deactivateRider } from '../../services/operations/riderAPI';
import { getDriverProfile } from '../../services/operations/driverAPI';
import { setRole, logout } from '../../slices/authSlice';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import Loader from '../../components/Loader';

const RiderProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user,token } = useSelector((state) => state.auth);
  const { profile: riderProfile, loading: riderLoading, error: riderError } = useSelector((state) => state.rider);
  const { profile: driverProfile, loading: driverLoading } = useSelector((state) => state.driver);

  console.log("riderProfile is",riderProfile);
  console.log("driver Profile is",driverProfile)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [deactivating, setDeactivating] = useState(false);


  // Sync state when profile is loaded
  useEffect(() => {
    if (riderProfile) {
      setFormData({
        name: riderProfile.name || '',
        phone: riderProfile.phone || '',
      });
    } else if (user) {
      setFormData({
        name: user.name || '',
        phone: '',
      });
    }
  }, [riderProfile, user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    dispatch(
      updateRiderDetails({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        token
      })
    )
      setEditMode(false);
      
  };

  const handleDeactivate = () => {
    if (window.confirm('WARNING: Are you sure you want to deactivate your RideMesh account? This action will disable your profile and log you out.')) {
      setDeactivating(true);
      dispatch(deactivateRider({token}))
        
      setDeactivating(false);
         
    }
  };

  const handleSwitchToDriver = () => {
    dispatch(setRole('driver'));
    navigate('/driver/home');
  };

  const handleApplyToDrive = () => {
    navigate('/driver/apply');
  };

  if (riderLoading && !riderProfile) return <Loader message="Fetching profile details..." fullPage />;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 font-sans space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Profile Settings</h1>
        <p className="text-xs text-primary-darkgray">Manage your rider details, credentials, and partner status.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Details Card */}
        <Card padding="spacious" className="shadow-lg border-gray-150">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar section */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-accent-blue text-white flex items-center justify-center font-bold text-xl uppercase shadow-sm">
                  {formData.name ? formData.name[0] : 'U'}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-primary">{formData.name || 'User'}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user?.email}</span>
                  <span className="inline-flex px-2 py-0.5 rounded text-[8px] font-bold bg-accent-blue text-white uppercase tracking-wider">
                    Rider Profile
                  </span>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <Input
              label="Full Name"
              type="text"
              id="name"
              placeholder="Full Name"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              disabled={!editMode || riderLoading}
            />

            <Input
              label="Contact Number"
              type="text"
              id="phone"
              placeholder="e.g. +919876543210"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
              disabled={!editMode || riderLoading}
            />

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              {editMode ? (
                <>
                  <Button variant="ghost" onClick={() => setEditMode(false)} disabled={riderLoading}>Cancel</Button>
                  <Button type="submit" variant="primary" loading={riderLoading}>Save Changes</Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setEditMode(true)}>Edit Profile</Button>
              )}
            </div>
          </form>
        </Card>

        {/* Driver Partner Status Card */}
        <Card padding="spacious" className="shadow-lg border-gray-150 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-darkgray">Driver Portal</h3>
            <p className="text-[11px] text-gray-400">Earn additional income by applying as a partner driver.</p>
          </div>

          {/* Loading driver status */}
          {driverLoading ? (
            <div className="flex items-center gap-2 py-2 text-xs font-semibold text-gray-400">
              <RefreshCw size={14} className="animate-spin text-accent-blue" />
              <span>Verifying application records...</span>
            </div>
          ) : driverProfile ? (
            driverProfile.isApproved ? (
              // Approved driver state
              <div className="p-4 rounded-xl border border-green-100 bg-green-50/40 flex items-center justify-between gap-4">
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-accent-green">
                    <CheckCircle2 size={16} />
                    <span>Approved partner Profile</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Your driver account is active. Switch to driver mode to access the dashboard and accept trips.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSwitchToDriver}
                  className="bg-accent-green hover:bg-green-700 font-bold shrink-0 py-2.5 flex items-center gap-1"
                >
                  Go Driver <ArrowRight size={13} />
                </Button>
              </div>
            ) : (
              // Pending driver state
              <div className="p-4 rounded-xl border border-yellow-100 bg-yellow-50/40 flex items-start gap-3.5">
                <ShieldAlert size={18} className="text-yellow-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-yellow-800">Application Under Review</h4>
                  <p className="text-[10px] text-yellow-700 leading-normal">
                    We are currently verifying your credentials. Standard SLA is 24-48 hours. Once approved, you can activate driver dashboard mode from here.
                  </p>
                </div>
              </div>
            )
          ) : (
            // No driver profile yet
            <div className="p-4 rounded-xl border border-gray-150 flex items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <h4 className="text-xs font-bold text-primary">Become a partner driver</h4>
                <p className="text-[10px] text-gray-400 leading-normal">
                  Turn your car, bike, or auto rickshaw into direct income streams with RideMesh.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyToDrive}
                className="font-bold border-accent-blue text-accent-blue hover:bg-blue-50 shrink-0"
              >
                Apply Now
              </Button>
            </div>
          )}
        </Card>

        {/* Deactivation Card */}
        <Card padding="spacious" className="shadow-lg border-red-100 border bg-red-50/10 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent-red">Danger Zone</h3>
            <p className="text-[11px] text-gray-400">Account termination options. This is immediate and soft deletes profile records.</p>
          </div>
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={handleDeactivate}
              loading={deactivating}
              className="border-accent-red text-accent-red hover:bg-red-50 hover:border-accent-red font-bold flex items-center justify-center gap-1.5"
              icon={Trash2}
            >
              Deactivate account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RiderProfile;