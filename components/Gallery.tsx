import React, { useState, useRef } from 'react';
import {
  Heart, MessageCircle, Share2, X, Camera, Image as ImageIcon,
  Trash2, Grid, Film, User as UserIcon, Home, Search,
  PlusSquare, MoreHorizontal, ArrowLeft, Send, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Toaster, toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { SocialPost, User } from '../types';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_POSTS: SocialPost[] = [
  {
    id: '1', userId: 'admin', userName: 'Ambassador Media Team',
    userAvatar: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'High praise during today\'s Celebration Service! The atmosphere was electric. 🔥🙌 #SundayService #PTA',
    likes: 124, likedBy: [],
    comments: [{ id: 'c1', username: 'sis_grace', text: 'It was awesome!', timestamp: Date.now() }],
    timestamp: Date.now() - 7200000,
  },
  {
    id: '2', userId: 'youth', userName: 'PTA Youth',
    userAvatar: 'https://images.unsplash.com/photo-1529070538774-1843cb6e65b3?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Community outreach was a success. Spreading the love of Christ! ❤️',
    likes: 89, likedBy: [], comments: [], timestamp: Date.now() - 14400000,
  },
  {
    id: '3', userId: 'choir_dept', userName: 'PTA Levites',
    userAvatar: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e3720?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Rehearsals for the special thanksgiving service. Get ready for a shift! 🎵🎹 #Worship #Levites',
    likes: 56, likedBy: [], comments: [], timestamp: Date.now() - 86400000,
  },
  {
    id: '4', userId: 'pastorate', userName: "Pastor's Desk",
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Studying the word. "Thy word is a lamp unto my feet". Join us for Digging Deep this Tuesday. 📖',
    likes: 210, likedBy: [],
    comments: [{ id: 'c2', username: 'bro_mike', text: "Amen! Can't wait.", timestamp: Date.now() }],
    timestamp: Date.now() - 172800000,
  },
  {
    id: '5', userId: 'sis_sarah', userName: 'Sis. Sarah',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Beautiful moments with the family of God. #SundayBest',
    likes: 45, likedBy: [], comments: [], timestamp: Date.now() - 259200000,
  },
  {
    id: '6', userId: 'rccg_global', userName: 'RCCG Info',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Special announcement for upcoming convention.',
    likes: 330, likedBy: [], comments: [], timestamp: Date.now() - 345600000,
  },
  {
    id: '7', userId: 'children_church', userName: 'Heritage of the Lord',
    userAvatar: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1536337005238-94b997371b40?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Our children learning about David and Goliath today! 🌟',
    likes: 92, likedBy: [], comments: [], timestamp: Date.now() - 432000000,
  },
  {
    id: '8', userId: 'evangelism', userName: 'Evangelism Team',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Jesus loves you. Tell a friend today.',
    likes: 150, likedBy: [], comments: [], timestamp: Date.now() - 518400000,
  },
  {
    id: '9', userId: 'choir_dept2', userName: 'PTA Levites',
    userAvatar: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1525939864633-45e6208628eb?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Singing praises to the King of Kings.',
    likes: 78, likedBy: [], comments: [], timestamp: Date.now() - 604800000,
  },
  {
    id: '10', userId: 'media', userName: 'PTA Media',
    userAvatar: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Capturing moments of grace.',
    likes: 112, likedBy: [], comments: [], timestamp: Date.now() - 691200000,
  },
  {
    id: '11', userId: 'ushering', userName: 'PTA Ushers',
    userAvatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Serving with a smile. Welcome to church!',
    likes: 95, likedBy: [], comments: [], timestamp: Date.now() - 777600000,
  },
  {
    id: '12', userId: 'prayer_band', userName: 'Prayer Warriors',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=800&h=800&auto=format&fit=crop',
    caption: 'Interceding for the nation. Join us every Saturday.',
    likes: 88, likedBy: [], comments: [], timestamp: Date.now() - 864000000,
  },
];

const HIGHLIGHTS = [
  { name: 'Service',  img: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=100&auto=format&fit=crop' },
  { name: 'Word',     img: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=100&auto=format&fit=crop' },
  { name: 'Youth',   img: 'https://images.unsplash.com/photo-1529070538774-1843cb6e65b3?q=80&w=100&auto=format&fit=crop' },
  { name: 'Choir',   img: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=100&auto=format&fit=crop' },
  { name: 'Outreach',img: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=100&auto=format&fit=crop' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface GalleryProps {
  currentUser: User | null;
  onLogin: () => void;
  isAuthLoading: boolean;
}

// ─── Post Card ────────────────────────────────────────────────────────────────
const PostCard: React.FC<{
  post: SocialPost;
  currentUser: User | null;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onOpen: (post: SocialPost) => void;
}> = ({ post, currentUser, onLike, onComment, onDelete, onOpen }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100"
      style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.07)' }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shrink-0">
            <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{post.userName}</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
              {formatDistanceToNow(new Date(post.timestamp))} ago
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentUser?.id === post.userId && (
            <button onClick={() => onDelete(post.id)} className="text-gray-300 hover:text-rccg-red transition-colors">
              <Trash2 size={17} />
            </button>
          )}
          <MoreHorizontal size={20} className="text-gray-300 cursor-pointer" />
        </div>
      </div>

      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden bg-rccg-cream cursor-pointer"
        onClick={() => onOpen(post)}
      >
        <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
      </div>

      {/* Actions */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-5 mb-3">
          <button onClick={() => onLike(post.id)} className="flex items-center gap-1.5 group">
            <Heart
              size={22}
              className={`transition-all duration-200 ${isLiked ? 'fill-rccg-red text-rccg-red scale-110' : 'text-gray-700 group-hover:text-rccg-red'}`}
            />
            <span className="text-sm font-semibold text-gray-700">{post.likes}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 group">
            <MessageCircle size={22} className="text-gray-700 group-hover:text-rccg-green transition-colors" />
            <span className="text-sm font-semibold text-gray-700">{post.comments.length}</span>
          </button>
          <button className="group ml-auto">
            <Share2 size={22} className="text-gray-700 group-hover:text-rccg-blue transition-colors" />
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm leading-relaxed text-gray-800 mb-3">
            <span className="font-bold mr-1.5">{post.userName}</span>
            {post.caption}
          </p>
        )}

        {/* Collapsible Comments */}
        <AnimatePresence>
          {showComments && post.comments.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 mb-3 pt-2 border-t border-gray-100">
                {post.comments.map((c) => (
                  <p key={c.id} className="text-sm text-gray-700">
                    <span className="font-bold mr-1.5">{c.username}</span>
                    <span className="text-gray-600">{c.text}</span>
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment Input */}
        <form onSubmit={handleComment} className="flex items-center gap-2 mt-1">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-rccg-cream rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rccg-green/20 text-gray-700"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="text-rccg-green opacity-60 hover:opacity-100 disabled:opacity-30 transition-opacity"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </motion.article>
  );
};

// ─── Post Modal ───────────────────────────────────────────────────────────────
const PostModal: React.FC<{
  post: SocialPost;
  currentUser: User | null;
  onClose: () => void;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}> = ({ post, currentUser, onClose, onLike, onComment, onDelete }) => {
  const [commentText, setCommentText] = useState('');
  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden flex flex-col md:flex-row"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}
      >
        {/* Image */}
        <div className="flex-1 bg-rccg-cream">
          <img src={post.imageUrl} alt="Moment" className="w-full h-full object-cover" />
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-[380px] flex flex-col bg-white">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={post.userAvatar} className="w-9 h-9 rounded-full border border-gray-100" alt={post.userName} />
              <div>
                <p className="font-semibold text-sm">{post.userName}</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">
                  {formatDistanceToNow(new Date(post.timestamp))} ago
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors">
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {post.caption && (
              <p className="text-sm leading-relaxed text-gray-800">
                <span className="font-bold mr-1.5">{post.userName}</span>
                {post.caption}
              </p>
            )}
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Comments</p>
            {post.comments.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No comments yet. Be the first!</p>
            ) : (
              post.comments.map((c) => (
                <p key={c.id} className="text-sm text-gray-700">
                  <span className="font-bold mr-1.5">{c.username}</span>
                  <span className="text-gray-600">{c.text}</span>
                </p>
              ))
            )}
          </div>

          <div className="p-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-5">
                <button onClick={() => onLike(post.id)} className="flex items-center gap-1.5 group">
                  <Heart
                    size={22}
                    className={`transition-all ${isLiked ? 'fill-rccg-red text-rccg-red' : 'text-gray-700 group-hover:text-rccg-red'}`}
                  />
                  <span className="text-sm font-semibold">{post.likes}</span>
                </button>
                <Share2 size={22} className="text-gray-700 hover:text-rccg-blue cursor-pointer transition-colors" />
              </div>
              {currentUser?.id === post.userId && (
                <button onClick={() => { onDelete(post.id); onClose(); }} className="text-gray-300 hover:text-rccg-red transition-colors">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
            <form onSubmit={handleComment} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-rccg-cream rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-rccg-green/20"
              />
              <button type="submit" disabled={!commentText.trim()} className="text-rccg-green opacity-60 hover:opacity-100 disabled:opacity-30 transition-opacity">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Upload Modal ─────────────────────────────────────────────────────────────
const UploadModal: React.FC<{
  currentUser: User;
  onClose: () => void;
  onSubmit: (caption: string, imageUrl: string) => Promise<void>;
}> = ({ currentUser, onClose, onSubmit }) => {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, multiple: false,
  } as any);

  const handleSubmit = async () => {
    if (!image) return;
    setUploading(true);
    await onSubmit(caption, image);
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-serif italic text-rccg-green font-semibold">Share a Moment</h2>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors">Cancel</button>
        </div>

        <div className="p-6">
          {!image ? (
            <div
              {...getRootProps()}
              className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragActive ? 'border-rccg-green bg-rccg-cream' : 'border-gray-200 hover:border-rccg-green/40 hover:bg-rccg-cream/50'
              }`}
            >
              <input {...getInputProps()} />
              <Camera size={44} className="text-rccg-green/30 mb-3" />
              <p className="text-sm font-semibold text-gray-600">Drop your photo here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-rccg-cream relative group">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => setImage(null)}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Change
                </button>
              </div>
              <div className="flex items-start gap-3">
                <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-gray-100 shrink-0 mt-2" alt="You" />
                <textarea
                  placeholder="Write a caption... #ServiceMoment"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="flex-1 bg-rccg-cream rounded-2xl p-3 text-sm outline-none focus:ring-2 focus:ring-rccg-green/20 h-20 resize-none text-gray-700"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="w-full bg-rccg-green text-white py-3.5 rounded-full font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {uploading ? 'Sharing...' : 'Share to Feed'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main Gallery ─────────────────────────────────────────────────────────────
const Gallery: React.FC<GalleryProps> = ({ currentUser, onLogin, isAuthLoading }) => {
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [view, setView] = useState<'feed' | 'grid'>('feed');

  const goHome = () => { window.location.hash = ''; };

  const handleLike = (postId: string) => {
    if (!currentUser) { onLogin(); return; }
    const update = (post: SocialPost): SocialPost => {
      if (post.id !== postId) return post;
      const isLiked = post.likedBy.includes(currentUser.id);
      return {
        ...post,
        likes: isLiked ? post.likes - 1 : post.likes + 1,
        likedBy: isLiked ? post.likedBy.filter(id => id !== currentUser.id) : [...post.likedBy, currentUser.id],
      };
    };
    setPosts(c => c.map(update));
    setSelectedPost(p => p ? update(p) : null);
  };

  const handleComment = (postId: string, text: string) => {
    if (!currentUser) { onLogin(); return; }
    const newComment = { id: Date.now().toString(), username: currentUser.name, text, timestamp: Date.now() };
    const update = (post: SocialPost): SocialPost =>
      post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post;
    setPosts(c => c.map(update));
    setSelectedPost(p => p ? update(p) : null);
    toast.success('Comment added!');
  };

  const handleDelete = (postId: string) => {
    if (!confirm('Delete this post?')) return;
    setPosts(c => c.filter(p => p.id !== postId));
    setSelectedPost(null);
    toast.success('Post deleted.');
  };

  const handleUploadSubmit = async (caption: string, imageUrl: string) => {
    if (!currentUser) return;
    await new Promise(r => setTimeout(r, 1200));
    const newPost: SocialPost = {
      id: Date.now().toString(),
      userId: currentUser.id, userName: currentUser.name, userAvatar: currentUser.avatar,
      imageUrl, caption, likes: 0, likedBy: [], comments: [], timestamp: Date.now(),
    };
    setPosts(c => [newPost, ...c]);
    setIsUploadOpen(false);
    toast.success('Moment shared! 🎉');
  };

  const openUpload = () => { currentUser ? setIsUploadOpen(true) : onLogin(); };

  return (
    <div className="min-h-screen bg-rccg-cream pb-24 md:pb-0 font-sans">
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '999px', fontSize: '14px' } }} />

      {/* Desktop Top Nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={goHome} className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-rccg-green flex items-center justify-center">
              <span className="text-white text-xs font-bold">PTA</span>
            </div>
            <h1 className="text-lg font-serif italic font-semibold text-rccg-green">Ambassadors Social</h1>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setView('feed')} className={`text-sm font-medium transition-colors ${view === 'feed' ? 'text-rccg-green' : 'text-gray-400 hover:text-gray-600'}`}>
              Feed
            </button>
            <button onClick={() => setView('grid')} className={`text-sm font-medium transition-colors ${view === 'grid' ? 'text-rccg-green' : 'text-gray-400 hover:text-gray-600'}`}>
              Gallery
            </button>
            <button onClick={openUpload} className="bg-rccg-green text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <PlusSquare size={16} /> Share Moment
            </button>
            {currentUser ? (
              <img src={currentUser.avatar} className="w-8 h-8 rounded-full border-2 border-rccg-green/20" alt="You" />
            ) : (
              <button onClick={onLogin} className="text-sm font-medium text-rccg-blue hover:underline">Sign In</button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={goHome} className="text-gray-500"><ArrowLeft size={22} /></button>
          <h1 className="text-base font-serif italic font-semibold text-rccg-green">Ambassadors Social</h1>
        </div>
        <button onClick={openUpload} className="text-rccg-green"><PlusSquare size={24} /></button>
      </header>

      {/* Main */}
      <main className="max-w-xl mx-auto px-4 pt-20 md:pt-24">

        {/* Highlights */}
        <div className="flex gap-4 overflow-x-auto py-6 no-scrollbar">
          {HIGHLIGHTS.map((h) => (
            <div key={h.name} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-rccg-gold via-rccg-red to-rccg-blue">
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                  <img src={h.img} alt={h.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">{h.name}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setView('feed')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors ${
              view === 'feed' ? 'border-rccg-green text-rccg-green' : 'border-transparent text-gray-300 hover:text-gray-500'
            }`}
          >
            <Film size={15} /> Feed
          </button>
          <button
            onClick={() => setView('grid')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold border-b-2 transition-colors ${
              view === 'grid' ? 'border-rccg-green text-rccg-green' : 'border-transparent text-gray-300 hover:text-gray-500'
            }`}
          >
            <Grid size={15} /> Gallery
          </button>
        </div>

        {/* Feed View */}
        {view === 'feed' && (
          <div className="space-y-10 pb-10">
            {posts.map((post) => (
              <PostCard
                key={post.id} post={post} currentUser={currentUser}
                onLike={handleLike} onComment={handleComment}
                onDelete={handleDelete} onOpen={setSelectedPost}
              />
            ))}
          </div>
        )}

        {/* Grid View */}
        {view === 'grid' && (
          <div className="grid grid-cols-3 gap-1 md:gap-2 pb-10">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedPost(post)}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer relative group bg-gray-100"
              >
                <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                  <span className="flex items-center gap-1 text-sm font-bold"><Heart size={16} className="fill-white" /> {post.likes}</span>
                  <span className="flex items-center gap-1 text-sm font-bold"><MessageCircle size={16} className="fill-white" /> {post.comments.length}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 px-6 h-16 flex items-center justify-between">
        <Home size={24} onClick={goHome} className="cursor-pointer text-gray-400 hover:text-gray-700 transition-colors" />
        <Search size={24} className="text-gray-300" />
        <div
          onClick={openUpload}
          className="w-12 h-12 rounded-full bg-rccg-green flex items-center justify-center text-white -mt-8 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ boxShadow: '0 8px 24px rgba(0,104,56,0.35)' }}
        >
          <PlusSquare size={22} />
        </div>
        <Bell size={24} className="text-gray-300" />
        {currentUser ? (
          <img src={currentUser.avatar} className="w-7 h-7 rounded-full border-2 border-rccg-green/20 cursor-pointer" alt="Profile" />
        ) : (
          <UserIcon size={24} onClick={onLogin} className="text-gray-400 cursor-pointer" />
        )}
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {isUploadOpen && currentUser && (
          <UploadModal
            key="upload"
            currentUser={currentUser}
            onClose={() => setIsUploadOpen(false)}
            onSubmit={handleUploadSubmit}
          />
        )}
        {selectedPost && (
          <PostModal
            key="modal"
            post={selectedPost}
            currentUser={currentUser}
            onClose={() => setSelectedPost(null)}
            onLike={handleLike}
            onComment={handleComment}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;