import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, UserPlus, AlertTriangle } from 'lucide-react';
import {sentOtp} from "../../services/operations/authAPI"
import {clearError} from "../../slices/authSlice";
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

const Signup = () => {

    const navigate=useNavigate();
    const dispatch=useDispatch();

    const {loading,error,otpSent,otpSentEmail}=useSelector((state)=>state.auth);

    console.log("loading,error,otpSent,otpSentEmail",loading,error,otpSent,otpSentEmail)

    const [formData,setFormData]=useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:'',
    });

    const [formErrors,setFormErrors]=useState({});

    useEffect(()=>{
        dispatch(clearError());
    },[dispatch])

    useEffect(()=>{
        if(otpSent && otpSentEmail){
            navigate('/verify-otp');
        }
    },[otpSent,otpSentEmail,navigate]);

    const handleChange=(e)=>{
        const {id,value}=e.target;
        setFormData((prev)=>({...prev,[id]:value}));
        if(formErrors[id]){
            setFormErrors((prev)=>({...prev,[id]:''}));
        }
    }

    const validate = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSubmit=(e)=>{
    e.preventDefault();

    if(!validate())return;
    const name=formData?.name;
    const password=formData?.password
    const email=formData?.email

    dispatch(sentOtp({name,email,password}));
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6 animate-scale-in">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block font-sans font-extrabold text-2xl tracking-wider bg-primary text-white px-3 py-1.5 rounded-lg">
            <span className="text-accent-blue">Ride</span>Mesh
          </Link>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight pt-3">Create a rider account</h1>
          <p className="text-xs text-primary-darkgray">Sign up to request and track rides in real time.</p>
        </div>

    
        <Card padding="spacious" className="shadow-lg border-gray-150">
          <form onSubmit={handleSubmit} className="space-y-4">
   
            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2.5 text-accent-red text-xs font-medium animate-fade-in">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

     
            <Input
              label="Full Name"
              type="text"
              id="name"
              placeholder="e.g. John Doe"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              disabled={loading}
              autoComplete="name"
            />

          
            <Input
              label="Email Address"
              type="email"
              id="email"
              placeholder="e.g. name@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              disabled={loading}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="Create a strong password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              disabled={loading}
              autoComplete="new-password"
            />

   
            <Input
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              placeholder="Re-enter your password"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              disabled={loading}
              autoComplete="new-password"
            />

      
            <p className="text-[10px] text-gray-400 leading-normal">
              By signing up, you agree to become a Rider. You can easily apply to become a Driver later from your profile settings.
            </p>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              icon={UserPlus}
              className="mt-2 font-bold animate-pulse-border"
            >
              Send Verification OTP
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-medium">Already registered?</span>
            </div>
          </div>

  
          <div className="text-center">
            <Link
              to="/login"
              className="inline-block text-xs font-bold text-accent-blue hover:underline"
            >
              Sign in to your account
            </Link>
          </div>
        </Card>

    
        <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
          Secured Microservice Portal
        </p>
      </div>
    </div>
  );
};

export default Signup;
