import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6 text-center animate-scale-in">
        
        <div className="relative mx-auto flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-accent-green/10 animate-ping" />
          <div className="relative h-16 w-16 rounded-full bg-white text-accent-green flex items-center justify-center shadow-md border border-green-50">
            <CheckCircle2 size={32} />
          </div>
        </div>

 
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Payment Successful!</h1>
          <p className="text-xs text-primary-darkgray">Your transaction has been verified successfully.</p>
        </div>

       
        <Card padding="spacious" className="shadow-lg border-gray-150 text-left space-y-5">
          <div className="flex items-start gap-3.5 pb-4 border-b border-gray-100">
            <div className="p-2 rounded-lg bg-green-50 text-accent-green">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-primary">Transaction Secured</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Reference ID: TXN-{Math.floor(10000000 + Math.random() * 90000000)}</p>
            </div>
          </div>

          <p className="text-xs text-primary-darkgray leading-relaxed">
            Your payment for the ride has been received and confirmed. The partner driver's payout has been dispatched. You can view the billing slip under your activity logs.
          </p>

          <div className="pt-2">
            <Button
              variant="primary"
              fullWidth
              size="md"
              className="font-bold flex items-center justify-center gap-1.5 py-3 bg-accent-green hover:bg-green-700"
              onClick={() => navigate('/rider/home')}
            >
             <div className="flex items-center gap-1">  Return to Home <ArrowRight size={15} /></div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
