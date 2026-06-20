import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';

const ApplySubmitted = () => {
  const navigate = useNavigate();
   
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6 text-center animate-scale-in">
      
        <div className="relative mx-auto flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-accent-blue/10 animate-ping" />
          <div className="relative h-16 w-16 rounded-full bg-white text-accent-blue flex items-center justify-center shadow-md border border-blue-50">
            <Clock size={28} className="animate-pulse" />
          </div>
        </div>

       
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Application Submitted</h1>
          <p className="text-xs text-primary-darkgray">Your partner profile registration is now complete.</p>
        </div>

   
        <Card padding="spacious" className="shadow-lg border-gray-150 text-left space-y-4">
          <div className="flex items-start gap-3.5 pb-4 border-b border-gray-100">
            <div className="p-2 rounded-lg bg-blue-50 text-accent-blue">
              <ClipboardCheck size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">Status: Pending Verification</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Application ID: App-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs text-primary-darkgray leading-relaxed">
            <p>
              Thank you for applying to become a RideMesh partner! Our admin operations team is currently validating your driving license and vehicle registration logs.
            </p>
            
            <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <ShieldCheck size={15} className="shrink-0 mt-0.5 text-accent-green" />
              <span>
                Standard approval SLA is 24 to 48 hours. You will receive an automated email notification once your profile is approved.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              fullWidth
              size="md"
              className="font-bold flex items-center justify-center gap-1.5"
              onClick={() => navigate('/rider/home')}
            >
              <div className="flex items-center gap-1">Back to Rider Home <ArrowRight size={15} /></div>
            </Button>
          </div>
        </Card>

        
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          RideMesh Partner Operations
        </p>
      </div>
    </div>
  );
};

export default ApplySubmitted;
