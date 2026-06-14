import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, MapPin, Calendar, Clock } from 'lucide-react';
import Button from '../components/Button';

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-dark via-primary to-primary-light text-white flex flex-col justify-between font-sans">
      {/* Header Bar */}
      <header className="px-6 py-6 md:px-12 flex items-center justify-between">
        <span className="font-extrabold text-xl tracking-wider bg-white text-primary px-3 py-1.5 rounded-lg">
          <span className="text-accent-blue">Ride</span>Mesh
        </span>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 text-center space-y-8 my-auto flex flex-col justify-center items-center">
    
        <div className="relative mb-6">
          <div className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-accent-blue/10 animate-ping" />
          <div className="relative h-20 w-20 rounded-2xl bg-white text-primary flex items-center justify-center shadow-2xl animate-scale-in">
            <svg
              className="text-accent-blue h-10 w-10"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Ride Hailing, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-blue-400">
              Reimagined
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed font-light">
            Fast, secure, and decentralized microservice-backed rides. Experience real-time live location tracking, instant notifications, and friction-free payment checkouts.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl pt-8 w-full">
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 text-left space-y-2 hover:bg-white/10 transition-colors">
            <div className="p-2 bg-accent-blue/20 text-accent-blue rounded-lg w-fit">
              <Clock size={16} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider">Instant Matches</h3>
            <p className="text-[11px] text-gray-400">Smart routing algorithms match you with the nearest eligible driver in seconds.</p>
          </div>
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 text-left space-y-2 hover:bg-white/10 transition-colors">
            <div className="p-2 bg-accent-green/20 text-accent-green rounded-lg w-fit">
              <Shield size={16} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider">Safe & Secure</h3>
            <p className="text-[11px] text-gray-400">Each ride is monitored live. Encrypted endpoints and identity verification keep you safe.</p>
          </div>
          <div className="p-5 bg-white/5 rounded-xl border border-white/10 text-left space-y-2 hover:bg-white/10 transition-colors">
            <div className="p-2 bg-accent-amber/20 text-accent-amber rounded-lg w-fit">
              <ArrowRight size={16} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider">Flexible Payments</h3>
            <p className="text-[11px] text-gray-400">Integrated Razorpay checkout allows direct, transparent secure billing.</p>
          </div>
        </div>

        <div className="pt-8 w-full max-w-xs animate-slide-up">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            className=" text-primary hover:bg-gray-150 font-bold focus:ring-white flex items-center justify-center gap-2"
            onClick={() => navigate('/login')}
          >
           <div className='flex items-center'> Get Started <ArrowRight size={18} /></div>
          </Button>
        </div>
      </main>

  
      <footer className="py-6 text-center text-[10px] text-gray-500 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} RideMesh Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default Splash;
