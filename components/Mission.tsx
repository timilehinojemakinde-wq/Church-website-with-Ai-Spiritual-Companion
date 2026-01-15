import React from 'react';
import { Target, Eye } from 'lucide-react';

const Mission: React.FC = () => {
  return (
    <section className="py-24 bg-rccg-blue text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-rccg-green opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-rccg-red opacity-20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Intro Text */}
          <div className="animate-fade-in-up">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-rccg-gold rounded-full"></div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-rccg-gold">Our Mandate</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
                Driven by <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Eternity.</span>
             </h2>
             <p className="text-lg text-blue-100/80 font-light leading-relaxed mb-8">
                We are a church with a clear purpose: to bring heaven down to earth and to take as many people as possible back to heaven with us.
             </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="space-y-6">
             
             {/* Vision Card */}
             <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-lg bg-rccg-gold/20 flex items-center justify-center text-rccg-gold shrink-0">
                      <Eye size={20} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
                      <p className="text-sm text-blue-100/70 leading-relaxed">
                         To plant churches within five minutes walking distance in every city and town of developing countries and within five minutes driving distance in every city and town of developed countries.
                      </p>
                   </div>
                </div>
             </div>

             {/* Mission Card */}
             <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-lg bg-rccg-green/20 flex items-center justify-center text-rccg-green shrink-0">
                      <Target size={20} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white mb-2">Our Mission</h3>
                      <ul className="space-y-2 text-sm text-blue-100/70">
                         <li className="flex gap-2 items-start">
                            <span className="text-rccg-green mt-1">•</span> To make heaven.
                         </li>
                         <li className="flex gap-2 items-start">
                            <span className="text-rccg-green mt-1">•</span> To take as many people with us.
                         </li>
                         <li className="flex gap-2 items-start">
                            <span className="text-rccg-green mt-1">•</span> To have a member of RCCG in every family of all nations.
                         </li>
                         <li className="flex gap-2 items-start">
                            <span className="text-rccg-green mt-1">•</span> Holiness will be our lifestyle.
                         </li>
                      </ul>
                   </div>
                </div>
             </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Mission;