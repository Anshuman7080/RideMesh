import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6 text-center animate-scale-in">
      
        <div className="relative mx-auto flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full bg-accent-red/10 animate-ping" />
          <div className="relative h-16 w-16 rounded-full bg-white text-accent-red flex items-center justify-center shadow-md border border-red-50">
            <AlertCircle size={32} />
          </div>
        </div>

        
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Payment Failed</h1>
          <p className="text-xs text-primary-darkgray">The transaction signature verification failed.</p>
        </div>

       
        <Card padding="spacious" className="shadow-lg border-gray-150 text-left space-y-5">
          <div className="flex items-start gap-3.5 pb-4 border-b border-gray-100">
            <div className="p-2 rounded-lg bg-red-50 text-accent-red">
              <AlertCircle size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-primary">Transaction Unverified</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Please check your network or bank status.</p>
            </div>
          </div>

          <p className="text-xs text-primary-darkgray leading-relaxed">
            We were unable to secure a matching signature verification from the Razorpay servers. If the amount has been debited from your account, it will be automatically refunded within 3-5 business days.
          </p>

          <div className="space-y-2.5 pt-2">
            <Button
              variant="primary"
              fullWidth
              size="md"
              className="font-bold flex items-center justify-center gap-1.5 py-3 bg-accent-red hover:bg-red-700 focus:ring-accent-red"
              onClick={() => navigate('/rider/home')}
            >
             <div className="flex items-center gap-1"> Return to Home <ArrowRight size={15} /></div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentFailure;
