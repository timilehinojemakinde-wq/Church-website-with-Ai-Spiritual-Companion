import React, { useState } from 'react';
import {
  Heart, MessageCircle, Share2, MoreHorizontal, Send,
  PlusSquare, Camera, User, Home, Search, Bell,
  ArrowLeft, Grid, Bookmark, Calendar, MapPin, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { Toaster, toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { SocialPost, User as UserType } from '../types';

// ─── BRAND COLORS ─────────────────────────────────────────────
const OLIVE  = '#5C6B3A';
const CREAM  = '#FAF8F3';
const INK    = '#1A1A1A';

// ─── MOCK DATA ────────────────────────────────────────────────
const MOCK_POSTS: SocialPost[] = [
  { id: '1', userId: 'admin', userName: 'Ambassador Media', userAvatar: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=100', imageUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800', caption: "High praise during today's Celebration Service! 🔥🙌 #SundayService #TheAmbassadors", likes: 124, likedBy: [], comments: [{ id: 'c1', username: 'sis_grace', text: 'It was absolutely amazing!', timestamp: Date.now() - 1800000 }], timestamp: Date.now() - 3600000 },
  { id: '2', userId: 'youth', userName: 'PTA Youth', userAvatar: 'https://images.unsplash.com/photo-1529070538774-1843cb6e65b3?q=80&w=100', imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800', caption: 'Community outreach was a success. Spreading the love of Christ! ❤️', likes: 89, likedBy: [], comments: [], timestamp: Date.now() - 7200000 },
  { id: '3', userId: 'choir', userName: 'PTA Levites', userAvatar: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=100', imageUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e3720?q=80&w=800', caption: 'Rehearsals for the special thanksgiving service 🎵🎹 #Worship #Levites', likes: 56, likedBy: [], comments: [], timestamp: Date.now() - 10800000 },
  { id: '4', userId: 'pastor', userName: "Pastor's Desk", userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100', imageUrl: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=800', caption: '"Thy word is a lamp unto my feet". Join us for Digging Deep this Tuesday 📖', likes: 210, likedBy: [], comments: [{ id: 'c2', username: 'bro_mike', text: "Amen! Can't wait 🙏", timestamp: Date.now() - 3600000 }], timestamp: Date.now() - 14400000 },
  { id: '5', userId: 'sarah', userName: 'Sis. Sarah A.', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100', imageUrl: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=800', caption: 'Beautiful moments with the family of God ✨ #SundayBest #Grateful', likes: 45, likedBy: [], comments: [], timestamp: Date.now() - 18000000 },
  { id: '6', userId: 'rccg', userName: 'RCCG Info', userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', caption: 'Special announcement for the upcoming convention 🎺 Stay tuned!', likes: 330, likedBy: [], comments: [], timestamp: Date.now() - 86400000 },
  { id: '7', userId: 'children', userName: 'Heritage of the Lord', userAvatar: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=100', imageUrl: 'https://images.unsplash.com/photo-1536337005238-94b997371b40?q=80&w=800', caption: 'Our children learning about David and Goliath today! 🌟', likes: 92, likedBy: [], comments: [], timestamp: Date.now() - 90000000 },
  { id: '8', userId: 'evang', userName: 'Evangelism Team', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800', caption: 'Jesus loves you. Tell a friend today 🕊️ #GreatCommission', likes: 150, likedBy: [], comments: [], timestamp: Date.now() - 172800000 },
];

const MOCK_EVENTS = [
  { id: 1, title: 'Sunday Celebration Service', date: new Date(Date.now() + 86400000 * 3).toISOString(), location: 'Main Auditorium', description: "Join us for a powerful time of worship, the Word, and fellowship as we celebrate God's goodness together.", image_url: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800' },
  { id: 2, title: 'Digging Deep Bible Study', date: new Date(Date.now() + 86400000 * 5).toISOString(), location: 'Fellowship Hall', description: 'A deep dive into the Word of God. Come with your Bible and an open heart ready to receive.', image_url: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=800' },
  { id: 3, title: 'Youth Prayer & Praise Night', date: new Date(Date.now() + 86400000 * 7).toISOString(), location: 'Youth Centre', description: 'An electrifying night of prayer and praise for the young and young at heart. Come expecting a move of God!', image_url: 'https://images.unsplash.com/photo-1514525253440-b393452e3720?q=80&w=800' },
];

// ─── HELPERS ──────────────────────────────────────────────────
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

type View = 'feed' | 'profile' | 'search' | 'events';

interface GalleryProps {
  currentUser: UserType | null;
  onLogin: () => void;
  isAuthLoading: boolean;
}

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const Gallery: React.FC<GalleryProps> = ({ currentUser, onLogin }) => {
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_POSTS);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [view, setView] = useState<View>('feed');
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const handleLike = (postId: string) => {
    if (!currentUser) { onLogin(); return; }
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likedBy.includes(currentUser.id);
      return {
        ...p,
        likes: liked ? p.likes - 1 : p.likes + 1,
        likedBy: liked
          ? p.likedBy.filter(id => id !== currentUser.id)
          : [...p.likedBy, currentUser.id],
      };
    }));
  };

  const handleBlock = (username: string) => {
    setPosts(prev => prev.filter(p => p.userName !== username));
    toast.success(`Blocked ${username}`);
    setView('feed');
    setSelectedUsername(null);
  };

  const navigateToProfile = (username: string) => {
    setSelectedUsername(username);
    setView('profile');
    window.scrollTo(0, 0);
  };

  const goHome = () => { window.location.hash = ''; };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20" style={{ background: CREAM, color: INK }}>
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: 16, fontFamily: 'inherit', fontSize: 14 } }} />

      {/* ── DESKTOP TOP NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 hidden md:block"
        style={{ background: 'rgba(250,248,243,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo + Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center" style={{ background: OLIVE }}>
              <img src="/logo/logo.png" alt="Logo" className="w-full h-full object-contain p-1"
                onError={e => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = 'none';
                  if (t.parentElement) t.parentElement.innerHTML = `<span style="color:white;font-size:10px;font-weight:900">RCCG</span>`;
                }} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight italic" style={{ color: OLIVE }}>
              Ambassadors Social
            </h1>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-6">
            <NavIcon icon={<Home size={22} />} label="Home" active={view === 'feed'} onClick={() => setView('feed')} />
            <NavIcon icon={<Search size={22} />} label="Explore" active={view === 'search'} onClick={() => setView('search')} />
            <NavIcon icon={<Calendar size={22} />} label="Events" active={view === 'events'} onClick={() => setView('events')} />
            <NavIcon icon={<Bell size={22} />} label="Alerts" />
            <button
              onClick={() => currentUser ? setIsUploadOpen(true) : onLogin()}
              className="px-5 py-2 rounded-full text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: OLIVE }}
            >
              <PlusSquare size={18} />
              <span>Share Moment</span>
            </button>
            <button
              onClick={() => navigateToProfile(currentUser?.name || 'Ambassador')}
              className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all"
              style={{ borderColor: view === 'profile' ? OLIVE : 'transparent', background: `${OLIVE}22` }}
            >
              {currentUser
                ? <span className="font-bold text-sm" style={{ color: OLIVE }}>{currentUser.name.charAt(0).toUpperCase()}</span>
                : <User size={18} style={{ color: OLIVE }} />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE HEADER ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 h-14 flex items-center justify-between"
        style={{ background: 'rgba(250,248,243,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center" style={{ background: OLIVE }}>
            <img src="/logo/logo.png" alt="Logo" className="w-full h-full object-contain p-1"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <h1 className="text-lg font-semibold italic" style={{ color: OLIVE }}>Ambassadors Social</h1>
        </div>
        <button onClick={() => currentUser ? setIsUploadOpen(true) : onLogin()} style={{ color: OLIVE }}>
          <PlusSquare size={24} />
        </button>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-xl mx-auto px-4 pt-16 md:pt-0">

        {/* FEED */}
        {view === 'feed' && (
          <>
            {/* Stories */}
            <div className="flex gap-4 overflow-x-auto py-6" style={{ scrollbarWidth: 'none' }}>
              {['Service', 'Worship', 'Youth', 'Choir', 'Outreach'].map(tag => (
                <div key={tag} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer">
                  <div className="w-16 h-16 rounded-full p-[2px]" style={{ border: `2px solid ${OLIVE}` }}>
                    <div className="w-full h-full rounded-full overflow-hidden" style={{ background: CREAM }}>
                      <img src={`https://picsum.photos/seed/${tag}church/200`} alt={tag} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-semibold opacity-60">{tag}</span>
                </div>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-12 pb-16">
              {posts.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                  <Camera size={48} className="mx-auto mb-4" />
                  <p className="text-xl italic" style={{ fontFamily: 'Georgia, serif' }}>No moments shared yet.</p>
                  <p className="text-sm mt-1">Be the first to share a beautiful service moment!</p>
                </div>
              ) : posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onLike={() => handleLike(post.id)}
                  onProfileClick={() => navigateToProfile(post.userName)}
                  onPostClick={() => setSelectedPost(post)}
                  onBlock={() => handleBlock(post.userName)}
                  onLogin={onLogin}
                />
              ))}
            </div>
          </>
        )}

        {/* PROFILE */}
        {view === 'profile' && (
          <ProfileView
            username={selectedUsername || currentUser?.name || 'Ambassador'}
            currentUser={currentUser}
            posts={posts}
            onBack={() => { setView('feed'); setSelectedUsername(null); }}
            onPostClick={post => setSelectedPost(post)}
            onBlock={() => handleBlock(selectedUsername!)}
          />
        )}

        {/* SEARCH */}
        {view === 'search' && (
          <SearchView
            posts={posts}
            onProfileClick={navigateToProfile}
            onPostClick={post => setSelectedPost(post)}
          />
        )}

        {/* EVENTS */}
        {view === 'events' && <EventsView />}
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-6 h-16 flex items-center justify-between bg-white"
        style={{ borderTop: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
        <button onClick={() => setView('feed')}><Home size={24} style={{ color: view === 'feed' ? OLIVE : 'rgba(0,0,0,0.25)' }} /></button>
        <button onClick={() => setView('search')}><Search size={24} style={{ color: view === 'search' ? OLIVE : 'rgba(0,0,0,0.25)' }} /></button>
        <button
          onClick={() => currentUser ? setIsUploadOpen(true) : onLogin()}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white -mt-6 shadow-xl transition-transform hover:scale-105"
          style={{ background: OLIVE, boxShadow: `0 8px 24px ${OLIVE}55` }}
        >
          <PlusSquare size={24} />
        </button>
        <button onClick={() => setView('events')}><Calendar size={24} style={{ color: view === 'events' ? OLIVE : 'rgba(0,0,0,0.25)' }} /></button>
        <button onClick={() => navigateToProfile(currentUser?.name || 'Ambassador')}><User size={24} style={{ color: view === 'profile' ? OLIVE : 'rgba(0,0,0,0.25)' }} /></button>
      </nav>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {isUploadOpen && (
          <UploadModal
            key="upload"
            currentUser={currentUser}
            onClose={() => setIsUploadOpen(false)}
            onSuccess={newPost => {
              setPosts(prev => [newPost, ...prev]);
              setIsUploadOpen(false);
              toast.success('Moment shared! 🙌');
            }}
          />
        )}
        {selectedPost && (
          <PostModal
            key="post-modal"
            post={selectedPost}
            currentUser={currentUser}
            onClose={() => setSelectedPost(null)}
            onLike={() => handleLike(selectedPost.id)}
            onProfileClick={username => { setSelectedPost(null); navigateToProfile(username); }}
            onLogin={onLogin}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
//  NAV ICON
// ══════════════════════════════════════════════════════════════
function NavIcon({ icon, label, active = false, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 transition-colors"
      style={{ color: active ? OLIVE : 'rgba(26,26,26,0.4)' }}>
      {icon}
      <span className="text-[10px] uppercase tracking-tighter font-medium">{label}</span>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
//  POST CARD
// ══════════════════════════════════════════════════════════════
function PostCard({ post, currentUser, onLike, onProfileClick, onPostClick, onBlock, onLogin }: {
  post: SocialPost;
  currentUser: UserType | null;
  onLike: () => void;
  onProfileClick: () => void;
  onPostClick: () => void;
  onBlock: () => void;
  onLogin: () => void;
}) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) { onLogin(); return; }
    if (!commentText.trim()) return;
    setComments(prev => [...prev, { id: Date.now().toString(), username: currentUser.name, text: commentText, timestamp: Date.now() }]);
    setCommentText('');
    toast.success('Comment added');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white overflow-hidden"
      style={{ borderRadius: 32, boxShadow: '0 4px 32px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onProfileClick}>
          <div className="w-10 h-10 rounded-full overflow-hidden" style={{ background: `${OLIVE}18` }}>
            <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold text-sm hover:underline">{post.userName}</h3>
            <p className="text-[10px] uppercase tracking-widest opacity-40">
              {formatDistanceToNow(new Date(post.timestamp))} ago
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1 opacity-40 hover:opacity-100 transition-opacity">
            <MoreHorizontal size={20} />
          </button>
          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl z-20 py-2 overflow-hidden"
                  style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  {currentUser?.name !== post.userName && (
                    <button onClick={() => { onBlock(); setShowMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      Block User
                    </button>
                  )}
                  <button onClick={() => { toast.success('Post reported'); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/5 transition-colors">
                    Report Post
                  </button>
                  <button onClick={() => { toast.success('Link copied!'); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/5 transition-colors">
                    Copy Link
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square md:aspect-[4/5] overflow-hidden cursor-pointer"
        style={{ background: CREAM }} onClick={onPostClick}>
        <img src={post.imageUrl} alt="Moment"
          className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
          referrerPolicy="no-referrer" />
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide"
          style={{ background: 'rgba(92,107,58,0.78)', color: 'white' }}>
          RCCG AMBASSADORS
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <button onClick={onLike} className="flex items-center gap-2 group">
              <Heart size={24} className="transition-all duration-150"
                style={{ fill: isLiked ? '#ef4444' : 'none', color: isLiked ? '#ef4444' : INK }} />
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 group">
              <MessageCircle size={24} className="transition-colors group-hover:opacity-60" />
              <span className="text-sm font-medium">{comments.length}</span>
            </button>
            <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check this moment from RCCG The Ambassadors!\n\n"${post.caption}"\n— ${post.userName}`)}`, '_blank')}>
              <Share2 size={24} className="opacity-60 hover:opacity-100 transition-opacity" />
            </button>
          </div>
          <button onClick={() => { setIsSaved(!isSaved); if (!isSaved) toast.success('Saved to your collection'); }}>
            <Bookmark size={24} className="transition-all"
              style={{ fill: isSaved ? OLIVE : 'none', color: isSaved ? OLIVE : INK }} />
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm leading-relaxed mb-4">
            <span className="font-bold mr-2">{post.userName}</span>
            {post.caption}
          </p>
        )}

        {/* Comments toggle */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 mb-4 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                {comments.length === 0 ? (
                  <p className="text-xs italic opacity-40">No comments yet. Be the first!</p>
                ) : comments.map(c => (
                  <div key={c.id} className="text-sm">
                    <span className="font-bold mr-2">{c.username}</span>
                    <span className="opacity-80">{c.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment input */}
        <form onSubmit={handleComment} className="relative flex items-center">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="w-full rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1"
            style={{ background: `${CREAM}`, border: '1px solid rgba(0,0,0,0.08)', fontFamily: 'inherit', '--tw-ring-color': `${OLIVE}33` } as React.CSSProperties}
          />
          <button type="submit" className="absolute right-3 opacity-60 hover:opacity-100 transition-opacity" style={{ color: OLIVE }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </motion.article>
  );
}

// ══════════════════════════════════════════════════════════════
//  PROFILE VIEW
// ══════════════════════════════════════════════════════════════
function ProfileView({ username, currentUser, posts, onBack, onPostClick, onBlock }: {
  username: string;
  currentUser: UserType | null;
  posts: SocialPost[];
  onBack: () => void;
  onPostClick: (post: SocialPost) => void;
  onBlock?: () => void;
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const isOwnProfile = username === (currentUser?.name || 'Ambassador');
  const userPosts = isOwnProfile ? posts : posts.filter(p => p.userName === username);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
      {/* Back + username */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full transition-colors hover:bg-black/5">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">{username}</h2>
        </div>
        {!isOwnProfile && (
          <button onClick={() => { if (confirm(`Block ${username}?`)) onBlock?.(); }}
            className="text-sm font-medium text-red-500 hover:underline">
            Block
          </button>
        )}
      </div>

      {/* Avatar + stats */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <div className="relative shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-[3px]" style={{ border: `2px solid ${OLIVE}` }}>
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center font-black text-3xl text-white"
              style={{ background: `linear-gradient(135deg, ${OLIVE}, #3a4a1f)` }}>
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl italic" style={{ fontFamily: 'Georgia, serif' }}>{username}</h1>
            <div className="flex gap-2 justify-center md:justify-start">
              {!isOwnProfile ? (
                <>
                  <button onClick={() => setIsFollowing(!isFollowing)}
                    className="px-6 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{ background: isFollowing ? 'rgba(0,0,0,0.07)' : OLIVE, color: isFollowing ? INK : 'white' }}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="px-6 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-black/10"
                    style={{ background: 'rgba(0,0,0,0.06)' }}>
                    Message
                  </button>
                </>
              ) : (
                <button className="px-6 py-1.5 rounded-full text-sm font-medium hover:bg-black/10 transition-colors"
                  style={{ background: 'rgba(0,0,0,0.06)' }}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center md:justify-start gap-8 mb-4 text-sm">
            <span><span className="font-bold">{userPosts.length}</span> posts</span>
            <span><span className="font-bold">1.2k</span> followers</span>
            <span><span className="font-bold">450</span> following</span>
          </div>
          <p className="text-sm leading-relaxed opacity-60 max-w-sm">
            Member of RCCG The Ambassadors. Sharing moments of grace and worship. 🙏✨
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-8" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        {(['posts', 'saved'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 flex justify-center items-center gap-2 py-4 text-xs uppercase tracking-widest font-bold transition-all"
            style={{
              borderTop: activeTab === tab ? `2px solid ${INK}` : '2px solid transparent',
              marginTop: -1,
              color: activeTab === tab ? INK : 'rgba(0,0,0,0.3)'
            }}>
            {tab === 'posts' ? <><Grid size={18} /> Posts</> : <><Bookmark size={18} /> Saved</>}
          </button>
        ))}
      </div>

      {/* Grid */}
      {activeTab === 'posts' && (
        userPosts.length === 0 ? (
          <div className="text-center py-16 opacity-40">
            <Camera size={40} className="mx-auto mb-3" />
            <p className="italic" style={{ fontFamily: 'Georgia, serif' }}>No posts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-3">
            {userPosts.map(post => (
              <motion.div key={post.id} whileHover={{ scale: 0.97 }} onClick={() => onPostClick(post)}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group"
                style={{ background: CREAM }}>
                <img src={post.imageUrl} alt="Moment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 font-bold text-sm text-white"
                  style={{ background: 'rgba(0,0,0,0.28)' }}>
                  <span className="flex items-center gap-1"><Heart size={16} className="fill-white" /> {post.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={16} className="fill-white" /> {post.comments.length}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}
      {activeTab === 'saved' && (
        <div className="text-center py-16 opacity-40">
          <Bookmark size={40} className="mx-auto mb-3" />
          <p className="italic" style={{ fontFamily: 'Georgia, serif' }}>No saved moments yet</p>
        </div>
      )}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
//  SEARCH VIEW
// ══════════════════════════════════════════════════════════════
function SearchView({ posts, onProfileClick, onPostClick }: {
  posts: SocialPost[];
  onProfileClick: (username: string) => void;
  onPostClick: (post: SocialPost) => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = posts.filter(p =>
    p.caption.toLowerCase().includes(query.toLowerCase()) ||
    p.userName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
      {/* Search input */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} />
        <input
          type="text"
          placeholder="Search for users or moments..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
          className="w-full rounded-2xl pl-12 pr-4 py-4 text-base focus:outline-none"
          style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', fontFamily: 'inherit' }}
        />
      </div>

      {query.trim() === '' ? (
        <div className="text-center py-20 opacity-40">
          <Search size={48} className="mx-auto mb-4" />
          <p className="text-xl italic" style={{ fontFamily: 'Georgia, serif' }}>Discover the community</p>
          <p className="text-sm mt-1">Search for names, captions, or service moments</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 opacity-40">
          <p className="text-xl italic" style={{ fontFamily: 'Georgia, serif' }}>No results for "{query}"</p>
          <p className="text-sm mt-2">Try searching for something else</p>
        </div>
      ) : (
        <>
          <p className="text-xs uppercase tracking-widest font-bold opacity-40 mb-4">Moments</p>
          <div className="grid grid-cols-3 gap-1 md:gap-3">
            {filtered.map(post => (
              <motion.div key={post.id} whileHover={{ scale: 0.97 }} onClick={() => onPostClick(post)}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group"
                style={{ background: CREAM }}>
                <img src={post.imageUrl} alt="Moment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 font-bold text-sm text-white"
                  style={{ background: 'rgba(0,0,0,0.28)' }}>
                  <span className="flex items-center gap-1"><Heart size={16} className="fill-white" /> {post.likes}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
//  EVENTS VIEW
// ══════════════════════════════════════════════════════════════
function EventsView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl italic" style={{ fontFamily: 'Georgia, serif' }}>Upcoming Events</h1>
        <div className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{ background: `${OLIVE}18`, color: OLIVE }}>
          {MOCK_EVENTS.length} Events
        </div>
      </div>

      <div className="space-y-8 pb-16">
        {MOCK_EVENTS.map(event => (
          <motion.div key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white overflow-hidden group cursor-pointer"
            style={{ borderRadius: 32, boxShadow: '0 4px 32px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <div className="aspect-[21/9] relative overflow-hidden">
              <img src={event.image_url} alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm"
                style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}>
                <Calendar size={14} style={{ color: OLIVE }} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl italic" style={{ fontFamily: 'Georgia, serif' }}>{event.title}</h2>
                <div className="flex items-center gap-4 text-xs opacity-60">
                  <span className="flex items-center gap-1"><Clock size={14} />
                    {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center gap-1"><MapPin size={14} />{event.location}</span>
                </div>
              </div>
              <p className="text-sm opacity-70 leading-relaxed mb-6">{event.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden" style={{ background: CREAM }}>
                      <img src={`https://picsum.photos/seed/attendee${i}/100`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold"
                    style={{ background: OLIVE }}>+12</div>
                </div>
                <button className="px-8 py-2.5 rounded-full text-sm font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ background: OLIVE, boxShadow: `0 4px 16px ${OLIVE}44` }}>
                  Interested
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
//  POST MODAL
// ══════════════════════════════════════════════════════════════
function PostModal({ post, currentUser, onClose, onLike, onProfileClick, onLogin }: {
  post: SocialPost;
  currentUser: UserType | null;
  onClose: () => void;
  onLike: () => void;
  onProfileClick: (username: string) => void;
  onLogin: () => void;
}) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments);
  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) { onLogin(); return; }
    if (!commentText.trim()) return;
    setComments(prev => [...prev, { id: Date.now().toString(), username: currentUser.name, text: commentText, timestamp: Date.now() }]);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0"
        style={{ background: 'rgba(26,26,26,0.75)', backdropFilter: 'blur(12px)' }} />

      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative bg-white w-full max-w-4xl flex flex-col md:flex-row overflow-hidden"
        style={{ borderRadius: 40, maxHeight: '85vh', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}
      >
        {/* Image side */}
        <div className="flex-1 relative overflow-hidden" style={{ background: CREAM, minHeight: 280 }}>
          <img src={post.imageUrl} alt="Moment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide"
            style={{ background: 'rgba(92,107,58,0.8)', color: 'white' }}>
            RCCG AMBASSADORS
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-[400px] flex flex-col bg-white">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onProfileClick(post.userName)}>
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center font-bold text-white text-sm"
                style={{ background: `linear-gradient(135deg, ${OLIVE}, #3a4a1f)` }}>
                {post.userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-sm hover:underline">{post.userName}</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-40">
                  {formatDistanceToNow(new Date(post.timestamp))} ago
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-sm opacity-40 hover:opacity-100 transition-opacity font-medium">Close</button>
          </div>

          {/* Scrollable comments */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {post.caption && (
              <p className="text-sm leading-relaxed">
                <span className="font-bold mr-2">{post.userName}</span>
                {post.caption}
              </p>
            )}
            <div className="space-y-3 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-40">Comments</h4>
              {comments.length === 0
                ? <p className="text-xs italic opacity-40">No comments yet. Be the first!</p>
                : comments.map(c => (
                  <div key={c.id} className="text-sm">
                    <span className="font-bold mr-2">{c.username}</span>
                    <span className="opacity-80">{c.text}</span>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Actions */}
          <div className="p-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-6 mb-4">
              <button onClick={onLike} className="flex items-center gap-2">
                <Heart size={24} style={{ fill: isLiked ? '#ef4444' : 'none', color: isLiked ? '#ef4444' : INK }} />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.caption} — ${post.userName}`)}`, '_blank')}>
                <Share2 size={24} className="opacity-60 hover:opacity-100 transition-opacity" />
              </button>
            </div>
            <form onSubmit={handleComment} className="relative flex items-center">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="w-full rounded-full px-4 py-2.5 text-sm focus:outline-none"
                style={{ background: CREAM, border: '1px solid rgba(0,0,0,0.08)', fontFamily: 'inherit' }}
              />
              <button type="submit" className="absolute right-3 opacity-60 hover:opacity-100 transition-opacity" style={{ color: OLIVE }}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  UPLOAD MODAL
// ══════════════════════════════════════════════════════════════
function UploadModal({ currentUser, onClose, onSuccess }: {
  currentUser: UserType | null;
  onClose: () => void;
  onSuccess: (post: SocialPost) => void;
}) {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, multiple: false
  } as any);

  const handleUpload = async () => {
    if (!image || !currentUser) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1200));
    onSuccess({
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      imageUrl: image,
      caption,
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: Date.now(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0"
        style={{ background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(8px)' }} />

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-lg overflow-hidden"
        style={{ borderRadius: 40, boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}
      >
        <div className="px-6 py-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <h2 className="text-xl italic" style={{ fontFamily: 'Georgia, serif' }}>Share a Moment</h2>
          <button onClick={onClose} className="text-sm opacity-40 hover:opacity-100 transition-opacity font-medium">Close</button>
        </div>

        <div className="p-8">
          {!image ? (
            <div {...getRootProps()}
              className="aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all"
              style={{ borderColor: isDragActive ? OLIVE : 'rgba(0,0,0,0.12)', background: isDragActive ? `${OLIVE}08` : CREAM }}>
              <input {...getInputProps()} />
              <Camera size={48} className="mb-4" style={{ color: `${OLIVE}66` }} />
              <p className="text-sm font-semibold">Drop your photo here</p>
              <p className="text-xs opacity-40 mt-1">or click to browse</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="aspect-square rounded-3xl overflow-hidden relative group" style={{ background: CREAM }}>
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide"
                  style={{ background: 'rgba(92,107,58,0.8)', color: 'white' }}>
                  RCCG AMBASSADORS
                </div>
                <button onClick={() => setImage(null)}
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)' }}>
                  Change
                </button>
              </div>

              <textarea
                placeholder="Write a caption... #ServiceMoment"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="w-full rounded-2xl p-4 text-sm focus:outline-none h-24 resize-none"
                style={{ background: CREAM, border: '1px solid rgba(0,0,0,0.08)', fontFamily: 'inherit' }}
              />

              <button onClick={handleUpload} disabled={uploading}
                className="w-full py-4 rounded-full font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ background: OLIVE }}>
                {uploading ? 'Sharing...' : 'Share to Feed'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Gallery;
