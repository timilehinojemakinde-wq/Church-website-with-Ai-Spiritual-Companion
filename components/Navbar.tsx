import React, { useState, useEffect } from 'react';
import { Menu, X, Camera, LogIn, Home, Music, Calendar, Heart, Users, MapPin, ChevronRight } from 'lucide-react';

interface NavbarProps {
  currentUser?: { name: string; email: string } | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

const navItems = [
  { label: 'Home', path: '#', icon: Home },
  { label: 'Worship', path: '#services', icon: Music },
  { label: 'Events', path: '#events', icon: Calendar },
  { label: 'Giving', path: '#giving', icon: Heart },
  { label: 'Socials', path: '#socials', icon: Camera },
  { label: 'Visit Us', path: '#contact', icon: MapPin },
];

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLoginClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed w-full z-50 bg-rccg-red py-4 shadow-lg" ${
          isScrolled
            ? 'bg-rccg-red/98 backdrop-blur-md py-3 shadow-xl'
            : 'bg-rccg-red py-4 shadow-lg'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <div className="flex justify-between items-center">

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(true)}
                className="flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20 gap-1.5 shrink-0"
                aria-label="Open menu"
              >
                <span className="w-5 h-0.5 bg-white rounded-full"></span>
                <span className="w-4 h-0.5 bg-white rounded-full self-start ml-2.5"></span>
                <span className="w-5 h-0.5 bg-white rounded-full"></span>
              </button>

              <div className="flex items-center gap-2.5">
                <img
                  src="/logo/logo.png"
                  alt="RCCG Ambassadors Logo"
                  className="h-12 md:h-14 w-auto object-contain"
                />
                <div className="flex flex-col leading-tight text-white">
                  <p className="text-[10px] md:text-xs font-extrabold uppercase tracking-wide opacity-90">
                    The Redeemed Christian Church of God
                  </p>
                  <p className="text-sm md:text-lg font-bold tracking-tight">
                    The Ambassadors
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-1 bg-white/10 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  className="text-xs font-bold uppercase tracking-widest text-white/90 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-all duration-200 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-yellow-400 group-hover:w-4 transition-all duration-300 rounded-full"></span>
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="hidden lg:flex items-center gap-3">
                  <span className="text-white/80 text-xs font-semibold">
                    {currentUser.name}
                  </span>
                  <button
                    onClick={onLogout}
                    className="text-xs font-bold uppercase tracking-widest text-white border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-rccg-red transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white text-rccg-red px-4 py-2 rounded-full hover:bg-yellow-400 hover:text-rccg-red transition-all duration-200 shadow-lg"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </button>
              )}

              <button
                onClick={onLoginClick}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/20 text-white"
              >
                <LogIn className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-400 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[300px] z-[60] bg-[#0A1628] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/logo/logo.png"
              alt="RCCG Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="text-white">
              <p className="text-[9px] font-bold uppercase tracking-wider opacity-60">RCCG</p>
              <p className="text-sm font-bold">The Ambassadors</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col py-4 flex-1 overflow-y-auto">
          <p className="text-[9px] font-bold uppercase tracking-[3px] text-white/30 px-6 mb-2">
            Navigation
          </p>

          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-6 py-4 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 group border-b border-white/5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-yellow-500/20 flex items-center justify-center transition-all">
                    <Icon className="w-4 h-4 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
            );
          })}

          <div className="my-4 mx-6 border-t border-white/10" />

          <a
            href="#socials"
            onClick={() => setIsOpen(false)}
            className="mx-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 text-yellow-400 hover:border-yellow-500/60 transition-all group"
          >
            <Camera className="w-5 h-5" />
            <div>
              <p className="font-bold text-sm">Ambassador Socials</p>
              <p className="text-[10px] text-yellow-400/60">Share your worship moments</p>
            </div>
            <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-all" />
          </a>
        </div>

        <div className="p-5 border-t border-white/10">
          {currentUser ? (
            <div>
              <p className="text-white/50 text-xs mb-1">Signed in as</p>
              <p className="text-white font-semibold text-sm mb-3">{currentUser.name}</p>
              <button
                onClick={() => { onLogout?.(); setIsOpen(false); }}
                className="w-full py-3 rounded-xl border border-red-500/40 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              <p className="text-white/40 text-xs mb-3 text-center">
                Sign in to access member features
              </p>
              <button
                onClick={() => { onLoginClick?.(); setIsOpen(false); }}
                className="w-full py-3 rounded-xl bg-yellow-500 text-gray-900 text-sm font-bold hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login / Create Account
              </button>
            </div>
          )}

          <p className="text-center text-white/20 text-[9px] mt-4 uppercase tracking-widest">
            RCCG The Ambassadors © 2026
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;