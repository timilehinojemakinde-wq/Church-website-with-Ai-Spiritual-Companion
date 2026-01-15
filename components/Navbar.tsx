
import React, { useState, useEffect } from 'react';
import { Menu, X, Camera } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'Home', path: '#' },
  { label: 'Worship', path: '#services' },
  { label: 'Events', path: '#events' },
  { label: 'Giving', path: '#giving' },
  { label: 'SOCIALS', path: '#socials' },
  { label: 'Visit US', path: '#contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Consistent styling regardless of scroll
  const logoText = 'text-white';
  const buttonBorder = 'border-white/30';
  const buttonText = 'text-white';
  const buttonHover = 'hover:border-white hover:text-white hover:bg-white/10';

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled 
            ? 'bg-rccg-red/95 backdrop-blur-md py-4 shadow-lg' 
            : 'bg-rccg-red py-6 shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <div className="flex justify-between items-center gap-4">
            
            {/* Logo - RCCG Branding */}
            <div className="flex items-center gap-3">
               {/* Logo - no container shape */}
                  <img 
                    src="/logo/logo.png" 
                    alt="RCCG Ambassadors Logo" 
                    className="h-16 md:h-16 w-auto object-contain"
                  />
                  {/* Church Name */}
               <div className="flex flex-col leading-tight font-inter text-white">
                  <p className="text-[14px] md:text-sm font-extrabold uppercase ">
                     The Redeemed Christian Church of God
                  </p>
                  <p className="text-sm md:text-xl font-semibold tracking-tight">
                     The Ambassadors
                  </p>
               </div>
            </div>

            {/* Desktop Menu */}
            <div className={`hidden lg:flex items-center px-6 py-2 rounded-full transition-all duration-500 gap-6 ${isScrolled ? 'bg-black/10 border border-white/5' : 'bg-white/10 border border-white/10 backdrop-blur-sm'}`}>
              {navItems.map((item) => {
                // Special styling for The Ambasadors social links
                if (item.label === 'The Ambasadors Socials') {
                  return (
                    <a
                      key={item.label}
                      href={item.path}
                      className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black font-sans uppercase tracking-tight hover:bg-white hover:text-rccg-red transition-all shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Ambasadors <span className="text-white group-hover:text-rccg-red">SOCIALS</span></span>
                    </a>
                  );
                }
                return (
                  <a
                    key={item.label}
                    href={item.path}
                    className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 relative group text-white/90 hover:text-rccg-gold`}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-rccg-gold"></span>
                  </a>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
                <a href="#contact" className={`text-xs font-bold uppercase tracking-widest border-b pb-1 transition-all ${buttonText} ${buttonBorder} ${buttonHover}`}>
                   Get Directions
                </a>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 lg:hidden z-50 text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-rccg-red z-40 flex flex-col items-center justify-center transition-all duration-500 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-8 text-center">
          {navItems.map((item) => {
            if (item.label === 'Ambasadors SOCIALS') {
               return (
                  <a
                    key={item.label}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-rccg-red text-lg font-black font-sans uppercase tracking-tight shadow-xl hover:scale-105 transition-transform"
                  >
                    <Camera className="w-6 h-6" />
                    <span>Ambasadors SOCIALS</span>
                  </a>
               );
            }
            return (
               <a
                  key={item.label}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-serif font-bold text-white hover:text-rccg-gold transition-colors"
               >
                  {item.label}
               </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
