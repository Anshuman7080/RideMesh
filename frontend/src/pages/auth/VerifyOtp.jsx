import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { verifyOtp, resendOtp } from "../../services/operations/authAPI"
import {clearError} from "../../slices/authSlice";
import Button from '../../components/Button';
import Card from '../../components/Card';

const VerifyOtp = () => {

    const navigate=useNavigate();
    const dispatch=useDispatch();

    const {loading,error,signUpSuccess,otpSentEmail}=useSelector((state)=>state.auth);


    const [email,setEmail]=useState(otpSentEmail || '');
    const [showEmailInput,setShowEmailInput]=useState(!otpSentEmail);

    const [otpVal,setOtpVal]=useState(['','','','','','']);

    const inputRefs=useRef([]);

    const [resendTimer,setResendTimer]=useState(30);
    const [canResend,setCanResend]=useState(false);

    useEffect(()=>{
        dispatch(clearError());
    },[dispatch]);
   

    useEffect(()=>{
        let interval=null;
        if(resendTimer>0){
            interval=setInterval(()=>{
                setResendTimer((prev)=>prev-1);
        },1000);
        }else{
            setCanResend(true);
            clearInterval(interval);
        }

        return ()=>clearInterval(interval);
    },[resendTimer]);

    // useEffect(()=>{
    //     if(signUpSuccess){
    //         navigate('/rider/home');
    //     }
    // },[signUpSuccess,navigate]);


    const handleChange=(index,value)=>{
        if(isNaN(value))return;

        const newOtp=[...otpVal];
        newOtp[index]=value.substring(value.length-1);
        setOtpVal(newOtp);

        if(value && index<5){
            inputRefs.current[index+1].focus();
        }
    }

    const handleKeyDown=(index,e)=>{
        if(e.key==='Backspace' && !otpVal[index] && index>0){
            inputRefs.current[index-1].focus();
        }
    };


    const handleResend=()=>{
        if(!email){
            alert("Please enter an email address to resend OTP");
            return;
        }

        dispatch(resendOtp()).
        unwrap().then(()=>{
            setResendTimer(30);
            setCanResend(false);
            alert("Verification OTP has been resent to your email.");
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        const otpCode=otpVal.join('');
        if(otpCode.length<6){
            alert("Please enter all 6 digits of the OTP.");
            return;
        }
        if(!email){
            alert("Email address is missing.");
            return;
        }

        dispatch(verifyOtp({}));
    }

  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6 animate-scale-in">
       
        <div className="flex justify-start">
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-darkgray hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Back to Sign Up
          </Link>
        </div>

       
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Verify your email</h1>
          <p className="text-xs text-primary-darkgray leading-relaxed">
            We've sent a 6-digit verification code to <br />
            <span className="font-bold text-primary">{email || 'your email address'}</span>.
          </p>
        </div>

        <Card padding="spacious" className="shadow-lg border-gray-150">
          <form onSubmit={handleSubmit} className="space-y-6">
     
            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2.5 text-accent-red text-xs font-medium animate-fade-in">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Input Fallback (if user direct navigated) */}
            {showEmailInput && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-primary-darkgray uppercase tracking-wider">
                  Confirm Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-accent-blue"
                  disabled={loading}
                />
              </div>
            )}

            {/* 6 Digit OTP Box Layout */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-primary-darkgray uppercase tracking-wider text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-between gap-2.5">
                {otpVal.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-lg font-bold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-accent-blue bg-white text-primary"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              icon={CheckCircle2}
              className="font-bold"
            >
              Verify Code
            </Button>
          </form>

          {/* Resend Action */}
          <div className="mt-6 flex flex-col items-center gap-1 text-xs text-primary-darkgray border-t border-gray-100 pt-5">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="inline-flex items-center gap-1.5 font-bold text-accent-blue hover:underline active:scale-95 transition-all"
              >
                <RefreshCw size={13} /> Resend verification code
              </button>
            ) : (
              <p className="text-gray-400">
                Resend code in <span className="font-bold text-primary">{resendTimer}s</span>
              </p>
            )}

            {/* Switch email toggle (in case they made a typo) */}
            {!otpSentEmail && (
              <button
                type="button"
                onClick={() => setShowEmailInput(!showEmailInput)}
                className="mt-2 text-[10px] text-gray-400 hover:text-primary underline"
              >
                {showEmailInput ? 'Hide email entry' : 'Change email address'}
              </button>
            )}
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

export default VerifyOtp;
