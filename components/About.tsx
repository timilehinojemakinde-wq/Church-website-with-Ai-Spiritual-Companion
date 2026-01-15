import React, { useState, useEffect } from 'react';
import { Heart, Sprout, Flame, ChevronRight, ChevronLeft } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Love",
    icon: <Heart size={28} className="fill-current" />,
    color: "bg-rccg-red",
    shadow: "shadow-rccg-red/30",
    textColor: "text-rccg-red",
    desc: "Experience unconditional acceptance. We are a family."
  },
  {
    id: 2,
    title: "Grow",
    icon: <Sprout size={28} />,
    color: "bg-rccg-green",
    shadow: "shadow-rccg-green/30",
    textColor: "text-rccg-green",
    desc: "Discover your purpose. Deep roots, high fruits."
  },
  {
    id: 3,
    title: "Pray",
    icon: <Flame size={28} className="fill-current" />,
    color: "bg-rccg-blue",
    shadow: "shadow-rccg-blue/30",
    textColor: "text-rccg-blue",
    desc: "Power to change lives. Heaven hears when we call."
  }
];

const About: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000); 

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section id="about" className="py-12 bg-rccg-cream relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
        
        {/* Text Content - Compact */}
        <div className="w-full md:w-1/2 text-center md:text-left">
           <span className="block text-3xl font-serif italic text-rccg-red/40 mb-2 animate-fade-in-up">"</span>
           <h2 className="text-2xl md:text-3xl font-light leading-tight text-black mb-4 animate-fade-in-up">
              A place where you <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-rccg-gold to-orange-500">belong.</span>
           </h2>
           <p className="text-sm text-gray-500 leading-relaxed">
             Church isn't just a building. It's a community of people loving, growing, and praying together.
           </p>
        </div>

        {/* Compact Horizontal Slider */}
        <div className="w-full md:w-1/2 relative h-[220px]">
           {slides.map((slide, index) => (
              <div 
                 key={slide.id}
                 className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform ${
                    index === currentIndex 
                       ? 'opacity-100 translate-x-0 z-20' 
                       : 'opacity-0 translate-x-12 z-10'
                 }`}
              >
                 <div className={`relative ${slide.color} p-8 rounded-2xl shadow-lg ${slide.shadow} h-full flex flex-col justify-center`}>
                    <div className="flex items-center justify-between mb-4">
                       <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center ${slide.textColor} shadow-sm`}>
                          {slide.icon}
                       </div>
                       <div className="text-white/50 text-3xl font-serif italic opacity-20">
                          0{index + 1}
                       </div>
                    </div>
                    <h3 className="text-2xl font-serif italic mb-2 text-white">{slide.title}</h3>
                    <p className="text-sm text-white/90 leading-relaxed">
                       {slide.desc}
                    </p>
                 </div>
              </div>
           ))}
           
           {/* Slide Indicators */}
           <div className="absolute -bottom-6 left-0 w-full flex justify-center gap-2">
             {slides.map((_, idx) => (
                <button
                   key={idx}
                   onClick={() => setCurrentIndex(idx)}
                   className={`transition-all duration-300 rounded-full ${
                      idx === currentIndex ? 'w-6 h-1.5 bg-rccg-red' : 'w-1.5 h-1.5 bg-gray-300'
                   }`}
                />
             ))}
           </div>
        </div>

      </div>
    </section>
  );
};

export default About;