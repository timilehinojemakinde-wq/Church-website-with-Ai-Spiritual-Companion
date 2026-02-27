import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, LogIn, Home, Music, Calendar, Heart, Users, MapPin, ChevronRight, Film, BookOpen, UserCircle2 } from 'lucide-react';

interface NavbarProps {
  currentUser?: { name: string; email: string } | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

const navItems = [
  { label: 'Home', path: '#top', icon: Home },
  { label: 'Services/ Worship', path: '#services', icon: Music },
  { label: 'Ambassadors Socials', path: '#socials-preview', icon: Camera },
  { label: 'Giving', path: '#giving', icon: Heart },
  { label: 'Videos', path: '#videos', icon: Film },
  { label: 'Upcoming Events', path: '#events', icon: Calendar },
  { label: 'Our Mandate', path: '#mission', icon: BookOpen },
  { label: 'Leadership', path: '#leadership', icon: Users },
  { label: 'Visit Us', path: '#visit', icon: MapPin },
];

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLoginClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const scrollPercent = scrollTop / (scrollHeight - clientHeight);
    const index = Math.round(scrollPercent * (navItems.length - 1));
    setActiveIndex(index);
  };

  const handleNavClick = (path: string, index: number) => {
    setActiveIndex(index);
    setIsOpen(false);
    
    if (path === '#top') {
      setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 400);
      return;
    }

    // Small delay to let drawer close before scrolling
    
      const id = path.replace('#', '');
      
      setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const nabvarHeight = 64; // Approximate height of the navbar
        const elementPosition = element.getBoundingClientRect().top + window.scrollY - nabvarHeight;
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });
      }
       
    }, 500);
  };

  return (
    <>
      {/* MAIN NAVBAR */}
      <nav className="fixed w-full z-50 bg-rccg-red py-4 shadow-lg">
        <div className="w-full">
          <div className="flex items-center justify-between">

            {/* LEFT — Hamburger + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(true)}
                className="flex flex-col justify-center items-start pl-4 pr-3 py-2 gap-[5px] hover:opacity-70 transition-opacity shrink-0"
                aria-label="Open menu"
              >
                <span className="w-6 h-[2px] bg-white rounded-full block"></span>
                <span className="w-4 h-[2px] bg-white rounded-full block"></span>
                <span className="w-6 h-[2px] bg-white rounded-full block"></span>
              </button>

              <div className="flex items-center gap-2.5">
                <img
                  src="/logo/logo.png"
                  alt="RCCG Ambassadors Logo"
                  className="h-12 md:h-14 w-auto object-contain"
                />
                <div className="flex flex-col leading-tight text-white">
                  <p className="text-[10px] md:text-sm font-extrabold uppercase tracking-wide opacity-90">
                    The Redeemed Christian Church of God
                  </p>
                  <p className="text-base md:text-xl font-bold tracking-tight">
                    The Ambassadors
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — Avatar Icon */}
            <div className="pr-4">
              {currentUser ? (
                <button
                  onClick={() => setIsOpen(true)}
                  className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold text-sm shadow-lg hover:bg-yellow-400 transition-all"
                  title={currentUser.name}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="w-10 h-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-white hover:bg-white/25 transition-all"
                  title="Login"
                >
                  <UserCircle2 className="w-6 h-6" />
                </button>
              )}
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

        {/* Profile Avatar Section — above nav links */}
        <div className="px-6 py-4 border-b border-white/10 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold text-lg shadow-lg shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{currentUser.name}</p>
                <p className="text-white/40 text-xs">{currentUser.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <UserCircle2 className="w-7 h-7 text-white/40" />
              </div>
              <div>
                <p className="text-white/60 text-sm font-semibold">Sign in or Create Account</p>
                <button
                  onClick={() => { onLoginClick?.(); setIsOpen(false); }}
                  className="text-yellow-400 text-xs font-bold hover:text-yellow-300 transition-colors"
                >
                  Get in Ambassador Socials →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nav Links — scrollable with VISIBLE side indicator */}
        <div className="flex flex-1 overflow-hidden">

          {/* Side vertical gold indicator */}
          <div className="w-1 bg-white/5 relative shrink-0">
            <div
              className="w-full bg-yellow-500 rounded-full transition-all duration-300 absolute"
              style={{
                height: `${100 / navItems.length}%`,
                top: `${(activeIndex / (navItems.length - 1)) * (100 - 100 / navItems.length)}%`,
              }}
            />
          </div>

          {/* Scrollable list — scrollbar VISIBLE */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex flex-col py-2 flex-1 overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#C9A84C #0A1628',
            }}
          >
            <p className="text-[9px] font-bold uppercase tracking-[3px] text-white/30 px-5 mb-1 shrink-0">
              Navigation
            </p>

            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.path, index)}
                  className="flex items-center justify-between px-5 py-3.5 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 group border-b border-white/5 shrink-0 w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-yellow-500/20 flex items-center justify-center transition-all shrink-0">
                      <Icon className="w-4 h-4 group-hover:text-yellow-400 transition-colors" />
                    </div>
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-80 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer — single Login button only when not logged in */}
        <div className="p-5 border-t border-white/10 shrink-0">
          {currentUser ? (
            <button
              onClick={() => { onLogout?.(); setIsOpen(false); }}
              className="w-full py-3 rounded-xl border border-red-500/40 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => { onLoginClick?.(); setIsOpen(false); }}
              className="w-full py-3 rounded-xl bg-yellow-500 text-gray-900 text-sm font-bold hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login / Create Account
            </button>
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
