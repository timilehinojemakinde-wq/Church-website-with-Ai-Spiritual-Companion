
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Leadership from './components/Leadership';
import Mission from './components/Mission';
import Services from './components/Services';
import Events from './components/Events';
import Giving from './components/Giving';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Welcome from './components/Welcome';
import { User } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'socials'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#socials') {
        setView('socials');
        window.scrollTo(0, 0);
      } else {
        setView('home');
      }
    };
    
    window.addEventListener('hashchange', handleHash);
    handleHash(); // Initial check on mount
    
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Mock Google Login Implementation
  const handleGoogleLogin = async () => {
    setIsAuthLoading(true);
    // Simulate network delay for Google Auth Popup
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name: 'Visitor',
      email: 'visitor@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
    };
    
    setCurrentUser(mockUser);
    setIsAuthLoading(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (view === 'socials') {
    return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 flex justify-between items-center">
            <button 
              onClick={() => window.location.hash = ''}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-4"
            >
              &larr; Back to Home
            </button>

            {currentUser && (
               <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700">
                  Sign Out
               </button>
            )}
          </div>
          {/* Gallery Component Rendered as Main Content */}
          <Gallery 
            currentUser={currentUser} 
            onLogin={handleGoogleLogin} 
            isAuthLoading={isAuthLoading}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 scroll-smooth">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Welcome 
          currentUser={currentUser} 
          onLogin={handleGoogleLogin}
          isAuthLoading={isAuthLoading}
        />
        <Giving />
        <Events />
        <Mission />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
