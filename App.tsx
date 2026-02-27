import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Leadership from './components/Leadership';
import Mission from './components/Mission';
import Services from './components/Services';
import Events from './components/Events';
import Giving from './components/Giving';
import VideoSlider from './components/VideoSlider';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Welcome from './components/Welcome';
import { supabase } from './supabaseClient';
import { User } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'socials'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || 'Member',
          email: session.user.email || '',
          avatar: session.user.user_metadata?.avatar_url || ''
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || 'Member',
          email: session.user.email || '',
          avatar: session.user.user_metadata?.avatar_url || ''
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    } else {
      setShowAuthModal(false);
    }
    setIsAuthLoading(false);
  };

  const handleSignUp = async () => {
    if (!fullName.trim()) {
      setAuthError('Please enter your full name');
      return;
    }
    setIsAuthLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthError('✅ Check your email to confirm your account!');
    }
    setIsAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const openLogin = () => {
    setShowAuthModal(true);
    setAuthView('login');
    setAuthError('');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 scroll-smooth">
      
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center pt-0 justify-center bg-black/70 backdrop-blur-sm pt 30">
          <div className="bg-[#0A1628] border border-yellow-600/30 rounded-2xl p-5 w-full max-w-md mx-4 shadow-2xl max-h-[80vh] overflow-y-auto mt-16">
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-1">
                <img 
                  src="/logo/logoSocials.png"
                  alt=" Alt Logo"
                  className="w-10 h-10 object-contain"
                />
              <h2 className="text-yellow-500 font-bold text-2xl tracking-wider">AMBASSADORS SOCIALS</h2>
              </div>
              <p className="text-yellow-500/60 text-sm tracking-widest"></p>
            </div>

            <div className="flex mb-6 bg-gray-900 rounded-xl p-1">
              <button
                onClick={() => { setAuthView('login'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  authView === 'login' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthView('signup'); setAuthError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  authView === 'signup' ? 'bg-yellow-500 text-gray-900' : 'text-gray-400'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="space-y-4">
              {authView === 'signup' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-gray-900 border border-yellow-600/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60"
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-yellow-600/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-yellow-600/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60"
              />

              {authError && (
                <p className={`text-sm text-center ${authError.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
                  {authError}
                </p>
              )}

              <button
                onClick={authView === 'login' ? handleSignIn : handleSignUp}
                disabled={isAuthLoading}
                className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50"
              >
                {isAuthLoading ? 'Please wait...' : authView === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-6 w-full text-gray-500 text-sm hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Navbar currentUser={currentUser} onLoginClick={openLogin} onLogout={handleLogout} />
      
      {view === 'socials' ? (
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
          <Gallery
            currentUser={currentUser}
            onLogin={openLogin}
            isAuthLoading={isAuthLoading}
          />
        </main>
      ) : (
        <main className="flex-grow">
          <Hero />
          <Services />
          <Welcome
            currentUser={currentUser}
            onLogin={openLogin}
            isAuthLoading={isAuthLoading}
          />
          <Giving />
          <VideoSlider />
          <Events />
          <Mission />
          <Leadership />
          <Contact />
        </main>
      )}
      
      <Footer />
    </div>
  );
};

export default App
