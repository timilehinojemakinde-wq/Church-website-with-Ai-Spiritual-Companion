import React from 'react';
import { Sun, BookOpen, Stethoscope, MapPin } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <section id="services" className="pt-12 pb-12 lg:pt-16 lg:pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-rccg-green"></div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rccg-green">Weekly Schedule</p>
                <div className="h-px w-8 bg-rccg-green"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-black">Gathering of Champions.</h2>
        </div>

        {/* Compact Single Card Design */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col lg:flex-row animate-fade-in-up hover:shadow-2xl transition-all duration-500 border border-gray-100">
            
            {/* Left Visual Side */}
            <div className="lg:w-1/3 relative min-h-[200px] lg:min-h-auto group overflow-hidden">
               <img 
                  src="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=2671&auto=format&fit=crop" 
                  alt="Worship Atmosphere" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-rccg-blue/90 mix-blend-multiply"></div>
               <div className="absolute inset-0 p-8 flex flex-col justify-center text-center text-white z-10">
                  <h3 className="text-2xl font-serif italic mb-2">Welcome Home.</h3>
                  <p className="text-white/80 text-sm leading-relaxed font-light">
                     "I was glad when they said unto me, Let us go into the house of the Lord."
                  </p>
               </div>
            </div>

            {/* Right Content Side - Grid Layout for compactness */}
            <div className="lg:w-2/3 p-8 lg:p-10 bg-white">
               <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  
                  {/* Sunday */}
                  <div className="pt-4 md:pt-0">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                            <Sun size={20} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sunday</span>
                     </div>
                     <h4 className="text-lg font-bold text-gray-900 mb-1">Celebration Service</h4>
                     <p className="text-sm font-medium text-rccg-blue mb-2">9:00 AM</p>
                     <p className="text-xs text-gray-500 leading-relaxed">
                        Worship, Word & Thanksgiving. Start your week with power.
                     </p>
                  </div>

                  {/* Tuesday */}
                  <div className="pt-8 md:pt-0 md:pl-8">
                     <div className="flex items-center gap-3 mb-3">
                         <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <BookOpen size={20} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Tuesday</span>
                     </div>
                     <h4 className="text-lg font-bold text-gray-900 mb-1">Digging Deep</h4>
                     <p className="text-sm font-medium text-rccg-blue mb-2">6:00 PM</p>
                     <p className="text-xs text-gray-500 leading-relaxed">
                        Interactive Bible Study. Uncovering spiritual treasures.
                     </p>
                  </div>

                  {/* Thursday */}
                  <div className="pt-8 md:pt-0 md:pl-8">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-red-50 text-rccg-red">
                            <Stethoscope size={20} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Thursday</span>
                     </div>
                     <h4 className="text-lg font-bold text-gray-900 mb-1">Faith Clinic</h4>
                     <p className="text-sm font-medium text-rccg-blue mb-2">6:00 PM</p>
                     <p className="text-xs text-gray-500 leading-relaxed">
                        Prayer warfare & Healing service.
                     </p>
                  </div>

               </div>
               
               {/* Footer of card */}
               <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin size={14} />
                        <span>Plot 3010, Leijja Close, Beechwood Estate, Imalete Ibeju-Lekki Lagos</span>
                    </div>
                    <a href="#contact" className="text-xs font-bold uppercase tracking-widest text-rccg-blue hover:text-rccg-red transition-colors">
                        Get Directions &rarr;
                    </a>
               </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Services;