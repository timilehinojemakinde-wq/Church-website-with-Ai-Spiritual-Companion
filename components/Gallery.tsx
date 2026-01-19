
import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, X, Camera, Bookmark, Upload, Loader2, LogIn, Image as ImageIcon, Trash2, Grid, Film, User as UserIcon, Home, Search, PlusSquare, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { SocialPost, User } from '../types';

// Mock Data
const INITIAL_POSTS: SocialPost[] = [
  {
    id: '1',
    userId: 'admin',
    userName: 'Ambassador Media Team',
    userAvatar: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'High praise during today\'s Celebration Service! The atmosphere was electric. 🔥🙌 #SundayService #PTA',
    likes: 124,
    likedBy: [],
    comments: [{ id: 'c1', username: 'sis_grace', text: 'It was awesome!', timestamp: Date.now() }],
    timestamp: Date.now()
  },
  {
    id: '2',
    userId: 'youth',
    userName: 'PTA Youth',
    userAvatar: 'https://images.unsplash.com/photo-1529070538774-1843cb6e65b3?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Community outreach was a success. Spreading the love of Christ! ❤️',
    likes: 89,
    likedBy: [],
    comments: [],
    timestamp: Date.now()
  },
  {
    id: '3',
    userId: 'choir_dept',
    userName: 'PTA Levites',
    userAvatar: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e3720?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Rehearsals for the special thanksgiving service. Get ready for a shift! 🎵🎹 #Worship #Levites',
    likes: 56,
    likedBy: [],
    comments: [],
    timestamp: Date.now()
  },
  {
    id: '4',
    userId: 'pastorate',
    userName: 'Pastor\'s Desk',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Studying the word. "Thy word is a lamp unto my feet". Join us for Digging Deep this Tuesday. 📖',
    likes: 210,
    likedBy: [],
    comments: [{ id: 'c2', username: 'bro_mike', text: 'Amen! Can\'t wait.', timestamp: Date.now() }],
    timestamp: Date.now()
  },
  {
    id: '5',
    userId: 'sis_sarah',
    userName: 'Sis. Sarah',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Beautiful moments with the family of God. #SundayBest',
    likes: 45,
    likedBy: [],
    comments: [],
    timestamp: Date.now()
  },
  {
    id: '6',
    userId: 'rccg_global',
    userName: 'RCCG Info',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Special announcement for upcoming convention.',
    likes: 330,
    likedBy: [],
    comments: [],
    timestamp: Date.now()
  },
  {
    id: '7',
    userId: 'children_church',
    userName: 'Heritage of the Lord',
    userAvatar: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1536337005238-94b997371b40?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Our children learning about David and Goliath today! 🌟',
    likes: 92,
    likedBy: [],
    comments: [],
    timestamp: Date.now()
  },
  {
    id: '8',
    userId: 'evangelism',
    userName: 'Evangelism Team',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Jesus loves you. Tell a friend today.',
    likes: 150,
    likedBy: [],
    comments: [],
    timestamp: Date.now()
  },
  {
    id: '9',
    userId: 'choir_dept2',
    userName: 'PTA Levites',
    userAvatar: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1525939864633-45e6208628eb?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Singing praises to the King of Kings.',
    likes: 78,
    likedBy: [],
    comments: [],
    timestamp: Date.now()
  },
  {
    id: '10',
    userId: 'media',
    userName: 'PTA Media',
    userAvatar: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Capturing moments of grace.',
    likes: 112,
    likedBy: [],
    comments: [],
    timestamp: Date.now()
  },
  {
    id: '11',
    userId: 'ushering',
    userName: 'PTA Ushers',
    userAvatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Serving with a smile. Welcome to church!',
    likes: 95,
    likedBy: [],
    comments: [],
    timestamp: Date.now()
  },
  {
    id: '12',
    userId: 'prayer_band',
    userName: 'Prayer Warriors',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Interceding for the nation. Join us every Saturday.',
    likes: 88,
    likedBy: [],
    comments: [],
    timestamp: Date.now()
  }
];

interface GalleryProps {
  currentUser: User | null;
  onLogin: () => void;
  isAuthLoading: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ currentUser, onLogin, isAuthLoading }) => {
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLike = (postId: string) => {
    if (!currentUser) {
      onLogin();
      return;
    }
    
    setPosts(current => current.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(currentUser.id);
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked 
            ? post.likedBy.filter(id => id !== currentUser.id)
            : [...post.likedBy, currentUser.id]
        };
      }
      return post;
    }));

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => {
        if (!prev) return null;
        const isLiked = prev.likedBy.includes(currentUser.id);
        return {
          ...prev,
          likes: isLiked ? prev.likes - 1 : prev.likes + 1,
          likedBy: isLiked 
            ? prev.likedBy.filter(id => id !== currentUser.id)
            : [...prev.likedBy, currentUser.id]
        };
      });
    }
  };

  const handleCommentSubmit = (postId: string) => {
    if (!currentUser) {
      onLogin();
      return;
    }
    if (!commentInput.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      username: currentUser.name,
      text: commentInput,
      timestamp: Date.now()
    };

    setPosts(current => current.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
    }
    setCommentInput('');
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(current => current.filter(p => p.id !== postId));
      setSelectedPost(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !previewUrl) return;

    setIsUploading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newPost: SocialPost = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      imageUrl: previewUrl,
      caption: newPostCaption,
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: Date.now()
    };

    setPosts([newPost, ...posts]);
    setIsUploading(false);
    setIsUploadOpen(false);
    setPreviewUrl(null);
    setNewPostCaption('');
  };

  const openUpload = () => {
    if (!currentUser) {
      onLogin();
    } else {
      setIsUploadOpen(true);
    }
  };

  const removePreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const goHome = () => {
    window.location.hash = '';
  };

  // Instagram-style Highlights Placeholder
  const highlights = [
    { name: 'Worship', img: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=100&auto=format&fit=crop' },
    { name: 'Word', img: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=100&auto=format&fit=crop' },
    { name: 'Youth', img: 'https://images.unsplash.com/photo-1529070538774-1843cb6e65b3?q=80&w=100&auto=format&fit=crop' },
    { name: 'Choir', img: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=100&auto=format&fit=crop' },
    { name: 'Outreach', img: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=100&auto=format&fit=crop' },
  ];

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-gray-900">
      
      {/* App Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-2">
            <button onClick={goHome} className="lg:hidden text-gray-800">
               <ArrowLeft size={24} />
            </button>
            <span className="font-bold text-xl tracking-tight">PTA_SOCIALS</span>
         </div>
         <div className="flex gap-5">
             <PlusSquare size={24} onClick={openUpload} className="cursor-pointer hover:text-rccg-red transition-colors" />
             <Heart size={24} className="cursor-pointer hover:text-rccg-red transition-colors" />
             <MessageCircle size={24} className="cursor-pointer hover:text-rccg-red transition-colors" />
         </div>
      </header>

      <div className="max-w-4xl mx-auto pt-6">
         
         {/* Profile Header */}
         <div className="px-4 mb-8">
            <div className="flex items-center gap-6 md:gap-10 mb-6">
               <div className="w-20 h-20 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 shrink-0">
                  <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden bg-gray-100 flex items-center justify-center">
                     <span className="font-bold text-rccg-blue text-xs md:text-sm">PTA</span>
                  </div>
               </div>
               
               <div className="flex-1">
                  <div className="flex justify-around md:justify-start md:gap-12 text-center md:text-left mb-4">
                     <div>
                        <span className="font-bold block text-lg">{posts.length}</span>
                        <span className="text-sm text-gray-500">Posts</span>
                     </div>
                     <div>
                        <span className="font-bold block text-lg">1.2k</span>
                        <span className="text-sm text-gray-500">Followers</span>
                     </div>
                     <div>
                        <span className="font-bold block text-lg">350</span>
                        <span className="text-sm text-gray-500">Following</span>
                     </div>
                  </div>
                  
                  <div className="hidden md:block">
                     <h1 className="font-bold text-base">RCCG Peculiar Treasure Assembly</h1>
                     <p className="text-sm text-gray-600 whitespace-pre-line">
                        A family bound by love, fueled by prayer. {"\n"}
                        📍 Lagos, Nigeria
                     </p>
                     <a href="#" className="text-blue-900 text-sm font-semibold hover:underline">www.peculiartreasure.org</a>
                  </div>
               </div>
            </div>

            {/* Mobile Bio */}
            <div className="md:hidden px-1">
               <h1 className="font-bold text-sm">RCCG Peculiar Treasure Assembly</h1>
               <p className="text-sm text-gray-600 whitespace-pre-line">
                  A family bound by love, fueled by prayer. {"\n"}
                  📍 Lagos, Nigeria
               </p>
               <a href="#" className="text-blue-900 text-sm font-semibold hover:underline">www.peculiartreasure.org</a>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
               {currentUser ? (
                  <button className="flex-1 bg-gray-100 py-1.5 rounded-lg text-sm font-semibold text-gray-800">Edit Profile</button>
               ) : (
                  <button onClick={onLogin} className="flex-1 bg-rccg-blue text-white py-1.5 rounded-lg text-sm font-semibold">Sign in to Post</button>
               )}
               <button className="flex-1 bg-gray-100 py-1.5 rounded-lg text-sm font-semibold text-gray-800">Share Profile</button>
            </div>
         </div>

         {/* Highlights */}
         <div className="flex gap-4 px-4 overflow-x-auto pb-4 no-scrollbar mb-4">
            {highlights.map((h, i) => (
               <div key={i} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gray-200 border border-white">
                     <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                        <img src={h.img} alt={h.name} className="w-full h-full object-cover" />
                     </div>
                  </div>
                  <span className="text-xs text-gray-700">{h.name}</span>
               </div>
            ))}
         </div>

         {/* Tabs */}
         <div className="flex border-t border-gray-200 sticky top-[60px] bg-white z-30">
            <button className="flex-1 py-3 border-b border-black flex justify-center text-black">
               <Grid size={24} />
            </button>
            <button className="flex-1 py-3 flex justify-center text-gray-400">
               <Film size={24} />
            </button>
            <button className="flex-1 py-3 flex justify-center text-gray-400">
               <UserIcon size={24} />
            </button>
         </div>

         {/* Instagram Collage Grid */}
         <div className="grid grid-cols-3 gap-0.5 md:gap-1 lg:gap-4 pb-4">
            {posts.map((post) => (
               <div 
                  key={post.id} 
                  className="relative aspect-square group cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => setSelectedPost(post)}
               >
                  <img 
                     src={post.imageUrl} 
                     alt={post.caption} 
                     className="w-full h-full object-cover" 
                  />
                  {/* Hover Stats overlay (Desktop) */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center gap-6 text-white font-bold">
                     <div className="flex items-center gap-1"><Heart className="fill-white" size={20} /> {post.likes}</div>
                     <div className="flex items-center gap-1"><MessageCircle className="fill-white" size={20} /> {post.comments.length}</div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-3 px-6 flex justify-between items-center z-50 md:hidden">
         <Home size={28} onClick={goHome} className="cursor-pointer text-gray-900" />
         <Search size={28} className="cursor-pointer text-gray-400" />
         <PlusSquare size={28} onClick={openUpload} className="cursor-pointer text-gray-900" />
         <Heart size={28} className="cursor-pointer text-gray-400" />
         {currentUser ? (
            <img src={currentUser.avatar} className="w-7 h-7 rounded-full border border-gray-200" alt="Profile" />
         ) : (
            <UserIcon size={28} onClick={onLogin} className="cursor-pointer text-gray-400" />
         )}
      </div>


      {/* Upload Modal */}
      {isUploadOpen && currentUser && (
         <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-fade-in-up overflow-hidden">
               <div className="flex justify-between items-center p-4 border-b border-gray-100">
                  <button onClick={() => { setIsUploadOpen(false); setPreviewUrl(null); }} className="text-gray-500">Cancel</button>
                  <h3 className="text-base font-bold">New Post</h3>
                  <button 
                     onClick={handleUploadSubmit} 
                     disabled={!previewUrl || isUploading}
                     className="text-blue-500 font-bold disabled:opacity-50"
                  >
                     {isUploading ? 'Sharing...' : 'Share'}
                  </button>
               </div>
               
               <div className="p-4">
                  <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden mb-4 border border-gray-200">
                     {previewUrl ? (
                        <div className="relative w-full h-full">
                           <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                           <button onClick={removePreview} className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white"><X size={16} /></button>
                        </div>
                     ) : (
                        <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                           <ImageIcon size={48} className="mx-auto text-gray-300 mb-2" />
                           <p className="text-sm font-semibold text-blue-500">Select from device</p>
                        </div>
                     )}
                     <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                  </div>
                  
                  <div className="flex gap-3 items-start border-t border-gray-100 pt-4">
                     <img src={currentUser.avatar} className="w-8 h-8 rounded-full" />
                     <textarea 
                        value={newPostCaption}
                        onChange={(e) => setNewPostCaption(e.target.value)}
                        placeholder="Write a caption..."
                        className="flex-1 resize-none outline-none text-sm h-20"
                     />
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Feed Detail View (Lightbox) */}
      {selectedPost && (
         <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setSelectedPost(null)}>
            <div className="bg-white w-full max-w-4xl h-[90vh] md:h-[600px] rounded-r-xl rounded-l-xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in-up">
               
               {/* Image Side */}
               <div className="bg-black flex-1 flex items-center justify-center">
                  <img src={selectedPost.imageUrl} className="max-w-full max-h-full object-contain" />
               </div>

               {/* Interaction Side */}
               <div className="w-full md:w-[350px] bg-white flex flex-col h-full">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <img src={selectedPost.userAvatar} className="w-8 h-8 rounded-full border border-gray-200" />
                        <span className="text-sm font-bold">{selectedPost.userName}</span>
                     </div>
                     <MoreHorizontal size={20} className="text-gray-500" />
                  </div>

                  {/* Scrollable Comments Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     <div className="flex gap-3">
                        <img src={selectedPost.userAvatar} className="w-8 h-8 rounded-full border border-gray-200 shrink-0" />
                        <div>
                           <p className="text-sm"><span className="font-bold mr-2">{selectedPost.userName}</span>{selectedPost.caption}</p>
                           <p className="text-xs text-gray-400 mt-1">2h</p>
                        </div>
                     </div>
                     
                     {selectedPost.comments.map(c => (
                        <div key={c.id} className="flex gap-3">
                           <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold shrink-0">{c.username[0]}</div>
                           <div>
                              <p className="text-sm"><span className="font-bold mr-2">{c.username}</span>{c.text}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Actions Area */}
                  <div className="p-4 border-t border-gray-100">
                     <div className="flex justify-between mb-2">
                        <div className="flex gap-4">
                           <Heart 
                              size={24} 
                              onClick={() => handleLike(selectedPost.id)} 
                              className={`cursor-pointer ${selectedPost.likedBy.includes(currentUser?.id || '') ? 'fill-red-500 text-red-500' : 'hover:text-gray-500'}`} 
                           />
                           <MessageCircle size={24} className="hover:text-gray-500 cursor-pointer" />
                           <Share2 size={24} className="hover:text-gray-500 cursor-pointer" />
                        </div>
                        {currentUser?.id === selectedPost.userId && (
                           <Trash2 size={24} onClick={() => handleDeletePost(selectedPost.id)} className="text-gray-400 hover:text-red-500 cursor-pointer" />
                        )}
                     </div>
                     <p className="font-bold text-sm mb-2">{selectedPost.likes} likes</p>
                     
                     {/* Comment Input */}
                     <div className="flex items-center gap-2 mt-2">
                        <input 
                           type="text" 
                           placeholder="Add a comment..." 
                           value={commentInput}
                           onChange={(e) => setCommentInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(selectedPost.id)}
                           className="flex-1 text-sm outline-none"
                        />
                        <button 
                           disabled={!commentInput.trim()} 
                           onClick={() => handleCommentSubmit(selectedPost.id)}
                           className="text-blue-500 text-sm font-bold disabled:opacity-50"
                        >
                           Post
                        </button>
                     </div>
                  </div>
               </div>
            </div>
            
            <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 text-white hover:text-gray-300">
               <X size={32} />
            </button>
         </div>
      )}
    </div>
  );
};

export default Gallery;
