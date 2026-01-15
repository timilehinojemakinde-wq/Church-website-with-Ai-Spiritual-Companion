
import React, { useState } from 'react';
import { Send, Sparkles, X, Copy, Check, BookOpen, Feather, Share2, Mail, MessageCircle } from 'lucide-react';
import { generateDevotional } from '../services/geminiService';
import { DevotionalResponse, LoadingState } from '../types';

const DevotionalAI: React.FC = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [devotional, setDevotional] = useState<DevotionalResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setStatus(LoadingState.LOADING);
    setDevotional(null);
    try {
      const data = await generateDevotional(input);
      setDevotional(data);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const getShareContent = () => {
     if (!devotional) return '';
     return `✝️ *${devotional.title}*\n\n"${devotional.empathy}"\n\n💡 *Insight:*\n${devotional.wisdom}\n\n📖 *Scripture:*\n${devotional.scripture}\n\n🙏 *Prayer:*\n${devotional.prayer}\n\n_Received from RCCG Peculiar Treasure Assembly_`;
  };

  const copyToClipboard = () => {
     if (!devotional) return;
     const text = getShareContent();
     navigator.clipboard.writeText(text);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsappShare = () => {
    const text = encodeURIComponent(getShareContent());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    const text = getShareContent();
    if (navigator.share) {
      try {
        await navigator.share({
          title: devotional?.title,
          text: text,
          url: window.location.href
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <section id="devotional" className="py-32 bg-white relative">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 mb-6">
              <Sparkles size={14} className="text-rccg-red" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Spiritual Direction</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-serif text-black mb-6">How can we pray with you?</h2>
           <p className="text-lg text-gray-500 font-light">
              Share what's on your heart. Receive deep, specific, and biblical wisdom tailored for your situation.
           </p>
        </div>

        {/* Input Area */}
        {!devotional && (
           <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50 p-2">
              <div className="relative">
                 <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="I'm feeling overwhelmed and need peace..."
                    className="w-full h-40 p-6 text-lg font-light text-black placeholder-gray-300 resize-none outline-none bg-transparent"
                    disabled={status === LoadingState.LOADING}
                 />
                 <div className="flex justify-between items-center px-4 pb-4">
                    <span className="text-xs text-gray-300 font-medium uppercase tracking-wider">AI Pastoral Care</span>
                    <button 
                       onClick={handleGenerate}
                       disabled={!input.trim() || status === LoadingState.LOADING}
                       className="flex items-center gap-2 px-6 py-3 bg-rccg-red text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-rccg-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-rccg-red/30"
                    >
                       {status === LoadingState.LOADING ? 'Interceding...' : 'Receive Counsel'} <Send size={14} />
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* Result Card */}
        {devotional && (
           <div className="animate-fade-in-up max-w-3xl mx-auto">
              <div className="bg-[#FFFCF8] border border-[#F0EAE0] rounded-xl p-8 md:p-16 relative shadow-sm">
                 
                 <button onClick={() => { setDevotional(null); setInput(''); }} className="absolute top-6 right-6 text-gray-300 hover:text-black transition-colors">
                    <X size={20} />
                 </button>

                 <div className="text-center mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{devotional.title}</p>
                 </div>

                 <div className="space-y-10">
                    
                    {/* Empathy */}
                    <p className="text-xl text-gray-500 font-serif italic text-center leading-relaxed">
                       "{devotional.empathy}"
                    </p>

                    <div className="w-12 h-px bg-rccg-gold mx-auto"></div>

                    {/* Main Wisdom */}
                    <div className="max-w-2xl mx-auto">
                       <p className="text-2xl md:text-3xl text-gray-900 font-serif text-center leading-snug mb-8">
                          {devotional.wisdom}
                       </p>
                       
                       <div className="flex items-center justify-center gap-2 text-gray-400 text-sm uppercase tracking-widest font-bold">
                          <BookOpen size={14} />
                          {devotional.scripture}
                       </div>
                    </div>

                    {/* Action & Prayer */}
                    <div className="grid md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-100">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                           <div className="flex items-center gap-2 mb-3 text-rccg-blue">
                              <Feather size={16} />
                              <span className="text-xs font-bold uppercase tracking-widest">One Step</span>
                           </div>
                           <p className="text-gray-700 text-sm leading-relaxed font-medium">{devotional.action}</p>
                        </div>

                        <div className="bg-rccg-red/5 p-6 rounded-xl border border-rccg-red/10">
                           <div className="flex items-center gap-2 mb-3 text-rccg-red">
                              <Sparkles size={16} />
                              <span className="text-xs font-bold uppercase tracking-widest">Prayer</span>
                           </div>
                           <p className="text-gray-800 font-serif italic text-sm leading-relaxed">"{devotional.prayer}"</p>
                        </div>
                    </div>
                 </div>

                 {/* Share Actions */}
                 <div className="mt-12 pt-8 border-t border-gray-100">
                    <div className="flex flex-wrap justify-center gap-4">
                        <button 
                           onClick={handleWhatsappShare}
                           className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                           <MessageCircle size={16} /> WhatsApp
                        </button>

                        <button 
                           onClick={handleNativeShare}
                           className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                           <Share2 size={16} /> Share
                        </button>

                        <button 
                           onClick={copyToClipboard}
                           className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors text-xs font-bold uppercase tracking-wider"
                        >
                           {copied ? <Check size={16} /> : <Copy size={16} />}
                           {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </div>
    </section>
  );
};

export default DevotionalAI;
