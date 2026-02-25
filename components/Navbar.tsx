import React, { useState, useEffect } from 'react';
import { X, Camera, LogIn, Home, Music, Calendar, Heart, Users, MapPin, ChevronRight, Film, BookOpen, AlignLeft } from 'lucide-react';

interface NavbarProps {
  currentUser?: { name: string; email: string } | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

const navItems = [
  { label: 'Home', path: '#', icon: Home },
  { label: 'Church Services', path: '#services', icon: Music },
  { label: 'Ambassador Socials', path: '#socials', icon: Camera },
  { label: 'Giving', path: '#giving', icon: Heart },
  { label: 'Videos', path: '#videos', icon: Film },
  { label: 'Upcoming Events', path: '#events', icon: Calendar },
  { label: 'Our Mandate', path: '#mission', icon: BookOpen },
  { label: 'Leadership', path: '#leadership', icon: Users },
  { label: 'Visit Us', path: '#contact', icon: MapPin },
];

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLoginClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

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
      {/* MAIN NAVBAR */}
      <nav className="fixed w-full z-50 bg-rccg-red py-4 shadow-lg">
        <div className="w-full px-0 lg:px-12">
          <div className="flex items-center gap-3">

            {/* Hamburger — flush to left edge */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex flex-col justify-center items-start pl-3 pr-4 py-2 gap-[5px] shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Open menu"
            >
              <span className="w-6 h-[2px] bg-white rounded-full"></span>
              <span className="w-5 h-[2px] bg-white rounded-full"></span>
              <span className="w-6 h-[2px] bg-white rounded-full"></span>
            </button>

            {/* Logo + Church Name */}
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

            {/* Desktop Nav Links — center */}
            <div className="hidden lg:flex items-center gap-1 bg-white/10 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-full ml-auto mr-4">
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

          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-400 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* SLIDE-OUT DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] z-[60] bg-[#0A1628] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
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

        {/* Scrollable Nav Links with scrollbar */}
        <div
          className="flex flex-col py-4 flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#C9A84C44 transparent',
          }}
        >
          <p className="text-[9px] font-bold uppercase tracking-[3px] text-white/30 px-6 mb-2 shrink-0">
            Navigation
          </p>

          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-6 py-4 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 group border-b border-white/5 shrink-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-yellow-500/20 flex items-center justify-center transition-all shrink-0">
                    <Icon className="w-4 h-4 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
              </a>
            );
          })}
        </div>

        {/* Drawer Footer — Login/Profile */}
        <div className="p-5 border-t border-white/10 shrink-0">
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
