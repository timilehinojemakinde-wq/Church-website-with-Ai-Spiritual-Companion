
import React from 'react';
import { Camera, Upload, Heart, Loader2 } from 'lucide-react';
import { User } from '../types';

interface WelcomeProps {
  currentUser: User | null;
  onLogin: () => void;
  isAuthLoading: boolean;
}

const Welcome: React.FC<WelcomeProps> = ({ currentUser, onLogin, isAuthLoading }) => {
  
  const handleUploadClick = () => {
    // Navigate to socials view immediately. The Gallery component will handle the login prompt if needed.
    window.location.hash = 'socials';
  };

  const handleAppLaunch = () => {
    window.location.hash = 'socials';
  };

  return (
    <section id="socials-preview" className="relative py-32 bg-[#050505] overflow-hidden border-y border-white/5">
       {/* Cinematic Background Image with Overlay */}
       <div className="absolute inset-0 w-full h-full">
          <img 
             src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2000&auto=format&fit=crop" 
             alt="Church Community" 
             className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/80 to-[#050505]"></div>
       </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          <div className="text-center lg:text-left max-w-xl animate-fade-in-up">
             <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                <Camera size={14} className="text-rccg-gold" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Digital Fellowship</span>
             </div>
             
             <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 leading-tight">
                Service was good? <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-rccg-gold to-yellow-200">Share your beautiful pictures</span> here on AMBASSADORS SOCIALS.
             </h2>
             <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">
                Share your beautiful pictures and moments during service today on our social media platform. Join our digital community and see the joy of the Lord in action.
             </p>

             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                   onClick={handleUploadClick}
                   className="px-8 py-4 bg-rccg-red text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-rccg-red/20"
                >
                   <Upload size={14} />
                   Upload Pictures
                </button>
                
                <button 
                   onClick={handleAppLaunch}
                   className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2"
                >
                   View Gallery
                </button>
             </div>
          </div>

          <div className="relative max-w-xs w-full animate-fade-in-up" style={{ animationDelay: '100ms' }}>
             <div onClick={handleAppLaunch} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] cursor-pointer border border-white/10 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
                
                {/* Clean "AMASSADORS SOCIALS" Branding */}
                <div className="text-center p-6">
                   <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-rccg-red transition-colors duration-500">
                      <Camera size={32} className="text-white/80" />
                   </div>
                   <h3 className="text-3xl font-black text-white tracking-tighter mb-1 font-sans">
                      PTA <span className="text-rccg-red group-hover:text-white transition-colors">SOCIALS</span>
                   </h3>
                   <p className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">
                      Connect . Share . Inspire
                   </p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

                <div className="absolute top-4 right-4 z-20">
                   <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                      <Heart size={10} className="text-rccg-red fill-rccg-red" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-white">Live</span>
                   </div>
                </div>
             </div>
             
             {/* Glow effects */}
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full h-16 bg-rccg-red/20 blur-[40px] -z-10 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
