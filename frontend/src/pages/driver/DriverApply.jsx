import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Car, FileText, Smartphone, AlertTriangle } from 'lucide-react';
import { applyDriver } from '../../services/operations/driverAPI';
import {clearDriverError} from "../../slices/driverSlice"
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

const DriverApply = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, applied } = useSelector((state) => state.driver);

  const [formData, setFormData] = useState({
    phone: '',
    vehicleType: 'car',
    vehicleNumber: '',
    drivingLicense: '',
  });
  
  const [formErrors, setFormErrors] = useState({});

 
  useEffect(() => {
    dispatch(clearDriverError());
  }, [dispatch]);


  useEffect(() => {
    if (applied) {
      navigate('/driver/apply/submitted');
    }
  }, [applied, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,13}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-12 digit phone number';
    }

   
    if (!formData.vehicleType) {
      errors.vehicleType = 'Vehicle type is required';
    }

    if (!formData.vehicleNumber) {
      errors.vehicleNumber = 'Vehicle registration number is required';
    } else if (formData.vehicleNumber.trim().length < 5) {
      errors.vehicleNumber = 'Please enter a valid registration number';
    }

  
    if (!formData.drivingLicense) {
      errors.drivingLicense = 'Driving license number is required';
    } else if (formData.drivingLicense.trim().length < 5) {
      errors.drivingLicense = 'Please enter a valid license number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(
      applyDriver({
        phone: formData.phone.trim(),
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
        drivingLicense: formData.drivingLicense.trim().toUpperCase(),
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg space-y-6 animate-scale-in">
        
        <div className="flex justify-start">
          <Link
            to="/rider/home"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-darkgray hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Cancel and return home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Apply to drive on RideMesh</h1>
          <p className="text-xs text-primary-darkgray">Provide your details below to activate your partner profile.</p>
        </div>

        
        <Card padding="spacious" className="shadow-lg border-gray-150">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2.5 text-accent-red text-xs font-medium animate-fade-in">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            
            <Input
              label="Contact Number"
              type="text"
              id="phone"
              placeholder="e.g. +919876543210"
              icon={Smartphone}
              value={formData.phone}
              onChange={handleChange}
              error={formErrors.phone}
              disabled={loading}
              autoComplete="tel"
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
                  disabled={loading}
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
              error={formErrors.vehicleNumber}
              disabled={loading}
            />

          
            <Input
              label="Driving License Number"
              type="text"
              id="drivingLicense"
              placeholder="e.g. DL-1234567890"
              icon={FileText}
              value={formData.drivingLicense}
              onChange={handleChange}
              error={formErrors.drivingLicense}
              disabled={loading}
            />

           
            <p className="text-[10px] text-gray-400 leading-normal">
              By submitting this form, you confirm that all details are accurate, and your license/registration numbers are valid under transport regulations.
            </p>

           
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-2 font-bold"
            >
              Submit Application
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DriverApply;
