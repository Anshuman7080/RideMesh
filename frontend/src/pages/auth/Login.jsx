import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, LogIn, AlertTriangle } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import {login} from "../../services/operations/authAPI"
import {clearError} from "../../slices/authSlice";

const Login = () => {
 
 const navigate=useNavigate();
 const dispatch=useDispatch();

 const {loading,error,user}=useSelector((state)=>state.auth);
 const [formData,setFormData]=useState({
    email:'',
    password:'',
 })

   const [formErrors, setFormErrors] = useState({});
   
 useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

 useEffect(()=>{
    if(user){
        if(user.role==='driver'){
            navigate('/driver/home');
        }else{
            navigate('/rider/home');
        }
    }
 },[user,navigate]);


const handleChange=(e)=>{
    const {id,value}=e.target;
    setFormData((prev)=>({...prev,[id]:value}));
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: '' }));
    }
}

 const validate = () => {
    const errors = {};
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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
};

const handleSubmit=(e)=>{
    e.preventDefault();
    if(!validate())return;

    dispatch(login());
}



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6 animate-scale-in">
       
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block font-sans font-extrabold text-2xl tracking-wider bg-primary text-white px-3 py-1.5 rounded-lg">
            <span className="text-accent-blue">Ride</span>Mesh
          </Link>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight pt-3">Sign in to your account</h1>
          <p className="text-xs text-primary-darkgray">Welcome back! Please enter your details below.</p>
        </div>

       
        <Card padding="spacious" className="shadow-lg border-gray-150">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Global API Error Alert */}
            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2.5 text-accent-red text-xs font-medium animate-fade-in">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
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

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="Enter your password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              disabled={loading}
              autoComplete="current-password"
            />


            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              icon={LogIn}
              className="mt-2 font-bold"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-medium">New to RideMesh?</span>
            </div>
          </div>

          {/* Join action redirect */}
          <div className="text-center">
            <Link
              to="/signup"
              className="inline-block text-xs font-bold text-accent-blue hover:underline"
            >
              Create a rider account
            </Link>
          </div>
        </Card>

        {/* Footer info */}
        <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
          Secured Microservice Portal
        </p>
      </div>
    </div>
  );
};

export default Login;
