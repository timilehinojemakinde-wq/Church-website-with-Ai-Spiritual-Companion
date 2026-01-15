
import React, { useState } from 'react';
import { Copy, Check, CreditCard } from 'lucide-react';

const Giving: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const accountNumber = "0918489882";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="giving" className="py-24 bg-rccg-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
         <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="animate-fade-in-up">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-1 bg-rccg-green rounded-full"></div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-rccg-green">Giving</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-serif text-black mb-6">
                  Honor God with your <span className="italic text-rccg-gold">Substance.</span>
               </h2>
               <p className="text-lg text-gray-500 font-light leading-relaxed mb-8 max-w-lg">
                  Your giving supports the spread of the Gospel, community outreach, and the maintenance of God's house.
               </p>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                     <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <Check size={18} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900 text-sm">Tithe & Offering</h4>
                        <p className="text-xs text-gray-400">Covenant obligation and freewill worship.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Check size={18} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900 text-sm">Project Offering</h4>
                        <p className="text-xs text-gray-400">Building God's physical house.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: '200ms' }}>
               {/* Bank Card */}
               <div className="w-full max-w-md bg-gradient-to-br from-[#1B1464] to-[#006838] p-8 rounded-[2rem] shadow-2xl shadow-rccg-blue/20 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                  
                  {/* Abstract Background */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                  <div className="relative z-10">
                     <div className="flex justify-between items-start mb-10">
                        <div>
                           <p className="text-[16px] font-bold uppercase tracking-widest opacity-60 mb-1">Bank Transfer</p>
                           <h3 className="font-serif text-xl">FIDELTY BANK</h3>
                        </div>
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                            <div className="w-6 h-6 bg-[#E1561D] rounded-md relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white"></div>
                            </div>
                        </div>
                     </div>

                     <div className="mb-8">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Account Name</p>
                        <p className="font-mono text-base md:text-lg tracking-wide uppercase text-shadow">RCCG THE AMBASSADORS</p>
                     </div>

                     <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Account Number</p>
                           <p className="font-mono text-3xl md:text-4xl font-bold tracking-widest">5600794453</p>
                        </div>
                        <button 
                           onClick={handleCopy}
                           className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/10 transition-all active:scale-95"
                        >
                           {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                        </button>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </section>
  );
};

export default Giving;
