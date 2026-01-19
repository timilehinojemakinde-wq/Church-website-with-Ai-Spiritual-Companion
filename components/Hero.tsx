import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, BookOpen, Volume2, Loader2, Square, Feather, HandHeart, Bot, ShieldAlert, BrainCircuit, Hammer, Footprints } from 'lucide-react';
import { generateDevotional, generateDevotionalAudio } from '../services/geminiService';
import getSpiritualGuidance from '../services/openaiService';
import { DevotionalResponse, LoadingState } from '../types';

const Hero: React.FC = () => {

   // ---New Hero Image Slideshow ---
   const heroImages = [
      '/images/hero 1.jpg',
      '/images/hero 2.jpg',
      '/images/hero 3.jpg',
      '/images/hero 4.jpg',
   ];
   const [currentBackground, setCurrentBackground] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentBackground((prevIndex) => (prevIndex + 1) % heroImages.length);
      }, 5000); // Change image every 5 seconds
      return () => clearInterval(interval);
   }, []);

   // ---existing AI chat
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [response, setResponse] = useState<DevotionalResponse | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Connecting...");
  
  // Audio State
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  const responseRef = useRef<HTMLDivElement>(null);

  // Handle AI Counseling Request
  const handleCounselingRequest = async () => {
    if (!input.trim()) return;
    setStatus(LoadingState.LOADING);
    stopAudio();
    try {
      const aiReply = await getSpiritualGuidance(input);
      setResponse(aiReply);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleAudioPlayback = async () => {
    if (!response) return;

    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsAudioLoading(true);

    try {
      const textToRead = `
        ${response.empathy}
        
        ${response.wisdom}
        
        The scripture says: ${response.scripture}
        
        Faith in action: ${response.action}
        
        Let's pray. ${response.prayer}
      `;
      
      const audioBase64 = await generateDevotionalAudio(textToRead);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const audioBuffer = await decodeAudioData(
        decode(audioBase64),
        audioContextRef.current,
        24000,
        1
      );

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsPlaying(false);
      };

      source.start(0);
      sourceRef.current = source;
      setIsPlaying(true);

    } catch (error) {
      console.error("Audio Playback Failed", error);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const stopAudio = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [response]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (status === LoadingState.LOADING) {
      const messages = [
        "Listening to your heart...",
        "Consulting the Word...",
        "Defining practical steps...",
        "Faith without works is dead...",
      ];
      let index = 0;
      
      intervalId = setInterval(() => {
        index = (index + 1) % messages.length;
        setLoadingMessage(messages[index]);
      }, 2500);
    }
    return () => clearInterval(intervalId);
  }, [status]);

  const resetForm = () => {
    stopAudio();
    setResponse(null);
    setInput('');
    setStatus(LoadingState.IDLE);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      
      {/* Background Image with Slow Zoom */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
      {heroImages.map((image, index) => ( 
      <img
         key={index}
         src={image}
         alt={`Hero ${index}`}
         className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentBackground ? "opacity-80" : "opacity-0"}`}
      />
      ))}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>
        {/* Radial gradient for cinematic spotlight effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40 z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full z-20 pt-32 lg:pt-0">
         <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Branding */}
            <div className="lg:col-span-7 order-1 lg:order-none text-white">
               <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-1 bg-rccg-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,0.5)]"></div>
                     <span className="text-xs font-bold uppercase tracking-[0.2em] text-rccg-gold drop-shadow-sm">Welcome Home</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-6 drop-shadow-xl">
                     Where <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-rccg-gold to-yellow-200">Heaven</span><br />
                     Touches Earth.
                  </h1>

                  <p className="text-lg text-white/80 font-light leading-relaxed max-w-lg mb-10 drop-shadow-md">
                     Welcome to The Ambassadors. A family bound by love, fueled by prayer, and destined for greatness.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                     <a href="#services" className="px-10 py-4 bg-rccg-red text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 border border-rccg-red">
                        Join Us this Sunday
                     </a>
                  </div>
               </div>
            </div>

            {/* Right Column: AI Companion - Light Theme Enhanced & Simplified */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end order-2 lg:order-none">
               <div className="relative w-25 max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-in">
                  
                  {/* Header - Minimal */}
                  <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rccg-blue flex items-center justify-center text-white shadow-md">
                           <BrainCircuit size={16} />
                        </div>
                        <span className="text-sm font-bold text-gray-900 tracking-wide">AI Spiritual Companion</span>
                     </div>
                     {response && (
                       <button onClick={resetForm} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors">
                         <X size={18} />
                       </button>
                     )}
                  </div>

                  {/* Body */}
                  <div className="p-6 bg-white relative min-h-[320px] flex flex-col">
                     
                     {!response ? (
                        status === LoadingState.LOADING ? (
                           <div className="flex-grow flex flex-col items-center justify-center text-center py-10">
                              <Loader2 className="w-10 h-10 text-rccg-blue animate-spin mb-4" />
                              <p className="text-sm font-medium text-gray-600 animate-pulse">{loadingMessage}</p>
                           </div>
                        ) : (
                           <div className="flex-grow flex flex-col h-full justify-between gap-4 animate-fade-in">
                              
                              <div className="flex-grow">
                                 <label className="block text-sm text-gray-500 mb-3 font-medium">
                                    How can we help you today?
                                 </label>
                                 <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="I'm feeling stuck in my career and need direction..."
                                    className="w-full h-32 p-4 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-rccg-blue focus:ring-1 focus:ring-rccg-blue focus:outline-none transition-all resize-none text-sm leading-relaxed"
                                    disabled={status === LoadingState.LOADING}
                                 />
                                 
                                 {/* Minimal Disclaimer */}
                                 <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-400">
                                    <ShieldAlert size={12} />
                                    <span>ai responses can be inaccurate or misleading.</span>
                                 </div>
                              </div>

                              <button 
                                 onClick={handleCounselingRequest}
                                 disabled={!input.trim() || status === LoadingState.LOADING}
                                 className="w-full py-4 bg-gradient-to-r from-[#1B1464] to-[#003366] text-white rounded-xl flex items-center justify-center gap-2 hover:from-rccg-blue hover:to-[#1B1464] transition-all shadow-xl shadow-rccg-blue/20 border border-rccg-blue/30 font-bold tracking-wide text-xs uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                 Ask AI
                              </button>
                           </div>
                        )
                     ) : (
                        <div ref={responseRef} className="flex flex-col h-full animate-fade-in overflow-y-auto custom-scrollbar max-h-[400px] pr-2">
                           
                           <div className="mb-4 pb-3 border-b border-gray-50">
                              <div className="flex justify-between items-center">
                                <h4 className="text-lg font-serif font-bold text-gray-900 leading-tight">{response.title}</h4>
                                <button 
                                  onClick={handleAudioPlayback}
                                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${isPlaying ? 'bg-rccg-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                  {isAudioLoading ? <Loader2 size={14} className="animate-spin" /> : isPlaying ? <Square size={12} className="fill-current" /> : <Volume2 size={14} />}
                                </button>
                              </div>
                           </div>

                           <div className="space-y-4 text-sm">
                              <p className="text-gray-600 italic leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-rccg-blue">
                                 "{response.empathy}"
                              </p>

                              <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-amber-600">
                                    <Bot size={14} />
                                    <span className="text-[10px] font-bold uppercase">Wisdom</span>
                                 </div>
                                 <p className="text-gray-900 font-medium leading-relaxed">
                                    {response.wisdom}
                                 </p>
                              </div>

                              <div className="flex gap-2 items-start text-gray-500 text-xs">
                                 <BookOpen size={14} className="mt-0.5 shrink-0" />
                                 <span>{response.scripture}</span>
                              </div>

                              <div className="grid grid-cols-1 gap-3 pt-2">
                                 <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                    <div className="flex items-center gap-2 mb-1 text-emerald-700">
                                       <Footprints size={12} />
                                       <span className="text-[10px] font-bold uppercase">Faith In Action (Physical Step)</span>
                                    </div>
                                    <p className="text-gray-800 leading-relaxed font-medium">{response.action}</p>
                                 </div>
                                 
                                 <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                    <div className="flex items-center gap-2 mb-1 text-purple-700">
                                       <HandHeart size={12} />
                                       <span className="text-[10px] font-bold uppercase">Prayer</span>
                                    </div>
                                    <p className="text-gray-800 italic">"{response.prayer}"</p>
                                 </div>
                              </div>
                           </div>

                           <div className="mt-6 text-center sticky bottom-0 bg-gradient-to-t from-white pt-4">
                             <button 
                                 onClick={resetForm}
                                 className="text-xs text-gray-400 hover:text-rccg-blue font-bold uppercase tracking-widest transition-colors"
                              >
                                 Ask New Question
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

// Audio Decoding Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export default Hero;